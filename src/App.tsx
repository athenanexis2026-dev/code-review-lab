import { useState } from 'react'
import type { CodeEditorSubmission } from './components/CodeEditorForm'
import { tasks } from './data/tasks'
import { Dashboard } from './pages/Dashboard'
import { TaskDetail } from './pages/TaskDetail'
import { useTaskStats } from './state/taskStatsContext'

type View = 'dashboard' | 'task'

const getTaskById = (taskId: string) => {
  return tasks.find((task) => task.id === taskId) ?? tasks[0]
}

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const App = () => {
  const { resetTaskStats } = useTaskStats()
  const [view, setView] = useState<View>('dashboard')
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id)
  const [taskSubmissionsById, setTaskSubmissionsById] = useState<
    Record<string, CodeEditorSubmission>
  >({})
  const selectedTask = getTaskById(selectedTaskId)

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setView('task')
    scrollToPageTop()
  }

  const resetAppState = () => {
    resetTaskStats()
    setTaskSubmissionsById({})
    setSelectedTaskId(tasks[0].id)
    setView('dashboard')
    scrollToPageTop()
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
