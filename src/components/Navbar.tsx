import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="navbar-brand">
            🚀 React Demos
          </Link>
        </motion.div>
        
        <ul className="navbar-nav">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            
            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar