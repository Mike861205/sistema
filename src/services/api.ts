import type { Product, Sale, Raffle, Ticket, CreateProductData, CreateRaffleData, BuyTicketData } from '../types'

const API_BASE = 'http://localhost:3001/api'

// Products API
export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  async sell(id: string, quantity: number = 1): Promise<{ sale: Sale, product: Product, message: string }> {
    const response = await fetch(`${API_BASE}/products/${id}/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to sell product')
    }
    return response.json()
  }
}

// Raffles API
export const raffleService = {
  async getAll(): Promise<Raffle[]> {
    const response = await fetch(`${API_BASE}/raffles`)
    if (!response.ok) throw new Error('Failed to fetch raffles')
    return response.json()
  },

  async create(data: CreateRaffleData): Promise<Raffle> {
    const response = await fetch(`${API_BASE}/raffles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create raffle')
    return response.json()
  },

  async buyTicket(id: string, data: BuyTicketData): Promise<{ ticket: Ticket, raffle: Raffle, message: string }> {
    const response = await fetch(`${API_BASE}/raffles/${id}/buy-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to buy ticket')
    }
    return response.json()
  }
}

// Stats API
export const statsService = {
  async getSalesStats(): Promise<{ recentSales: Sale[], totalRevenue: number }> {
    const response = await fetch(`${API_BASE}/stats/sales`)
    if (!response.ok) throw new Error('Failed to fetch sales stats')
    return response.json()
  }
}