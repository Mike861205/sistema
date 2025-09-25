export interface Product {
  id: number
  name: string
  description: string
  price: number
  inventory: number
  createdAt: string
  category?: string
  barcode?: string
  image?: string
}

export interface Raffle {
  id: number
  name: string
  description: string
  totalTickets: number
  ticketPrice: number
  isActive: boolean
  createdAt: string
  soldTickets: number
}

// Nuevos tipos para POS
export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

export interface Sale {
  id: number
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia'
  amountPaid: number
  change: number
  createdAt: string
  cashierName?: string
}

export interface InventoryAlert {
  product: Product
  currentStock: number
  minimumStock: number
  alertType: 'low' | 'out'
}

export interface POSStats {
  dailySales: number
  totalTransactions: number
  topProducts: Array<{
    product: Product
    quantitySold: number
    revenue: number
  }>
  lowStockProducts: InventoryAlert[]
}