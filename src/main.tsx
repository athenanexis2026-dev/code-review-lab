import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.tsx'
import { TaskStatsProvider } from './state/taskStats.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskStatsProvider>
      <App />
    </TaskStatsProvider>
  </StrictMode>,
)
