import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TortisalApp from './TortisalApp.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'rsuite/dist/rsuite-no-reset.min.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <TortisalApp />
    </BrowserRouter>
  </StrictMode>,
)
