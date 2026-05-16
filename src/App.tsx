import { useMemo, useState } from 'react'
import type { CodeEditorSubmission } from './components/CodeEditorForm'
import { tasks } from './data/tasks'
import { Dashboard } from './pages/Dashboard'
import { TaskDetail } from './pages/TaskDetail'
import { useTaskStats } from './state/taskStatsContext'

type View = 'dashboard' | 'task'

function App() {
  const { resetTaskStats } = useTaskStats()
  const [view, setView] = useState<View>('dashboard')
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id)
  const [taskSubmissionsById, setTaskSubmissionsById] = useState<
    Record<string, CodeEditorSubmission>
  >({})

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0],
    [selectedTaskId],
  )

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setView('task')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetAppState = () => {
    resetTaskStats()
    setTaskSubmissionsById({})
    setSelectedTaskId(tasks[0].id)
    setView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'task') {
    return (
      <TaskDetail
        task={selectedTask}
        savedSubmission={taskSubmissionsById[selectedTask.id] ?? null}
        onBack={() => setView('dashboard')}
        onSubmitComplete={(taskId, submission) => {
          setTaskSubmissionsById((currentSubmissions) => ({
            ...currentSubmissions,
            [taskId]: submission,
          }))
        }}
      />
    )
  }

  return (
    <Dashboard
      tasks={tasks}
      onOpenTask={openTask}
      onReset={resetAppState}
    />
  )
}

export default App
