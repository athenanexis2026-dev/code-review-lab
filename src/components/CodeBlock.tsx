import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useState } from 'react'
import { codeMirrorBasicSetup, typeScriptExtensions } from './codeMirrorConfig'

type CodeBlockProps = {
  title: string
  code: string
  language?: string
  allowCopy?: boolean
}

const COPY_RESET_DELAY_MS = 1600

// Fallback copy method for browsers that don't support the Clipboard API
const copyWithFallback = (code: string) => {
  const codeTextarea = document.createElement('textarea')
  codeTextarea.value = code
  codeTextarea.setAttribute('readonly', '')
  codeTextarea.style.position = 'fixed'
  codeTextarea.style.opacity = '0'
  document.body.append(codeTextarea)
  codeTextarea.select()
  document.execCommand('copy')
  codeTextarea.remove()
}

export const CodeBlock = ({
  title,
  code,
  language = 'TypeScript',
  allowCopy = false,
}: CodeBlockProps) => {
  const [copyLabel, setCopyLabel] = useState('Copy')
  const codePanelClassName = `code-panel${allowCopy ? ' code-panel--copyable' : ''}`

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      copyWithFallback(code)
    }

    setCopyLabel('Copied')
    window.setTimeout(() => setCopyLabel('Copy'), COPY_RESET_DELAY_MS)
  }

  return (
    <section className={codePanelClassName}>
      <div className="code-panel__header">
        <h3>{title}</h3>
        <div className="code-panel__tools">
          <span>{language}</span>
          {allowCopy && (
            <button
              type="button"
              className="code-panel__copy-button"
              onClick={copyCode}
            >
              {copyLabel}
            </button>
          )}
        </div>
      </div>
      <CodeMirror
        aria-label={`${title} read-only code`}
        value={code}
        theme={vscodeDark}
        extensions={typeScriptExtensions}
        basicSetup={codeMirrorBasicSetup}
        editable={false}
        readOnly
        height="430px"
      />
    </section>
  )
}
