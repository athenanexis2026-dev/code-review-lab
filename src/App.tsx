import { useMemo, useState } from 'react'
import { tasks } from './data/tasks'
import { Dashboard } from './pages/Dashboard'
import { TaskDetail } from './pages/TaskDetail'

type View = 'dashboard' | 'task'

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

  if (view === 'task') {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => setView('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      tasks={tasks}
      onOpenTask={openTask}
    />
  )
}

export default App
