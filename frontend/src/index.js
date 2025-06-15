// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp'; // ✅ Make sure the import points to MainApp.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);