// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './components/Transactions';
import Statistics from './components/statistics';
import PieChart from './components/Piechart';
import BarChart from './components/BarChart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/pie-chart" element={<PieChart />} />
        <Route path="/bar-chart" element={<BarChart />} />
      </Routes>
    </Router>
  );
}

export default App;
