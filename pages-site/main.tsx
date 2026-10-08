import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import PublicPage from './generated-home';
import '../app/globals.css';

hydrateRoot(document.getElementById('root')!, <PublicPage />);
