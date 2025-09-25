import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '../services/api'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  image: string
  description: string
  barcode: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface NewProduct {
  name: string
  price: string
  category: string
  stock: string
  description: string
  barcode: string
}

const ProductsPage = () => {
  const [activeModule, setActiveModule] = useState<'pos' | 'inventory' | 'add-product'>('pos')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    barcode: ''
  })

  const categories = ['all', 'Electronics', 'Clothing', 'Food', 'Books', 'Home']

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([
        { 
          id: 1, 
          name: 'Laptop HP Pavilion 15', 
          price: 15999.00, 
          category: 'Electronics', 
          stock: 10, 
          image: '/api/placeholder/300/200',
          description: 'Laptop HP Pavilion 15 con procesador Intel i5, 8GB RAM, SSD 256GB',
          barcode: '123456789012'
        },
        { 
          id: 2, 
          name: 'Mouse Logitech MX Master 3', 
          price: 1299.00, 
          category: 'Electronics', 
          stock: 25, 
          image: '/api/placeholder/300/200',
          description: 'Mouse inalámbrico profesional con scroll infinito',
          barcode: '123456789013'
        },
        { 
          id: 3, 
          name: 'Teclado Mecánico RGB', 
          price: 1899.00, 
          category: 'Electronics', 
          stock: 15, 
          image: '/api/placeholder/300/200',
          description: 'Teclado mecánico con switches Cherry MX Blue e iluminación RGB',
          barcode: '123456789014'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm)
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      } else {
        return [...prevCart, { product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const processPayment = () => {
    alert('Pago procesado exitosamente! Total: $' + getTotalPrice().toFixed(2))
    setCart([])
    setShowPaymentModal(false)
    setShowCart(false)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Por favor complete los campos obligatorios')
      return
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description,
      barcode: newProduct.barcode || Date.now().toString(),
      image: '/api/placeholder/300/200'
    }

    setProducts(prev => [...prev, product])
    setNewProduct({
      name: '',
      price: '',
      category: '',
      stock: '',
      description: '',
      barcode: ''
    })
    alert('Producto agregado exitosamente!')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando sistema POS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Sistema POS Pro</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Productos: {products.length}</span>
              </div>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span></span>
                <span>Carrito</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <button
              onClick={() => setActiveModule('pos')}
              className={'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ' + (
                activeModule === 'pos' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <span></span>
              <span>Punto de Venta</span>
            </button>
            <button
              onClick={() => setActiveModule('add-product')}
              className={'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ' + (
                activeModule === 'add-product' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <span></span>
              <span>Alta de Producto</span>
            </button>
            <button
              onClick={() => setActiveModule('inventory')}
              className={'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ' + (
                activeModule === 'inventory' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <span></span>
              <span>Inventario</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className={(showCart ? 'w-2/3' : 'w-full') + ' transition-all duration-300'}>
            <AnimatePresence mode="wait">
              {activeModule === 'pos' && (
                <motion.div
                  key="pos"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Buscar por nombre o código de barras..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>
                              {cat === 'all' ? 'Todas las categorías' : cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                              {product.name}
                            </h3>
                            <span className={'px-2 py-1 text-xs rounded-full ' + (
                              product.stock > 10 ? 'bg-green-100 text-green-800' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            )}>
                              Stock: {product.stock}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                          <p className="text-lg font-bold text-green-600 mb-3">
                            ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className={'w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ' + (
                              product.stock === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                            )}
                          >
                            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                      <p className="text-gray-600">Intenta cambiar los filtros de búsqueda</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeModule === 'add-product' && (
                <motion.div
                  key="add-product"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Alta de Nuevo Producto</h2>
                      
                      <form onSubmit={handleAddProduct} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Producto *
                            </label>
                            <input
                              type="text"
                              required
                              value={newProduct.name}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Ej. Laptop HP Pavilion"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Precio *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              required
                              value={newProduct.price}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Categoría *
                            </label>
                            <select
                              required
                              value={newProduct.category}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Seleccionar categoría</option>
                              {categories.filter(cat => cat !== 'all').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Stock Inicial
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                          </label>
                          <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Descripción detallada del producto..."
                          />
                        </div>
                        
                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Guardar Producto
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeModule === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
                      <p className="text-gray-600 mt-1">Resumen y control de stock</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {product.category}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={'inline-flex px-2 py-1 text-xs font-semibold rounded-full ' + (
                                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                )}>
                                  {product.stock > 10 ? 'En Stock' :
                                   product.stock > 0 ? 'Stock Bajo' : 'Sin Stock'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showCart && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                className="w-1/3 bg-white rounded-lg shadow-lg h-fit sticky top-6"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Carrito de Compras</h2>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4"></div>
                      <p className="text-gray-500">El carrito está vacío</p>
                      <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors ml-2"
                            >
                              
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t border-gray-200 pt-4 mt-6">
                        <div className="flex justify-between items-center mb-4 text-lg font-bold">
                          <span>Total:</span>
                          <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        
                        <button
                          onClick={processPayment}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Procesar Pago ({getTotalItems()} items)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
