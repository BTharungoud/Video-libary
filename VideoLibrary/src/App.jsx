import React, { useEffect, useState } from 'react'
import './App.css';
import Homepage from './Pages/Homepage';
import VideoLib from './Pages/VideoLib';
import { BrowserRouter,Route,Routes } from 'react-router-dom';

function App() {
  const [value , setValue] = useState('')
  useEffect(()=>{
    const username = localStorage.username;
    if (username) {
      setValue(username);
    }
  },[])
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/userdashboard' element={(value.length>=2)?<VideoLib/>:<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
