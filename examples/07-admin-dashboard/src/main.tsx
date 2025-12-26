import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Application } from '@vhvplatform/core';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Application config={{ name: 'Example App' }} modules={[]}>
        <App />
      </Application>
    </BrowserRouter>
  </React.StrictMode>
);
