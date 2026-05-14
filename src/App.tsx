import { useMemo, useState } from 'react'
import { tasks } from './data/tasks'
import { Dashboard } from './pages/Dashboard'
import { Evaluation } from './pages/Evaluation'
import { TaskDetail } from './pages/TaskDetail'

type View = 'dashboard' | 'task' | 'evaluation'

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id)

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0],
    [selectedTaskId],
  )

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setView('task')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEvaluation = (taskId: string) => {
    setSelectedTaskId(taskId)
    setView('evaluation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'task') {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => setView('dashboard')}
        onOpenEvaluation={() => setView('evaluation')}
      />
    )
  }

  if (view === 'evaluation') {
    return (
      <Evaluation
        task={selectedTask}
        onBack={() => setView('dashboard')}
        onOpenTask={() => setView('task')}
      />
    )
  }

  return (
    <Dashboard
      tasks={tasks}
      onOpenTask={openTask}
      onOpenEvaluation={openEvaluation}
    />
  )
}

export default App
