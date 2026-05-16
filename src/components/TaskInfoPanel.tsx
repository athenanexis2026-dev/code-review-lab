type TaskInfoPanelProps = {
  title: string
  items: string[]
}

export function TaskInfoPanel({ title, items }: TaskInfoPanelProps) {
  return (
    <article className="info-panel">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
