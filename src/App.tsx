import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/notfound-page/NotFound';
import CardBlockingRules from './pages/docs-page/CardBlockingRules';
import TransactionsMonitorPage from './pages/transactions-page/TransactionsMonitorPage';
import Transactions from './pages/transactions-page/Transactions';
import AlertsPage from './pages/alerts-page/AlertsPage';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<CardBlockingRules />} />
        <Route path="/transactions-monitor" element={<TransactionsMonitorPage />} />
        <Route path="/transactions" element={<Transactions />} />

        <Route path="/alerts" element={<AlertsPage />} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
