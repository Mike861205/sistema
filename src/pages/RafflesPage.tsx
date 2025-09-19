import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { raffleService } from '../services/api'
import type { Raffle } from '../types'

const RafflesPage = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
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

  useEffect(() => {
    loadRaffles()
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

  const handleBuyTicket = async () => {
    if (!selectedRaffle) return
    
    try {
      setLoading(true)
      const result = await raffleService.buyTicket(selectedRaffle.id, ticketData)
      await loadRaffles()
      setShowTicketModal(false)
      setTicketData({ buyerName: '', buyerEmail: '' })
      setSelectedRaffle(null)
      showMessage(result.message)
    } catch (error: any) {
      showMessage(error.message, 'error')
    } finally {
      setLoading(false)
    }
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

  const getProgressPercentage = (raffle: Raffle) => {
    return Math.round((raffle.soldTickets / raffle.totalTickets) * 100)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎟️ Sistema de Rifas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crea rifas, vende boletos y gestiona sorteos de manera profesional
          </p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? '❌ Cancelar' : '➕ Nueva Rifa'}
          </button>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Rifa</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Rifa
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Ej: Rifa iPhone 15 Pro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-input"
                    placeholder="Descripción de la rifa y el premio..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Total de Boletos
                    </label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio por Boleto ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="25.00"
                      min="0.01"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : '✅ Crear Rifa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Raffles Grid */}
        {loading && raffles.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando rifas...</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {raffles.map((raffle, index) => {
              const progress = getProgressPercentage(raffle)
              const isCompleted = raffle.soldTickets >= raffle.totalTickets

              return (
                <motion.div
                  key={raffle.id}
                  className="card p-6 hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {raffle.name}
                    </h3>
                    {raffle.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {raffle.description}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Precio por boleto:</span>
                      <span className="text-xl font-bold text-purple-600">
                        ${raffle.ticketPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {raffle.soldTickets} / {raffle.totalTickets} boletos
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-green-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-1">
                        {progress}% vendido
                      </p>
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">
                        ${(raffle.soldTickets * raffle.ticketPrice).toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-600">recaudado</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openTicketModal(raffle)}
                    disabled={loading || isCompleted || !raffle.isActive}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      isCompleted || !raffle.isActive
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isCompleted 
                      ? '🏆 Rifa Completada' 
                      : !raffle.isActive 
                      ? '❌ Rifa Inactiva'
                      : '🎫 Comprar Boleto'
                    }
                  </button>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Creada: {new Date(raffle.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {raffles.length === 0 && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay rifas activas</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primera rifa</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Crear Primera Rifa
            </button>
          </motion.div>
        )}
      </div>

      {/* Ticket Purchase Modal */}
      {showTicketModal && selectedRaffle && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎫 Comprar Boleto
            </h3>
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-purple-600 mb-2">
                {selectedRaffle.name}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Precio: ${selectedRaffle.ticketPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Tu número de boleto será: <strong>#{selectedRaffle.soldTickets + 1}</strong>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre (opcional)
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={ticketData.buyerName}
                  onChange={handleTicketInputChange}
                  className="form-input"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={ticketData.buyerEmail}
                  onChange={handleTicketInputChange}
                  className="form-input"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBuyTicket}
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Comprando...' : '💰 Confirmar Compra'}
              </button>
              <button
                onClick={closeTicketModal}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default RafflesPage