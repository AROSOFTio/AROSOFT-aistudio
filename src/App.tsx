import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { StudentOffer } from './pages/StudentOffer';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-offer" element={<StudentOffer />} />
      </Routes>
    </Router>
  );
}
