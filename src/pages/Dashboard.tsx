import { DashboardCard } from '../components/DashboardCard'
import heroImage from '../assets/RafaSoftwareReview (1).png'
import type { ReviewTask } from '../data/tasks'
import { useTaskStats } from '../state/taskStatsContext'
import { getRubricAverage } from '../utils/rubric'

type DashboardProps = {
  tasks: ReviewTask[]
  onOpenTask: (taskId: string) => void
}

function getReviewStatus(score: number) {
  if (score >= 92) return 'Reference ready'
  if (score >= 88) return 'Strong with notes'
  return 'Needs revision'
}

export function Dashboard({ tasks, onOpenTask }: DashboardProps) {
  const taskStats = useTaskStats()

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
        <aside className="hero-band__media">
          <img src={heroImage} alt="" />
        </aside>
      </section>

      <section className="metrics-grid" aria-label="Dashboard metrics">
        <DashboardCard label="Tasks" value={taskStats.tasks} detail="Curated SWE scenarios" />
        <DashboardCard
          label="Passed tests"
          value={`${taskStats.passedTests}/${taskStats.totalTests}`}
          detail="Across submitted tasks"
          tone="success"
        />
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
            const taskResult = taskStats.taskResultsById[task.id]

            return (
              <article className="task-row" key={task.id}>
                <div>
                  <div className="task-row__pills">
                    <span className="pill">{task.category}</span>
                    {taskResult && (
                      <span className={`pill pill--${taskResult}`}>
                        {taskResult === 'passed' ? 'Pass' : 'Failed'}
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
                  <div>
                    <dt>Status</dt>
                    <dd>{getReviewStatus(score)}</dd>
                  </div>
                </dl>
                <div className="row-actions">
                  <button type="button" onClick={() => onOpenTask(task.id)}>
                    View task
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
