import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '../services/api'
import type { Product, CartItem, Sale, POSStats } from '../types'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeModule, setActiveModule] = useState<'pos' | 'products' | 'inventory' | 'sales'>('pos')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [stats, setStats] = useState<POSStats | null>(null)
  const [salesHistory, setSalesHistory] = useState<Sale[]>([])

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: '',
    barcode: ''
  })

  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'efectivo' as 'efectivo' | 'tarjeta' | 'transferencia',
    amountPaid: '',
    cashierName: 'Demo Cashier'
  })

  const categories = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Alimentos', 'Bebidas']

  useEffect(() => {
    loadProducts()
    loadStats()
    loadSalesHistory()
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

  const loadStats = async () => {
    // Simulated stats for demo
    setStats({
      dailySales: 1250.50,
      totalTransactions: 23,
      topProducts: [],
      lowStockProducts: []
    })
  }

  const loadSalesHistory = async () => {
    // Simulated sales history
    setSalesHistory([])
  }

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.inventory) {
        showMessage('Stock insuficiente', 'error')
        return
      }
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * product.price }
          : item
      ))
    } else {
      if (quantity > product.inventory) {
        showMessage('Stock insuficiente', 'error')
        return
      }
      setCart([...cart, {
        product,
        quantity,
        subtotal: quantity * product.price
      }])
    }
    showMessage(`${product.name} agregado al carrito`)
  }

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (!product) return

    if (newQuantity > product.inventory) {
      showMessage('Stock insuficiente', 'error')
      return
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
        : item
    ))
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0)
  }

  const getCartTax = () => {
    return getCartTotal() * 0.16 // 16% IVA
  }

  const getCartFinalTotal = () => {
    return getCartTotal() + getCartTax()
  }

  // Product management
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await productService.create({
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        inventory: parseInt(productForm.inventory)
      })
      
      setProductForm({ name: '', description: '', price: '', inventory: '', category: '', barcode: '' })
      await loadProducts()
      showMessage('Producto creado exitosamente!')
    } catch (error) {
      showMessage('Error al crear producto', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Payment processing
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const total = getCartFinalTotal()
    const amountPaid = parseFloat(paymentForm.amountPaid)
    
    if (paymentForm.paymentMethod === 'efectivo' && amountPaid < total) {
      showMessage('Monto insuficiente', 'error')
      return
    }

    const change = paymentForm.paymentMethod === 'efectivo' ? Math.max(0, amountPaid - total) : 0

    const sale: Sale = {
      id: Date.now(),
      items: [...cart],
      total: getCartFinalTotal(),
      subtotal: getCartTotal(),
      tax: getCartTax(),
      paymentMethod: paymentForm.paymentMethod,
      amountPaid,
      change,
      createdAt: new Date().toISOString(),
      cashierName: paymentForm.cashierName
    }

    // Update inventory (simulate)
    for (const item of cart) {
      await productService.sell(item.product.id, item.quantity)
    }

    setSalesHistory([sale, ...salesHistory])
    clearCart()
    setShowPaymentModal(false)
    setPaymentForm({ paymentMethod: 'efectivo', amountPaid: '', cashierName: 'Demo Cashier' })
    await loadProducts()
    await loadStats()
    
    showMessage(`Venta procesada. Cambio: $${change.toFixed(2)}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    })
  }

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
          💰 Sistema POS - Point of Sale
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Sistema completo de punto de venta con carrito, cobro e inventario
        </motion.p>
      </div>

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
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${stats?.dailySales.toFixed(2) || '0.00'}</div>
            <div className="stat-label">Ventas del Día</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalTransactions || 0}</div>
            <div className="stat-label">Transacciones</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Productos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-value">{cart.length}</div>
            <div className="stat-label">Items en Carrito</div>
          </div>
        </div>
      </motion.div>

      {/* POS Modules Navigation */}
      <motion.div 
        className="tabs pos-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button
          className={`tab ${activeModule === 'pos' ? 'active' : ''}`}
          onClick={() => setActiveModule('pos')}
        >
          🛒 POS - Ventas
        </button>
        <button
          className={`tab ${activeModule === 'products' ? 'active' : ''}`}
          onClick={() => setActiveModule('products')}
        >
          📦 Productos
        </button>
        <button
          className={`tab ${activeModule === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveModule('inventory')}
        >
          📊 Inventario
        </button>
        <button
          className={`tab ${activeModule === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveModule('sales')}
        >
          📋 Ventas
        </button>
      </motion.div>

      {/* Module Content */}
      <AnimatePresence mode="wait">
        {activeModule === 'pos' && (
          <motion.div
            key="pos"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pos-layout">
              {/* Products Grid */}
              <div className="pos-products">
                <h2 className="section-title">Productos Disponibles</h2>
                <div className="products-grid pos-products-grid">
                  {products.filter(p => p.inventory > 0).map((product) => (
                    <motion.div
                      key={product.id}
                      className="pos-product-card"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(product)}
                    >
                      <div className="pos-product-info">
                        <h3 className="pos-product-name">{product.name}</h3>
                        <p className="pos-product-price">${product.price}</p>
                        <span className="pos-product-stock">Stock: {product.inventory}</span>
                      </div>
                      <button className="pos-add-btn">+</button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="pos-cart">
                <div className="cart-header">
                  <h2 className="section-title">Carrito de Compras</h2>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="btn-danger btn-small">
                      🗑️ Limpiar
                    </button>
                  )}
                </div>

                <div className="cart-items">
                  {cart.length === 0 ? (
                    <div className="empty-cart">
                      <div className="empty-icon">🛒</div>
                      <p>Carrito vacío</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="cart-item">
                        <div className="cart-item-info">
                          <h4>{item.product.name}</h4>
                          <p>${item.product.price} c/u</p>
                        </div>
                        <div className="cart-item-controls">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="remove-btn"
                          >
                            ❌
                          </button>
                        </div>
                        <div className="cart-item-subtotal">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="cart-summary">
                    <div className="summary-line">
                      <span>Subtotal:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                      <span>IVA (16%):</span>
                      <span>${getCartTax().toFixed(2)}</span>
                    </div>
                    <div className="summary-line total-line">
                      <span>Total:</span>
                      <span>${getCartFinalTotal().toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="btn btn-primary btn-full checkout-btn"
                    >
                      💳 Procesar Pago
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              className="modal payment-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">💳 Procesar Pago</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="modal-close"
                >
                  ❌
                </button>
              </div>

              <div className="modal-content">
                <div className="payment-summary">
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>IVA:</span>
                    <span>${getCartTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-line total-line">
                    <span>Total a Pagar:</span>
                    <span>${getCartFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="form payment-form">
                  <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select
                      name="paymentMethod"
                      value={paymentForm.paymentMethod}
                      onChange={handlePaymentInputChange}
                      className="form-input"
                      required
                    >
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="tarjeta">💳 Tarjeta</option>
                      <option value="transferencia">🏦 Transferencia</option>
                    </select>
                  </div>

                  {paymentForm.paymentMethod === 'efectivo' && (
                    <div className="form-group">
                      <label className="form-label">Monto Recibido</label>
                      <input
                        type="number"
                        step="0.01"
                        name="amountPaid"
                        value={paymentForm.amountPaid}
                        onChange={handlePaymentInputChange}
                        className="form-input"
                        required
                        placeholder={getCartFinalTotal().toFixed(2)}
                        min={getCartFinalTotal()}
                      />
                      {paymentForm.amountPaid && (
                        <div className="form-hint">
                          Cambio: ${Math.max(0, parseFloat(paymentForm.amountPaid) - getCartFinalTotal()).toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Cajero</label>
                    <input
                      type="text"
                      name="cashierName"
                      value={paymentForm.cashierName}
                      onChange={handlePaymentInputChange}
                      className="form-input"
                      placeholder="Nombre del cajero"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {loading ? '⏳ Procesando...' : '✅ Completar Venta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
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

export default ProductsPage