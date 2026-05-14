type DashboardCardProps = {
  label: string
  value: string | number
  detail: string
  tone?: 'neutral' | 'success' | 'warning'
}

export function DashboardCard({
  label,
  value,
  detail,
  tone = 'neutral',
}: DashboardCardProps) {
  return (
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
