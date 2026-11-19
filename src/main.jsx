import React from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/noto-serif-devanagari/devanagari-400.css';
import '@fontsource/noto-serif-devanagari/devanagari-600.css';
import '@fontsource/noto-serif-devanagari/devanagari-700.css';
import '@fontsource/noto-serif-devanagari/latin-400.css';
import '@fontsource/noto-serif-devanagari/latin-600.css';
import '@fontsource/tiro-devanagari-marathi/devanagari-400.css';
import '@fontsource/tiro-devanagari-marathi/latin-400.css';
import '@fontsource/yatra-one/devanagari-400.css';
import '@fontsource/yatra-one/latin-400.css';

import './styles/theme.css';
import './styles/stage.css';
import './styles/book.css';
import './styles/pages.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
