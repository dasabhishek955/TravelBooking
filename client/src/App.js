import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitData from './component/SubmitData';
import Display from './component/Display';
import Home from './component/Home';
import Signup from './component/Signup';
import Login from './component/Login';
import Navbar from './component/Navbar';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/submitData" element={<SubmitData />} />
        <Route exact path="/display" element={<Display />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}


export default App;
