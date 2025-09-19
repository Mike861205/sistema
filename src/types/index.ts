export interface Product {
  id: string
  name: string
  description: string
  price: number
  inventory: number
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: string
  productId: string
  quantity: number
  total: number
  createdAt: string
  product?: Product
}

export interface Raffle {
  id: string
  name: string
  description?: string
  totalTickets: number
  ticketPrice: number
  soldTickets: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: string
  raffleId: string
  ticketNumber: number
  buyerName?: string
  buyerEmail?: string
  createdAt: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  inventory: number
}

export interface CreateRaffleData {
  name: string
  description?: string
  totalTickets: number
  ticketPrice: number
}

export interface BuyTicketData {
  buyerName?: string
  buyerEmail?: string
}