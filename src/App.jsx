import FarayaEvent from './Components/Faraya';
import Admin from './Components/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<FarayaEvent />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
