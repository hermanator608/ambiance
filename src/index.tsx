import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import App from './App';
import ErrorPage from './error-page';
import AdminPage from './admin';
import reportWebVitals from './reportWebVitals';
import { initFirebase } from './firebase'

initFirebase();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <App />,
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
