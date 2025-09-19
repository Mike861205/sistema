import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { productService } from '../services/api'
import type { Product } from '../types'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    inventory: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      showMessage('Error al cargar productos', 'error')
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
      await productService.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory)
      })
      
      setFormData({ name: '', description: '', price: '', inventory: '' })
      setShowForm(false)
      await loadProducts()
      showMessage('Producto creado exitosamente!')
    } catch (error) {
      showMessage('Error al crear producto', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSell = async (product: Product) => {
    try {
      setLoading(true)
      const result = await productService.sell(product.id)
      await loadProducts()
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
            📦 Sistema de Productos y Ventas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona productos, inventario y procesa ventas en tiempo real
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
            {showForm ? '❌ Cancelar' : '➕ Nuevo Producto'}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Producto</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Ej: iPhone 15 Pro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="999.99"
                    />
                  </div>
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
                    required
                    placeholder="Descripción detallada del producto..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inventario Inicial
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : '✅ Crear Producto'}
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

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="card p-6 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Precio:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Inventario:</span>
                    <span className={`font-bold ${
                      product.inventory > 10 
                        ? 'text-green-600' 
                        : product.inventory > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {product.inventory} unidades
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSell(product)}
                  disabled={loading || product.inventory === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    product.inventory === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {product.inventory === 0 ? '❌ Sin Stock' : '💰 Vender (1 unidad)'}
                </button>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  Creado: {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {products.length === 0 && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer producto</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Crear Primer Producto
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage