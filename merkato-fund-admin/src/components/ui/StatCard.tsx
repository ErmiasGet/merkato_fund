export function StatCard({ label, value, meta, tone = '' }: { label: string; value: string; meta: string; tone?: string }) {
  return <article className={`stat ${tone}`}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
}