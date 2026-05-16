import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/main.scss'
import App from './App.tsx'
import { TaskStatsProvider } from './state/taskStats.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskStatsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TaskStatsProvider>
  </StrictMode>,
)
