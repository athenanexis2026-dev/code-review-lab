import { equals } from '@jest/expect-utils'

type UserCodeExports = Record<string, unknown>
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
  status: 'passed' | 'failed' | 'empty'
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
      testCase.assert(exports, jestExpect)

      return {
        name: testCase.name,
        passed: true,
      }
    }

    const exportedFunction = getExportedFunction(exports, testCase.functionName)

    if (testCase.expectError) {
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
  } catch (error) {
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
