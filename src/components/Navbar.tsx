import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/rifas', label: 'Rifas', icon: '🎟️' },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🚀 React Demos
            </div>
          </motion.div>
          
          <div className="flex space-x-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium transition-all duration-200
                      flex items-center space-x-2
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                        layoutId="navbar-indicator"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar