import type { ReviewTask } from '../data/tasks'

type DashboardTaskRowProps = {
  task: ReviewTask
  taskResult?: 'passed' | 'failed'
  passedTests: number
  totalTests: number
  onOpenTask: (taskId: string) => void
}

const getTaskScore = (passedTests: number, totalTests: number) => {
  return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
}

const getTaskResultLabel = (taskResult: 'passed' | 'failed') => {
  return taskResult === 'passed' ? 'Pass' : 'Failed'
}

export const DashboardTaskRow = ({
  task,
  taskResult,
  passedTests,
  totalTests,
  onOpenTask,
}: DashboardTaskRowProps) => {
  const score = getTaskScore(passedTests, totalTests)

  return (
    <article className="task-row">
      <div>
        <div className="task-row__pills">
          <span className="pill">{task.category}</span>
          {taskResult && (
            <span className={`pill pill--${taskResult}`}>
              {getTaskResultLabel(taskResult)}
            </span>
          )}
        </div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <dl>
        <div>
          <dt>Difficulty</dt>
          <dd>{task.difficulty}</dd>
        </div>
        <div>
          <dt>Score</dt>
          <dd>{score}%</dd>
        </div>
      </dl>
      <div className="row-actions">
        <button type="button" onClick={() => onOpenTask(task.id)}>
          View task
        </button>
      </div>
    </article>
  )
}
