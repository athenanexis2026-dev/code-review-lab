import { RubricScore } from '../components/RubricScore'
import { TestResults } from '../components/TestResults'
import type { ReviewTask } from '../data/tasks'
import { getRubricAverage } from '../utils/rubric'

type EvaluationProps = {
  task: ReviewTask
  onBack: () => void
  onOpenTask: () => void
}

export function Evaluation({ task, onBack, onOpenTask }: EvaluationProps) {
  const score = getRubricAverage(task.rubric)
  const summary =
    score >= 92
      ? 'The reference implementation is ready for employer review. It fixes the observed failures, explains the edge cases, and provides a clear scoring trail.'
      : 'The submission is strong but should be reviewed with the noted failure modes before being treated as a final reference artifact.'

  return (
    <main className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        Back to dashboard
      </button>

      <section className="detail-header">
        <div>
          <p className="eyebrow">Evaluation report</p>
          <h1>{task.title}</h1>
          <p>{summary}</p>
        </div>
        <aside className="status-panel">
          <span>Overall score</span>
          <strong>{score}%</strong>
          <button type="button" onClick={onOpenTask}>
            View task
          </button>
        </aside>
      </section>

      <section className="evaluation-grid">
        <TestResults results={task.testResults} />
        <RubricScore rubric={task.rubric} />
      </section>

      <section className="review-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviewer feedback</p>
            <h2>Actionable comments</h2>
          </div>
          <span>{task.reviewComments.length} comments</span>
        </div>
        <ul>
          {task.reviewComments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
