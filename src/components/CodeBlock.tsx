type CodeBlockProps = {
  title: string
  code: string
  language?: string
}

export function CodeBlock({ title, code, language = 'TypeScript' }: CodeBlockProps) {
  return (
    <section className="code-panel">
      <div className="code-panel__header">
        <h3>{title}</h3>
        <span>{language}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </section>
  )
}
