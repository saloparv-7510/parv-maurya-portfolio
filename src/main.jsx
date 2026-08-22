import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

/* Vite entry point. StrictMode is on in development — it double-invokes effects
   on purpose, which is why every animation effect in this project cleans up
   after itself properly. */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
