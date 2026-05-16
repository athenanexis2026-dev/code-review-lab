import type { CodeTestRunResult } from '../utils/codeTestRunner'

type CodeTestSummaryProps = {
  result: CodeTestRunResult | null
  isRunning: boolean
}

const formatValue = (value: unknown) => {
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const getTestCaseStatusClassName = (passed: boolean) => {
  return `pill ${passed ? 'pill--passed' : 'pill--failed'}`
}

export const CodeTestSummary = ({ result, isRunning }: CodeTestSummaryProps) => {
  if (isRunning) {
    return (
      <section className="code-test-summary code-test-summary--running">
        <strong>Running tests</strong>
        <p>Checking your TypeScript solution...</p>
      </section>
    )
  }

  if (!result) return null

  if (result.status === 'empty') {
    return (
      <section className="code-test-summary code-test-summary--empty">
        <strong>No tests configured yet</strong>
        <p>The runner is ready for prescribed tests from the task test file.</p>
      </section>
    )
  }

  return (
    <section className={`code-test-summary code-test-summary--${result.status}`}>
      <strong>
        {result.status === 'passed' ? 'All tests passed' : 'Some tests failed'}
      </strong>
      <p>
        {result.passed}/{result.total} passing
      </p>
      <ul>
        {result.cases.map((testCase) => (
          <li key={testCase.name}>
            <span className={getTestCaseStatusClassName(testCase.passed)}>
              {testCase.passed ? 'Pass' : 'Fail'}
            </span>
            <div>
              <strong>{testCase.name}</strong>
              {testCase.error ? (
                <small>{testCase.error}</small>
              ) : (
                <small>
                  Expected {formatValue(testCase.expected)}, received{' '}
                  {formatValue(testCase.actual)}
                </small>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
