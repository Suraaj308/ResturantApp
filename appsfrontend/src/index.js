import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Tables from './pages/Tables';
import OrderTickets from './pages/OrderTickets';
import App from './pages/App';
import Login from './pages/Login';
import AppLayout from './AppLayout';
import './index.css';
import PlaceOrder from './pages/Orders';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/stats" element={<AppLayout><Analytics /></AppLayout>} />
      <Route path="/tables" element={<AppLayout><Tables /></AppLayout>} />
      <Route path="/ordertickets" element={<AppLayout><OrderTickets /></AppLayout>} />
      <Route path="/menu" element={<AppLayout><App /></AppLayout>} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/placeorder" element={<AppLayout><PlaceOrder /></AppLayout>} />
    </Routes>
  </BrowserRouter >
);