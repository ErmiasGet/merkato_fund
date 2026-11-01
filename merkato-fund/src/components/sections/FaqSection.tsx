import { useState } from 'react'
import { faqs } from '../../data/siteContent'
import { Icon } from '../ui/Icon'
import { useSiteData } from '../../lib/useSiteData'
import { useLanguage } from '../../lib/useLanguage'

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { settings } = useSiteData()
  const { t } = useLanguage()
  const customFaqs = settings.faqs
  const shownFaqs: { question: string; answer: string }[] = Array.isArray(customFaqs)
    ? customFaqs as { question: string; answer: string }[]
    : faqs.map(([question, answer]) => ({ question, answer }))

  return <section id="faqs" className="section faq">
    <div className="container faq-layout">
      <div className="faq-intro"><p className="eyebrow">{t('Questions, answered clearly')}</p><h2>{t('Frequently Asked Questions')}</h2><p>{t('Answers are editable and should be reconciled with officially approved program rules before publication.')}</p><a href="#contact" className="text-link">{t('Still have a question? Contact us')} <Icon name="arrow"/></a></div>
      <div className="accordion">{shownFaqs.map(({ question, answer }, index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{t(question)}</span><i aria-hidden="true">{openFaq === index ? '−' : '+'}</i></button><div className="faq-answer"><p>{t(answer)}</p></div></div>)}</div>
    </div>
  </section>
}