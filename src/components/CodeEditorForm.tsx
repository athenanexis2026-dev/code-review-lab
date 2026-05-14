import { useState, type FormEvent } from 'react'

type CodeEditorFormProps = {
  initialCode?: string
}

export function CodeEditorForm({ initialCode = '' }: CodeEditorFormProps) {
  const [code, setCode] = useState(initialCode)

  const runTests = () => {
    console.log('clicked')
  }

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form className="code-editor-form" onSubmit={submitCode}>
      <div className="code-panel__header">
        <h3>Your solution</h3>
        <span>TypeScript</span>
      </div>
      <textarea
        aria-label="TypeScript solution editor"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
      />
      <div className="code-editor-form__actions">
        <button type="button" className="secondary" onClick={runTests}>
          Run tests
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
