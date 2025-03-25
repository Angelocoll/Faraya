import FarayaEvent from './Components/Faraya';
import Admin from './Components/Admin';
import Gästlista from './Components/Gästlista';
import GuestlistAdmin from './Components/GuestlistAdmin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<FarayaEvent />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Guestlist" element={<Gästlista />} />
        <Route path="/GuestlistAdmin" element={<GuestlistAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
