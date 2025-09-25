import { motion } from 'framer-motion'

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
      title: 'Sistema POS - Punto de Venta',
      description: 'Sistema completo de punto de venta con gestión avanzada de productos, inventario inteligente y procesamiento de ventas en tiempo real. Perfecto para comercios que buscan digitalizar sus operaciones con tecnología moderna.',
      icon: '🏪',
      externalLink: 'https://www.cajasasenterprise.com/',
      features: [
        '🛒 Carrito de compras interactivo con animaciones',
        '📊 Dashboard ejecutivo con métricas en tiempo real',
        '🔍 Búsqueda avanzada por código de barras',
        '📦 Control de inventario automático',
        '💳 Procesamiento de pagos con IVA',
        '📱 Interfaz responsive y moderna',
        '⚡ Alta de productos con validaciones',
        '📈 Reportes y estadísticas de ventas'
      ]
    },
    {
      title: 'Sistema de Rifas y Sorteos',
      description: 'Plataforma profesional para la creación y gestión de rifas, sorteos y eventos promocionales. Ideal para organizaciones benéficas, empresas y eventos especiales con seguimiento completo del proceso.',
      icon: '🎟️',
      externalLink: 'https://www.cajasasenterprise.com/',
      features: [
        '🎫 Generación automática de boletos numerados',
        '💰 Sistema de pagos integrado',
        '📊 Panel de control con progreso visual',
        '🏆 Sorteo aleatorio transparente',
        '📱 Interfaz móvil optimizada',
        '📧 Notificaciones automáticas',
        '📈 Analytics y reportes detallados',
        '🎨 Personalización de rifas y diseños'
      ]
    },
  ]

  const technologies = [
    { name: 'React 18', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Vite', icon: '⚡' },
    { name: 'Framer Motion', icon: '🎬' },
    { name: 'Prisma', icon: '🔷' },
    { name: 'PostgreSQL', icon: '🐘' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="hero-title" variants={itemVariants}>
              React Demos
              <br />
              <span style={{
                background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Modernos & Visuales
              </span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Conoce nuestros sistemas empresariales completos: un potente Sistema POS para puntos de venta 
              y una plataforma profesional de Rifas y Sorteos. Desarrollados con React 18, TypeScript 
              y tecnologías de vanguardia, listos para implementación comercial en tu negocio.
            </motion.p>

            <motion.div className="hero-buttons" variants={itemVariants}>
              <a 
                href="https://www.cajasasenterprise.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd700)', 
                  color: 'white',
                  border: 'none',
                  fontSize: '1.1rem',
                  padding: '1rem 2rem'
                }}
              >
                <span>🌐</span>
                Ver Sistemas Empresariales
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demos Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Sistemas Empresariales Completos</h2>
            <p className="section-description">
              Conoce nuestras dos soluciones empresariales desarrolladas con tecnologías modernas. 
              Cada sistema incluye funcionalidades avanzadas, interfaces profesionales, 
              gestión de datos en tiempo real y está diseñado para entornos de producción comercial.
              <br />
              <strong style={{ color: '#6366f1', marginTop: '0.5rem', display: 'block' }}>
                💼 Desarrollados por CajasasEnterprise - Expertos en soluciones digitales
              </strong>
            </p>
          </motion.div>

          <div className="demos-grid">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.title}
                className="demo-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                style={{ position: 'relative' }}
              >
                <div className="demo-icon">{demo.icon}</div>
                <h3 className="demo-title">{demo.title}</h3>
                <p className="demo-description">{demo.description}</p>

                <ul className="features-list">
                  {demo.features.map((feature) => (
                    <li key={feature} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: '1.5rem' }}>
                  <a 
                    href={demo.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    🌐 Ver Sistema Completo
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologías Section */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Tecnologías Utilizadas</h2>
            <p className="section-description">
              Construido con las tecnologías más modernas y populares del ecosistema React
            </p>
          </motion.div>

          <motion.div
            className="tech-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech.name}
                className="tech-item"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <div className="tech-name">{tech.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Características Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Características Destacadas</h2>
            <p className="section-description">
              Funcionalidades modernas implementadas con las mejores prácticas
            </p>
          </motion.div>

          <div className="demos-grid">
            <motion.div
              className="demo-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="demo-icon">🎨</div>
              <h3 className="demo-title">Diseño Moderno</h3>
              <p className="demo-description">
                Interfaz limpia y profesional con animaciones suaves y efectos visuales atractivos.
              </p>
            </motion.div>

            <motion.div
              className="demo-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="demo-icon">📱</div>
              <h3 className="demo-title">Responsive Design</h3>
              <p className="demo-description">
                Adaptable a cualquier dispositivo, desde móviles hasta pantallas grandes.
              </p>
            </motion.div>

            <motion.div
              className="demo-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="demo-icon">🔒</div>
              <h3 className="demo-title">TypeScript</h3>
              <p className="demo-description">
                Desarrollo robusto con tipado estático para mayor confiabilidad del código.
              </p>
            </motion.div>

            <motion.div
              className="demo-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="demo-icon">⚡</div>
              <h3 className="demo-title">Performance</h3>
              <p className="demo-description">
                Optimizado para velocidad con Vite y las mejores prácticas de React.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="hero" style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
              ¿Necesitas un Sistema Empresarial?
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9, color: 'white' }}>
              Contacta a CajasasEnterprise para implementar tu sistema personalizado 
              con tecnología de vanguardia y funcionalidades profesionales
            </p>
            <div className="hero-buttons">
              <a 
                href="https://www.cajasasenterprise.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd700)', 
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                  fontSize: '1.2rem',
                  padding: '1rem 2.5rem'
                }}
              >
                🌐 Contratar Sistema Empresarial
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage