
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Quiz from './pages/Quiz';

function App() {
  return (
    
    
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz/:_id" element={<Quiz />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
