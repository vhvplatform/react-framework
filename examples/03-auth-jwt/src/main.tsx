import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '@vhvplatform/core';
import { ApiProvider } from '@vhvplatform/api-client';
import { store } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ApiProvider baseURL="http://localhost:8080">
          <Application
            config={{
              name: 'JWT Auth Example',
              version: '1.0.0',
            }}
            modules={[]}
          >
            <App />
          </Application>
        </ApiProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
