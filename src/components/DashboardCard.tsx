type DashboardCardTone = 'neutral' | 'success' | 'warning'

type DashboardCardProps = {
  label: string
  value: string | number
  detail: string
  tone?: DashboardCardTone
}

export const DashboardCard = ({
  label,
  value,
  detail,
  tone = 'neutral',
}: DashboardCardProps) => {
  const cardClassName = `dashboard-card dashboard-card--${tone}`

  return (
    <article className={cardClassName}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
