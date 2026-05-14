import { DashboardCard } from '../components/DashboardCard'
import type { ReviewTask } from '../data/tasks'
import { useTaskStats } from '../state/taskStatsContext'
import { getRubricAverage } from '../utils/rubric'

type DashboardProps = {
  tasks: ReviewTask[]
  onOpenTask: (taskId: string) => void
  onOpenEvaluation: (taskId: string) => void
}

function getReviewStatus(score: number) {
  if (score >= 92) return 'Reference ready'
  if (score >= 88) return 'Strong with notes'
  return 'Needs revision'
}

export function Dashboard({ tasks, onOpenTask, onOpenEvaluation }: DashboardProps) {
  const taskStats = useTaskStats()
  const averageScore = Math.round(
    tasks.reduce((sum, task) => sum + getRubricAverage(task.rubric), 0) / tasks.length,
  )
  const bugsIdentified = tasks.reduce(
    (sum, task) => sum + task.testResults.failedCases.length,
    0,
  )
  const testsPassed = tasks.reduce((sum, task) => sum + task.testResults.passed, 0)
  const reviewReadyCount = tasks.filter(
    (task) => getRubricAverage(task.rubric) >= 92,
  ).length

  return (
    <main className="page-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI trainer workflow simulator</p>
          <h1>CodeReview Lab</h1>
          <p>
            A lightweight software engineering evaluation dashboard for reviewing
            realistic tasks, tests, edge cases, fixes, and scoring rubrics.
          </p>
        </div>
        <aside>
          <span>Portfolio signal</span>
          <strong>Debugging + evaluation</strong>
          <p>Built for employer review with deployable mock data.</p>
        </aside>
      </section>

      <section className="metrics-grid" aria-label="Dashboard metrics">
        <DashboardCard label="Tasks" value={taskStats.tasks} detail="Curated SWE scenarios" />
        <DashboardCard
          label="Completed tasks"
          value={taskStats.completedTasks}
          detail="Submitted evaluations"
        />
        <DashboardCard
          label="Passed tasks"
          value={taskStats.passedTasks}
          detail="Accepted task runs"
          tone="success"
        />
        <DashboardCard
          label="Failed tasks"
          value={taskStats.failedTasks}
          detail="Needs another review"
          tone="warning"
        />
        <DashboardCard
          label="Average quality"
          value={`${averageScore}%`}
          detail="Mean rubric score"
          tone="success"
        />
        <DashboardCard
          label="Bugs identified"
          value={bugsIdentified}
          detail="Captured failure modes"
          tone="warning"
        />
        <DashboardCard
          label="Tests passed"
          value={testsPassed}
          detail="Across validation suites"
          tone="success"
        />
        <DashboardCard
          label="Review status"
          value={`${reviewReadyCount}/${taskStats.tasks}`}
          detail="Reference-ready tasks"
        />
      </section>

      <section className="task-table">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Task library</p>
            <h2>Evaluation scenarios</h2>
          </div>
          <span>{taskStats.tasks} active tasks</span>
        </div>

        <div className="task-list">
          {tasks.map((task) => {
            const score = getRubricAverage(task.rubric)

            return (
              <article className="task-row" key={task.id}>
                <div>
                  <span className="pill">{task.category}</span>
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
                  <div>
                    <dt>Status</dt>
                    <dd>{getReviewStatus(score)}</dd>
                  </div>
                </dl>
                <div className="row-actions">
                  <button type="button" onClick={() => onOpenTask(task.id)}>
                    View task
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onOpenEvaluation(task.id)}
                  >
                    Evaluation
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
