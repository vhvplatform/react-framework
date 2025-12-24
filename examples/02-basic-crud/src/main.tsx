import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '@longvhv/core';
import { ApiProvider } from '@longvhv/api-client';
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
              name: 'Basic CRUD App',
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
