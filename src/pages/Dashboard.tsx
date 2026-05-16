import { DashboardCard } from '../components/DashboardCard'
import { DashboardTaskRow } from '../components/DashboardTaskRow'
import heroImage from '../assets/RafaSoftwareReview (1).png'
import type { ReviewTask } from '../data/tasks'
import { useTaskStats } from '../state/taskStatsContext'
import { taskTestsById } from '../tests/taskTests'

type DashboardProps = {
  tasks: ReviewTask[]
  onOpenTask: (taskId: string) => void
  onReset: () => void
}

export const Dashboard = ({ tasks, onOpenTask, onReset }: DashboardProps) => {
  const taskStats = useTaskStats()

  return (
    <main className="page-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI trainer workflow simulator</p>
          <h1>CodeReview Lab</h1>
          <p>
            A lightweight software engineering evaluation dashboard for reviewing
            realistic tasks, tests, edge cases, and fixes.
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
          <div className="section-heading__actions">
            <span>{taskStats.tasks} active tasks</span>
            <button
              type="button"
              className="secondary reset-button"
              onClick={onReset}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v6h6" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <DashboardTaskRow
              key={task.id}
              task={task}
              taskResult={taskStats.taskResultsById[task.id]}
              passedTests={taskStats.passedTestsByTaskId[task.id]?.length ?? 0}
              totalTests={taskTestsById[task.id]?.length ?? 0}
              onOpenTask={onOpenTask}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
