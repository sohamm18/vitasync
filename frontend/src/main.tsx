import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
// 👇 THIS LINE IS CRITICAL FOR STYLING
import './app/styles/index.css' 
import { AppProvider } from './app/context/AppContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)