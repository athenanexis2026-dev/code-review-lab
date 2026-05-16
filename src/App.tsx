import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { CodeEditorSubmission } from './components/CodeEditorForm'
import { tasks } from './data/tasks'
import { Dashboard } from './pages/Dashboard'
import { TaskDetail } from './pages/TaskDetail'
import { useTaskStats } from './state/taskStatsContext'

const getTaskById = (taskId: string) => {
  return tasks.find((task) => task.id === taskId) ?? null
}

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToPageTop()
  }, [pathname])

  return null
}

const App = () => {
  const { resetTaskStats } = useTaskStats()
  const navigate = useNavigate()
  const [taskSubmissionsById, setTaskSubmissionsById] = useState<
    Record<string, CodeEditorSubmission>
  >({})

  const openTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`)
  }

  const resetAppState = () => {
    resetTaskStats()
    setTaskSubmissionsById({})
    navigate('/')
  }

  const taskDetailRoute = (
    <TaskDetailRoute
      taskSubmissionsById={taskSubmissionsById}
      onBack={() => navigate('/')}
      onSubmitComplete={(taskId, submission) => {
        setTaskSubmissionsById((currentSubmissions) => ({
          ...currentSubmissions,
          [taskId]: submission,
        }))
      }}
    />
  )

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              tasks={tasks}
              onOpenTask={openTask}
              onReset={resetAppState}
            />
          }
        />
        <Route path="/tasks/:taskId" element={taskDetailRoute} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

type TaskDetailRouteProps = {
  taskSubmissionsById: Record<string, CodeEditorSubmission>
  onBack: () => void
  onSubmitComplete: (taskId: string, submission: CodeEditorSubmission) => void
}

const TaskDetailRoute = ({
  taskSubmissionsById,
  onBack,
  onSubmitComplete,
}: TaskDetailRouteProps) => {
  const { taskId } = useParams()

  if (!taskId) {
    return <Navigate to="/" replace />
  }

  const task = getTaskById(taskId)

  if (!task) {
    return <Navigate to="/" replace />
  }

  return (
    <TaskDetail
      task={task}
      savedSubmission={taskSubmissionsById[task.id] ?? null}
      onBack={onBack}
      onSubmitComplete={onSubmitComplete}
    />
  )
}

export default App
