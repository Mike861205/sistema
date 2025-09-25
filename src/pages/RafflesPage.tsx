import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { raffleService } from '../services/api'
import type { Raffle } from '../types'

const RafflesPage = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
  const [activeTab, setActiveTab] = useState<'raffles' | 'tickets'>('raffles')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalTickets: '',
    ticketPrice: ''
  })
  const [ticketData, setTicketData] = useState({
    buyerName: '',
    buyerEmail: ''
  })
  const [allTickets, setAllTickets] = useState<any[]>([])

  useEffect(() => {
    loadRaffles()
    loadAllTickets()
  }, [])

  const loadRaffles = async () => {
    try {
      setLoading(true)
      const data = await raffleService.getAll()
      setRaffles(data)
    } catch (error) {
      showMessage('Error al cargar rifas', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadAllTickets = async () => {
    try {
      setAllTickets([])
    } catch (error) {
      console.error('Error loading tickets:', error)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await raffleService.create({
        name: formData.name,
        description: formData.description,
        totalTickets: parseInt(formData.totalTickets),
        ticketPrice: parseFloat(formData.ticketPrice)
      })
      
      setFormData({ name: '', description: '', totalTickets: '', ticketPrice: '' })
      setShowForm(false)
      await loadRaffles()
      showMessage('Rifa creada exitosamente!')
    } catch (error) {
      showMessage('Error al crear rifa', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTicketPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRaffle) return

    try {
      setLoading(true)
      const result = await raffleService.buyTicket(selectedRaffle.id, ticketData)
      
      setTicketData({ buyerName: '', buyerEmail: '' })
      setShowTicketModal(false)
      setSelectedRaffle(null)
      await loadRaffles()
      await loadAllTickets()
      showMessage(result.message)
    } catch (error: any) {
      showMessage(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTicketInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value
    })
  }

  const openTicketModal = (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    setShowTicketModal(true)
  }

  const closeTicketModal = () => {
    setShowTicketModal(false)
    setSelectedRaffle(null)
    setTicketData({ buyerName: '', buyerEmail: '' })
  }

  const totalRaffleValue = raffles.reduce((sum, raffle) => 
    sum + (raffle.ticketsSold * raffle.ticketPrice), 0)

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎟️ Sistema Profesional de Rifas y Sorteos
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Plataforma completa para crear rifas, gestionar boletos numerados y realizar sorteos transparentes. 
          Ideal para organizaciones benéficas, empresas y eventos promocionales con control total del proceso.
        </motion.p>
        
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              💼 Sistema Desarrollado por CajasasEnterprise
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              ¿Te gusta este demo? Implementa tu sistema personalizado de rifas con todas las funcionalidades empresariales
            </p>
          </div>
          <a 
            href="https://www.cajasasenterprise.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.transform = 'translateY(0px)'
            }}
          >
            🌐 Ver Sistema Real
          </a>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#374151', fontSize: '1.5rem' }}>
          🚀 Características del Sistema
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎫</div>
            <h4 style={{ color: '#6366f1', marginBottom: '0.5rem' }}>Boletos Numerados</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Generación automática de boletos con numeración única y códigos QR</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <h4 style={{ color: '#6366f1', marginBottom: '0.5rem' }}>Pagos Integrados</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Procesamiento de pagos con múltiples métodos y confirmación automática</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <h4 style={{ color: '#6366f1', marginBottom: '0.5rem' }}>Sorteo Transparente</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Algoritmo de sorteo aleatorio verificable y auditable</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h4 style={{ color: '#6366f1', marginBottom: '0.5rem' }}>Analytics Avanzado</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Reportes detallados, métricas de ventas y progreso en tiempo real</p>
          </div>
        </div>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          className={`message ${message.includes('Error') ? 'message-error' : 'message-success'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {message}
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-content">
            <div className="stat-value">{raffles.length}</div>
            <div className="stat-label">Rifas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${totalRaffleValue.toFixed(2)}</div>
            <div className="stat-label">Recaudado</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <div className="stat-value">{raffles.reduce((sum, r) => sum + r.ticketsSold, 0)}</div>
            <div className="stat-label">Boletos Vendidos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{raffles.reduce((sum, r) => sum + r.totalTickets, 0)}</div>
            <div className="stat-label">Boletos Totales</div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '❌ Cancelar' : '➕ Nueva Rifa'}
        </button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="form-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="form-title">Crear Nueva Rifa</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre de la Rifa</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Ej: Rifa del Auto 2024"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total de Boletos</label>
                  <input
                    type="number"
                    name="totalTickets"
                    value={formData.totalTickets}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input"
                  required
                  placeholder="Descripción de la rifa y premio..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Precio por Boleto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="10.00"
                  min="0.01"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {loading ? '⏳ Creando...' : '✅ Crear Rifa'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div 
        className="tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          className={`tab ${activeTab === 'raffles' ? 'active' : ''}`}
          onClick={() => setActiveTab('raffles')}
        >
          🎟️ Rifas
        </button>
        <button
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Boletos
        </button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'raffles' && (
          <motion.div
            key="raffles"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {loading && raffles.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner">⏳</div>
                <p>Cargando rifas...</p>
              </div>
            ) : (
              <div className="products-grid">
                {raffles.map((raffle, index) => {
                  const progressPercentage = (raffle.ticketsSold / raffle.totalTickets) * 100
                  
                  return (
                    <motion.div
                      key={raffle.id}
                      className="product-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="product-header">
                        <h3 className="product-name">{raffle.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          raffle.ticketsSold === raffle.totalTickets 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {raffle.ticketsSold === raffle.totalTickets ? 'Agotada' : 'Disponible'}
                        </span>
                      </div>
                      
                      <p className="product-description">{raffle.description}</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progreso de venta</span>
                          <span>{raffle.ticketsSold}/{raffle.totalTickets}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-sm text-gray-600 mt-1">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>

                      <div className="product-stats">
                        <div className="product-stat">
                          <span className="stat-label">Precio por boleto:</span>
                          <span className="stat-value text-blue-600">${raffle.ticketPrice}</span>
                        </div>
                        <div className="product-stat">
                          <span className="stat-label">Recaudado:</span>
                          <span className="stat-value text-green-500">
                            ${(raffle.ticketsSold * raffle.ticketPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openTicketModal(raffle)}
                        disabled={loading || raffle.ticketsSold === raffle.totalTickets}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                          raffle.ticketsSold === raffle.totalTickets
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'btn btn-primary'
                        }`}
                      >
                        {raffle.ticketsSold === raffle.totalTickets 
                          ? '🚫 Boletos Agotados' 
                          : '🎫 Comprar Boleto'}
                      </button>

                      <div className="product-date">
                        Creada: {new Date(raffle.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {raffles.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">🎟️</div>
                <h3>No hay rifas</h3>
                <p>Comienza creando tu primera rifa</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Crear Primera Rifa
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tickets' && (
          <motion.div
            key="tickets"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="list-section">
              <h2 className="list-title">Boletos Vendidos ({allTickets.length})</h2>
              {allTickets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎫</div>
                  <p>No hay boletos vendidos</p>
                </div>
              ) : (
                <div className="sales-list">
                  {allTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      className="sale-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="sale-header">
                        <h3 className="sale-product">Boleto #{ticket.ticketNumber}</h3>
                        <span className="sale-total">${ticket.price}</span>
                      </div>
                      <div className="sale-details">
                        <span className="sale-quantity">Comprador: {ticket.buyerName}</span>
                        <span className="sale-date">
                          {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && selectedRaffle && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTicketModal}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Comprar Boleto</h2>
                <button
                  onClick={closeTicketModal}
                  className="modal-close"
                >
                  ❌
                </button>
              </div>

              <div className="modal-content">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedRaffle.name}</h3>
                  <p className="text-gray-600">{selectedRaffle.description}</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Precio por boleto:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${selectedRaffle.ticketPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Boletos disponibles:</span>
                      <span className="text-sm">
                        {selectedRaffle.totalTickets - selectedRaffle.ticketsSold} de {selectedRaffle.totalTickets}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleTicketPurchase} className="form">
                  <div className="form-group">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      name="buyerName"
                      value={ticketData.buyerName}
                      onChange={handleTicketInputChange}
                      className="form-input"
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      name="buyerEmail"
                      value={ticketData.buyerEmail}
                      onChange={handleTicketInputChange}
                      className="form-input"
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {loading ? '⏳ Comprando...' : '💳 Comprar Boleto'}
                    </button>
                    <button
                      type="button"
                      onClick={closeTicketModal}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳</div>
        </div>
      )}
    </div>
  )
}

export default RafflesPage