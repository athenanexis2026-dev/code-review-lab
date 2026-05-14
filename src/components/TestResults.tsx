import type { ReviewTask } from '../data/tasks'

type TestResultsProps = {
  results: ReviewTask['testResults']
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <section className="test-results">
      <div className="test-results__grid">
        <div>
          <span>Total tests</span>
          <strong>{results.total}</strong>
        </div>
        <div>
          <span>Passing</span>
          <strong>{results.passed}</strong>
        </div>
        <div>
          <span>Failing cases found</span>
          <strong>{results.failed}</strong>
        </div>
      </div>

      <div className="issue-list">
        <h3>Failed cases captured</h3>
        <ul>
          {results.failedCases.map((failure) => (
            <li key={failure}>{failure}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
