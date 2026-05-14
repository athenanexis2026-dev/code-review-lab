type UserCodeExports = Record<string, unknown>

export type FunctionCodeTestCase = {
  name: string
  functionName: string
  args: unknown[]
  expected?: unknown
  expectError?: boolean
}

export type AssertionCodeTestCase = {
  name: string
  assert: (exports: UserCodeExports) => void
}

export type CodeTestCase = FunctionCodeTestCase | AssertionCodeTestCase

export type CodeTestCaseResult = {
  name: string
  passed: boolean
  expected?: unknown
  actual?: unknown
  error?: string
}

export type CodeTestRunResult = {
  status: 'passed' | 'failed' | 'empty'
  passed: number
  failed: number
  total: number
  cases: CodeTestCaseResult[]
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error)
}

const isEqual = (actual: unknown, expected: unknown) => {
  return JSON.stringify(actual) === JSON.stringify(expected)
}

const getExportedFunction = (
  exports: UserCodeExports,
  functionName: string,
) => {
  const exportedFunction = exports[functionName]

  if (typeof exportedFunction !== 'function') {
    throw new Error(`Expected the code to export ${functionName}.`)
  }

  return exportedFunction
}

const compileTypeScript = async (code: string) => {
  const ts = await import('typescript')
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  })

  const firstError = transpiled.diagnostics?.find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  )

  if (firstError) {
    throw new Error(ts.flattenDiagnosticMessageText(firstError.messageText, '\n'))
  }

  return transpiled.outputText
}

const getCodeExports = async (code: string) => {
  const outputText = await compileTypeScript(code)
  const exports: Record<string, unknown> = {}
  const moduleObject: { exports: Record<string, unknown> } = { exports }
  const executeCode = new Function(
    'exports',
    'module',
    `"use strict";\n${outputText}`,
  )

  executeCode(exports, moduleObject)

  return moduleObject.exports
}

const isAssertionTestCase = (
  testCase: CodeTestCase,
): testCase is AssertionCodeTestCase => {
  return 'assert' in testCase
}

const runTestCase = (
  exports: UserCodeExports,
  testCase: CodeTestCase,
): CodeTestCaseResult => {
  try {
    if (isAssertionTestCase(testCase)) {
      testCase.assert(exports)

      return {
        name: testCase.name,
        passed: true,
      }
    }

    const exportedFunction = getExportedFunction(exports, testCase.functionName)
    const actual = exportedFunction(...testCase.args)

    if (testCase.expectError) {
      return {
        name: testCase.name,
        passed: false,
        expected: 'an error to be thrown',
        actual,
      }
    }

    const passed = isEqual(actual, testCase.expected)

    return {
      name: testCase.name,
      passed,
      expected: testCase.expected,
      actual,
    }
  } catch (error) {
    if (!isAssertionTestCase(testCase) && testCase.expectError) {
      return {
        name: testCase.name,
        passed: true,
        expected: 'an error to be thrown',
        actual: getErrorMessage(error),
      }
    }

    return {
      name: testCase.name,
      passed: false,
      error: getErrorMessage(error),
    }
  }
}

export const runCodeTests = async (
  code: string,
  testCases: CodeTestCase[],
): Promise<CodeTestRunResult> => {
  if (testCases.length === 0) {
    return {
      status: 'empty',
      passed: 0,
      failed: 0,
      total: 0,
      cases: [],
    }
  }

  const exports = await getCodeExports(code)
  const cases = testCases.map((testCase) => runTestCase(exports, testCase))
  const passed = cases.filter((testCase) => testCase.passed).length
  const failed = cases.length - passed

  return {
    status: failed === 0 ? 'passed' : 'failed',
    passed,
    failed,
    total: cases.length,
    cases,
  }
}
