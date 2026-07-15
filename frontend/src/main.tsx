import { createRoot } from 'react-dom/client';

import { setBaseUrl } from '@/api/custom-fetch';

import App from './App';

import './index.css';

const apiUrl = import.meta.env.VITE_API_URL?.trim();
setBaseUrl(apiUrl || null);

createRoot(document.getElementById('root')!).render(<App />);
