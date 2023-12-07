import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <ToastContainer />
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
