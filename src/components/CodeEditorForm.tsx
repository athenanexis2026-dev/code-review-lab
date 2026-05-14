import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useState, type FormEvent } from 'react'
import { codeMirrorBasicSetup, typeScriptExtensions } from './codeMirrorConfig'

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
      <CodeMirror
        aria-label="TypeScript solution editor"
        value={code}
        theme={vscodeDark}
        extensions={typeScriptExtensions}
        basicSetup={codeMirrorBasicSetup}
        minHeight="430px"
        onChange={(value) => setCode(value)}
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
