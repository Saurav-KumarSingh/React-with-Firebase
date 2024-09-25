import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseProvider } from './context/Firebase.connect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider >
        <App />
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
)
