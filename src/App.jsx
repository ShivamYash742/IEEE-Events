import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Events from './components/Events'
import Register from './components/Register'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
