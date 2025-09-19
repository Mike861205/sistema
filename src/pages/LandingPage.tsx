import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const demos = [
    {
      title: 'Sistema de Productos y Ventas',
      description: 'Gestiona productos, inventario y procesa ventas de manera eficiente. Incluye formularios para alta de productos y simulación de ventas.',
      icon: '📦',
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'from-blue-600 to-blue-800',
      path: '/productos',
      features: [
        'Formularios de alta de productos',
        'Gestión de inventario en tiempo real',
        'Simulación de ventas',
        'Dashboard con estadísticas'
      ]
    },
    {
      title: 'Sistema de Rifas',
      description: 'Crea rifas, vende boletos y gestiona sorteos. Perfecto para eventos benéficos, promociones y concursos.',
      icon: '🎟️',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'from-purple-600 to-pink-700',
      path: '/rifas',
      features: [
        'Creación de rifas personalizadas',
        'Venta de boletos numerados',
        'Tracking de boletos vendidos',
        'Interfaz intuitiva y moderna'
      ]
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              React Demos
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Modernos & Visuales
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Explora dos demos funcionales construidos con React 18, TypeScript, 
              TailwindCSS y Prisma. Perfectos para mostrar funcionalidades modernas de desarrollo web.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                to="/productos"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>📦</span>
                <span>Ver Demo Productos</span>
              </Link>
              <Link
                to="/rifas"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <span>🎟️</span>
                <span>Ver Demo Rifas</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-10 w-72 h-72 bg-white/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-xl"
            animate={{
              y: [0, 30, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>

      {/* Demos Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Demos Interactivos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora dos sistemas completos con funcionalidades reales. 
              Cada demo incluye formularios, base de datos y operaciones CRUD.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card p-8 h-full relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${demo.color} rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-all duration-500`}></div>
                  
                  <div className="relative">
                    <div className="text-4xl mb-4">{demo.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {demo.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {demo.description}
                    </p>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-800 mb-3">Características:</h4>
                      <ul className="space-y-2">
                        {demo.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={demo.path}
                      className={`block w-full text-center py-4 px-6 bg-gradient-to-r ${demo.color} hover:bg-gradient-to-r hover:${demo.hoverColor} text-white font-semibold rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      Explorar Demo
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Tecnologías Utilizadas</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Construido con las tecnologías más modernas del ecosistema React
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: 'React 18', icon: '⚛️' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Vite', icon: '⚡' },
              { name: 'TailwindCSS', icon: '🎨' },
              { name: 'Framer Motion', icon: '🎬' },
              { name: 'Prisma', icon: '🔷' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-semibold">{tech.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage