import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Report from './components/Report';
import App from './components/App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/report' element={<Report />} />
        <Route path='/' element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
