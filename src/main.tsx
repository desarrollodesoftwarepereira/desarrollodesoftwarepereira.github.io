import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles.css'
import './i18n'
import RedirectTo404 from './components/RedirectTo404.tsx'
import App from './App.tsx'

const basePath = import.meta.env.VITE_BASE_PATH || '/';
console.log('basePath:', basePath);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={basePath} element={
          <App />
        } />
        <Route path="*" element={<RedirectTo404 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
