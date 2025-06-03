import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles.css'
import RedirectTo404 from './components/RedirectTo404.tsx'
import Portada from './components/Portada.tsx'
import App from './App.tsx'

const basePath = import.meta.env.VITE_BASE_PATH || '/';
console.log('basePath:', basePath);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={basePath} element={
          <Suspense fallback={<Portada />}>
            <App />
          </Suspense>
        } />
        <Route path="*" element={<RedirectTo404 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
