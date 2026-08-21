import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/doto';
import '@fontsource/commit-mono/400.css';
import '@fontsource/commit-mono/700.css';
import './index.css';
import App from './App.jsx';

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);