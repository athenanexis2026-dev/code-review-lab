import { equals } from '@jest/expect-utils'

type UserCodeExports = Record<string, unknown>
type ExportedTestFunction = (...args: unknown[]) => unknown
type CodeTestRunStatus = 'passed' | 'failed' | 'empty'

type TestExpect = (actual: unknown) => {
  toEqual: (expected: unknown) => void
  toThrow: () => void
}

export type FunctionCodeTestCase = {
  name: string
  functionName: string
  args: unknown[]
  expected?: unknown
  expectError?: boolean
}

export type AssertionCodeTestCase = {
  name: string
  assert: (exports: UserCodeExports, expect: TestExpect) => void
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
  status: CodeTestRunStatus
  passed: number
  failed: number
  total: number
  cases: CodeTestCaseResult[]
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error)
}

const formatValue = (value: unknown) => {
  if (typeof value === 'undefined') return 'undefined'

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const jestExpect: TestExpect = (actual) => {
  return {
    toEqual: (expected) => {
      if (!equals(actual, expected)) {
        throw new Error(
          `Expected ${formatValue(actual)} to equal ${formatValue(expected)}.`,
        )
      }
    },
    toThrow: () => {
      if (typeof actual !== 'function') {
        throw new Error('Expected received value to be a function.')
      }

      try {
        actual()
      } catch {
        return
      }

      throw new Error('Expected function to throw.')
    },
  }
}

const getExportedFunction = (
  exports: UserCodeExports,
  functionName: string,
) => {
  const exportedFunction = exports[functionName]

  if (typeof exportedFunction !== 'function') {
    throw new Error(`Expected the code to export ${functionName}.`)
  }

  return exportedFunction as ExportedTestFunction
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

const runAssertionTestCase = (
  exports: UserCodeExports,
  testCase: AssertionCodeTestCase,
): CodeTestCaseResult => {
  testCase.assert(exports, jestExpect)

  return {
    name: testCase.name,
    passed: true,
  }
}

const runExpectedErrorTestCase = (
  exportedFunction: ExportedTestFunction,
  testCase: FunctionCodeTestCase,
): CodeTestCaseResult => {
  try {
    jestExpect(() => exportedFunction(...testCase.args)).toThrow()
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      expected: 'an error to be thrown',
      error: getErrorMessage(error),
    }
  }

  return {
    name: testCase.name,
    passed: true,
    expected: 'an error to be thrown',
  }
}

const runExpectedValueTestCase = (
  exportedFunction: ExportedTestFunction,
  testCase: FunctionCodeTestCase,
): CodeTestCaseResult => {
  const actual = exportedFunction(...testCase.args)

  try {
    jestExpect(actual).toEqual(testCase.expected)
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      expected: testCase.expected,
      actual,
      error: getErrorMessage(error),
    }
  }

  return {
    name: testCase.name,
    passed: true,
    expected: testCase.expected,
    actual,
  }
}

const runFunctionTestCase = (
  exports: UserCodeExports,
  testCase: FunctionCodeTestCase,
): CodeTestCaseResult => {
  const exportedFunction = getExportedFunction(exports, testCase.functionName)

  if (testCase.expectError) {
    return runExpectedErrorTestCase(exportedFunction, testCase)
  }

  return runExpectedValueTestCase(exportedFunction, testCase)
}

const runTestCase = (
  exports: UserCodeExports,
  testCase: CodeTestCase,
): CodeTestCaseResult => {
  try {
    if (isAssertionTestCase(testCase)) {
      return runAssertionTestCase(exports, testCase)
    }

    return runFunctionTestCase(exports, testCase)
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      error: getErrorMessage(error),
    }
  }
}

const createEmptyRunResult = (): CodeTestRunResult => ({
  status: 'empty',
  passed: 0,
  failed: 0,
  total: 0,
  cases: [],
})

const createCompletedRunResult = (
  cases: CodeTestCaseResult[],
): CodeTestRunResult => {
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

export const runCodeTests = async (
  code: string,
  testCases: CodeTestCase[],
): Promise<CodeTestRunResult> => {
  if (testCases.length === 0) {
    return createEmptyRunResult()
  }

  const exports = await getCodeExports(code)
  const cases = testCases.map((testCase) => runTestCase(exports, testCase))

  return createCompletedRunResult(cases)
}
