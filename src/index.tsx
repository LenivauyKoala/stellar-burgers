import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import { store } from './services/store';

const container = document.getElementById('root');

if (!container) {
  const errorMessage = document.createElement('div');
  errorMessage.innerText = 'Не удалось найти элемент с id "root"';
  document.body.appendChild(errorMessage);
  console.error('Не удалось найти элемент с id "root"');
} else {
  const root = ReactDOMClient.createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
