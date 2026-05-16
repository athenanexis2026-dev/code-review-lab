import { javascript } from '@codemirror/lang-javascript'

export const typeScriptExtensions = [javascript({ typescript: true })]

export const codeMirrorBasicSetup = {
  bracketMatching: true,
  closeBrackets: true,
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  lineNumbers: true,
}
