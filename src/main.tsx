import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { YearProvider } from './context/YearContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter><YearProvider><App /></YearProvider></BrowserRouter>
  </StrictMode>,
)
