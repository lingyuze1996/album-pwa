import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginWrapper from './components/Login';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginWrapper>
      <App />
    </LoginWrapper>
  </StrictMode>
);

// Register service worker for PWA
/*
// Register service worker for PWA (commented out for local testing)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Service worker registration failed:', err)
    })
  })
}
*/
