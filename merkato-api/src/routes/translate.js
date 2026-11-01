import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'

export const translateRouter = Router()

const requestSchema = z.object({
  texts: z.array(z.string().trim().min(1).max(5000)).min(1).max(100),
})
const translationCache = new Map()
const cacheLimit = 5000
const translationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false })

translateRouter.get('/status', (_req, res) => res.json({ configured: Boolean(process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY), source: 'en', target: 'am' }))

function decodeGoogleText(value) {
  return value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

translateRouter.post('/', translationLimiter, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid translation request.' })

  const texts = [...new Set(parsed.data.texts)]
  if (texts.reduce((total, text) => total + text.length, 0) > 24_000) {
    return res.status(413).json({ error: 'Translation request is too large.' })
  }

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Amharic translation is not configured. Set GOOGLE_CLOUD_TRANSLATE_API_KEY on the API server.' })

  const missingTexts = texts.filter((text) => !translationCache.has(text))
  if (missingTexts.length) {
    try {
      const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
        body: JSON.stringify({ q: missingTexts, source: 'en', target: 'am', format: 'text' }),
        signal: AbortSignal.timeout(15_000),
      })
      if (!response.ok) {
        console.error(`Google Translation request failed with status ${response.status}.`)
        return res.status(502).json({ error: 'Translation service is temporarily unavailable.' })
      }
      const result = await response.json()
      const translations = result?.data?.translations
      if (!Array.isArray(translations) || translations.length !== missingTexts.length) {
        console.error('Google Translation returned an unexpected response.')
        return res.status(502).json({ error: 'Translation service returned an invalid response.' })
      }
      const batchTranslations = translations.map((item) => typeof item?.translatedText === 'string' ? decodeGoogleText(item.translatedText) : null)
      if (batchTranslations.some((translation) => translation === null)) {
        console.error('Google Translation returned a translation without text.')
        return res.status(502).json({ error: 'Translation service returned an invalid response.' })
      }
      batchTranslations.forEach((translation, index) => {
        if (translationCache.size >= cacheLimit) translationCache.delete(translationCache.keys().next().value)
        translationCache.set(missingTexts[index], translation)
      })
    } catch (error) {
      console.error(`Google Translation request failed: ${error.name}`)
      return res.status(502).json({ error: 'Translation service is temporarily unavailable.' })
    }
  }

  return res.json({ translations: parsed.data.texts.map((text) => translationCache.get(text) ?? text) })
})