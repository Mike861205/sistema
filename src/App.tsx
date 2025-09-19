import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductsPage from './pages/ProductsPage'
import RafflesPage from './pages/RafflesPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/rifas" element={<RafflesPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App