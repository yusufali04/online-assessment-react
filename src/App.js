
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/Home"
import Register from './pages/Register';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import { useState } from 'react';
import userContext from './userContext';
import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import Results from './pages/Results';
import {Toaster} from 'react-hot-toast'
import Navbar from './components/Navbar';
import MyResults from './pages/MyResults';

function App() {

  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false)
  const cookies = new Cookies()

  useEffect(()=>{
    const cookieValue = cookies.get('user')
    setUser(cookieValue)
    setLoaded(true)
  }, [])

  
  return (
    
    loaded ? (<userContext.Provider value={{user, setUser}}>
      <>
      
        <div>
          <Toaster position='top-center' toastOptions={{duration: 3000}} ></Toaster>
        </div>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={user ? <Navigate to='/'/> : <Login />} />
            <Route path="/quiz/:quizId" element={user ? <Quiz /> : <Navigate to="/login" />} /> 
            <Route path="/admin/results/:quizId" element={user ? <Results /> : <Navigate to="/login" />} />
            <Route path="/results/:userId" element={user && user.role !== 'admin' ? <MyResults /> : <Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </>
      </userContext.Provider>) : ''
  );
}

export default App;
