import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, inventory } = req.body
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        inventory: parseInt(inventory)
      }
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' })
  }
})

app.post('/api/products/:id/sell', async (req, res) => {
  try {
    const { id } = req.params
    const { quantity = 1 } = req.body

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (product.inventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' })
    }

    const total = product.price * quantity

    // Create sale and update inventory
    const [sale, updatedProduct] = await Promise.all([
      prisma.sale.create({
        data: {
          productId: id,
          quantity,
          total
        }
      }),
      prisma.product.update({
        where: { id },
        data: {
          inventory: product.inventory - quantity
        }
      })
    ])

    res.json({
      sale,
      product: updatedProduct,
      message: `Sale completed! ${quantity} unit(s) sold for $${total.toFixed(2)}`
    })
  } catch (error) {
    res.status(500).json({ error: 'Error processing sale' })
  }
})

// Raffles Routes
app.get('/api/raffles', async (req, res) => {
  try {
    const raffles = await prisma.raffle.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(raffles)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching raffles' })
  }
})

app.post('/api/raffles', async (req, res) => {
  try {
    const { name, description, totalTickets, ticketPrice } = req.body
    const raffle = await prisma.raffle.create({
      data: {
        name,
        description,
        totalTickets: parseInt(totalTickets),
        ticketPrice: parseFloat(ticketPrice)
      }
    })
    res.status(201).json(raffle)
  } catch (error) {
    res.status(500).json({ error: 'Error creating raffle' })
  }
})

app.post('/api/raffles/:id/buy-ticket', async (req, res) => {
  try {
    const { id } = req.params
    const { buyerName, buyerEmail } = req.body

    const raffle = await prisma.raffle.findUnique({
      where: { id }
    })

    if (!raffle) {
      return res.status(404).json({ error: 'Raffle not found' })
    }

    if (!raffle.isActive) {
      return res.status(400).json({ error: 'Raffle is not active' })
    }

    if (raffle.soldTickets >= raffle.totalTickets) {
      return res.status(400).json({ error: 'No more tickets available' })
    }

    const ticketNumber = raffle.soldTickets + 1

    // Create ticket and update raffle
    const [ticket, updatedRaffle] = await Promise.all([
      prisma.ticket.create({
        data: {
          raffleId: id,
          ticketNumber,
          buyerName,
          buyerEmail
        }
      }),
      prisma.raffle.update({
        where: { id },
        data: {
          soldTickets: raffle.soldTickets + 1
        }
      })
    ])

    res.json({
      ticket,
      raffle: updatedRaffle,
      message: `Ticket #${ticketNumber} purchased successfully!`
    })
  } catch (error) {
    res.status(500).json({ error: 'Error purchasing ticket' })
  }
})

// Sales Stats
app.get('/api/stats/sales', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    const totalRevenue = await prisma.sale.aggregate({
      _sum: {
        total: true
      }
    })

    res.json({
      recentSales: sales,
      totalRevenue: totalRevenue._sum.total || 0
    })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales stats' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})