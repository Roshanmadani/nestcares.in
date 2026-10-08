import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set global base URL for all API requests to point to backend server
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://nestcares-in.onrender.com/api';

// Safety net for images whose URL no longer works (deleted uploads, dead links in
// saved data): swap once to a known-good photo so visitors never see a broken image.
const FALLBACK_DOCTOR = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
const FALLBACK_CARE = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800';
window.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  img.src = /\bdr\.?\s|doctor/i.test(img.alt || '') ? FALLBACK_DOCTOR : FALLBACK_CARE;
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
