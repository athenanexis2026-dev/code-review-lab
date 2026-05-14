import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { codeMirrorBasicSetup, typeScriptExtensions } from './codeMirrorConfig'

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
      <CodeMirror
        aria-label={`${title} read-only code`}
        value={code}
        theme={vscodeDark}
        extensions={typeScriptExtensions}
        basicSetup={codeMirrorBasicSetup}
        editable={false}
        readOnly
        minHeight="430px"
        maxHeight="540px"
      />
    </section>
  )
}
