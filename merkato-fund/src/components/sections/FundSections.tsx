
import { useEffect, useState } from 'react'
import { financialTerms, processSteps } from '../../data/siteContent'
import { useSiteData } from '../../lib/useSiteData'
import { Icon, type IconName } from '../ui/Icon'
import { useLanguage } from '../../lib/useLanguage'

const metrics = [
  {
    label: 'Members',
    value: 100000,
    suffix: '+',
    detail: 'Registered program members',
    icon: 'user' as IconName,
  },
  {
    label: 'Daily Saving',
    value: 50,
    suffix: ' Birr',
    detail: 'Contribution per member',
    icon: 'wallet' as IconName,
  },
  {
    label: 'Daily Collected Money',
    value: 500000,
    suffix: ' Birr',
    detail: 'Based on 100,000 members',
    icon: 'wallet' as IconName,
  },
  {
    label: 'Daily Winners',
    value: 5,
    suffix: ' Members',
    detail: 'Selected members per day',
    icon: 'sun' as IconName,
  },
  {
    label: 'Payment per Person',
    value: 1000000,
    suffix: ' Birr',
    detail: 'Proposed payout per winner',
    icon: 'user' as IconName,
  },
  {
    label: 'Daily Payouts',
    value: 5000000,
    suffix: ' Birr',
    detail: 'Total for five winners',
    icon: 'wallet' as IconName,
  },
]

function CountUp({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame = 0
    const duration = 1800
    let start: number | undefined

    const animate = (time: number) => {
      if (start === undefined) start = time

      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)

      setCount(Math.floor(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <>
      {count.toLocaleString('en-US')}
      {suffix}
    </>
  )
}

export function OpportunitySection() {
  const { t } = useLanguage()
  return (
    <section id="the-fund" className="section opportunity">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('THE OPPORTUNITY')}</p>
            <h2>
              {t('An Opportunity Built')}
              <br />
              {t('Around Your Ambition')}
            </h2>
          </div>
          <p>
            {t('Discover the proposed contribution model, understand the conditions, and review the details before participating.')}
          </p>
        </div>

        <div className="opportunity-grid metrics-grid">
          {metrics.map((metric, index) => (
            <article className="info-card metric-card" key={metric.label}>
              <div className="metric-top">
                <span className="card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="metric-icon">
                  <Icon name={metric.icon} size={25} />
                </span>
              </div>

              <p className="card-label">{t(metric.label)}</p>

              <strong className="metric-value">
                <CountUp value={metric.value} suffix={metric.suffix.startsWith(' ') ? ` ${t(metric.suffix.trim())}` : t(metric.suffix)} />
              </strong>

              <div className="metric-footer">
                <span>{t(metric.detail)}</span>
                <Icon name="arrow" size={18} />
              </div>
            </article>
          ))}
        </div>

       
      </div>
    </section>
  )
}

export function ProcessSection() {
  const { t } = useLanguage()
  return (
    <section id="how-it-works" className="section process">
      <div className="container">
        <p className="eyebrow">{t('A CLEAR PATH FORWARD')}</p>
        <h2>{t('How the Fund Works')}</h2>

        <div className="steps">
          {processSteps.map(([title, text], index) => (
            <article className="step" key={title}>
              <div className="step-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>

        <a className="text-link" href="#transparency">
          {t('Read Full Terms and Conditions')} <Icon name="arrow" />
        </a>
      </div>
    </section>
  )
}

export function TransparencySection() {
  const { financialTerms: apiTerms } = useSiteData()
  const { t } = useLanguage()

  const shownTerms = apiTerms.length
      ? apiTerms.map((term) => [
        term.title,
        `${term.amount} ${term.unit}`,
        term.description,
      ] as const)
    : financialTerms
  const displayAmount = (value: string) => value.replace(/\bBirr\b/g, t('Birr'))

  return (

<section id="transparency" className="section transparency">
  <div className="container">
    <div className="transparency-head">
      <div>
        <p className="eyebrow">
          {t('KNOW BEFORE YOU COMMIT')}
        </p>

        <h2>
          {t('Total Transparency')}
          <br />
          {t('Understand the Model')}
        </h2>

        <p className="transparency-intro">
          {t(
            'Merkato Fund proposes a get-first, then-pay financial model designed to help participants access productive capital. Review the proposed contributions, repayment obligations, and reserve requirements before making a decision.'
          )}
        </p>
      </div>
    </div>

    <div className="terms-layout">
      <div
        className="terms-table"
        role="table"
        aria-label={t('Proposed financial terms')}
      >
        {shownTerms.map(([term, value, note]) => (
          <div className="term-row" role="row" key={term}>
            <div>
              <span>{t(term)}</span>
              <small>{t(note)}</small>
            </div>

            <strong>{displayAmount(value)}</strong>
          </div>
        ))}
      </div>

      <aside className="calculation">
        <p className="eyebrow">
          {t('30-DAY REPAYMENT ILLUSTRATION')}
        </p>

        <div>
          <span>500 {t('Birr')}</span>
          <i aria-hidden="true">×</i>
          <span>{t('30 days')}</span>
        </div>

        <strong>15,000 {t('Birr')}</strong>

        <p>
          {t(
            'Illustrative monthly repayment based on 500 Birr per day for 30 days. The 50 Birr administrative fee and any reserve requirements are separate unless the official agreement states otherwise.'
          )}
        </p>
      </aside>
    </div>

    <div className="reserve-note">
      <Icon name="shield" size={30} />

      <div>
        <h3>{t('Understand the Proposed Reserve')}</h3>

        <p>
          {t(
            'The proposed model mentions a 7,500 Birr reserve replenished every 15 days. Before participating, verify how the reserve is calculated, who holds the funds, when it must be replenished, and the conditions for refunds and withdrawals.'
          )}
        </p>
      </div>
    </div>

    <div className="reserve-note">
      <Icon name="info" size={30} />

      <div>
        <h3>{t('Verify the Payout and Bank Arrangement')}</h3>

        <p>
          {t(
            'The proposal describes a 1 Million Birr payout and a six-month blocked bank account with a claimed 22% interest rate. Confirm the payout eligibility, draw rules, interest calculation, account ownership, applicable fees, and bank guarantees through independently verifiable official documents.'
          )}
        </p>
      </div>
    </div>

    <p className="transparency-disclaimer">
      {t(
        'Important: These figures describe the proposed model and are not a guarantee of payout, returns, or capital protection. Review the official terms and applicable regulatory approvals before contributing money.'
      )}
    </p>

    <a className="button" href="#faqs">
      {t('Read All Financial Conditions')}
      <Icon name="arrow" />
    </a>
  </div>
</section>
  )
}

