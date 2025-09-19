import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.sale.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.product.deleteMany()
  await prisma.raffle.deleteMany()

  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Smartphone Galaxy Pro',
        description: 'Último modelo con cámara de 108MP, batería de larga duración y procesador de alta gama.',
        price: 899.99,
        inventory: 25,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Gaming Ultra',
        description: 'Laptop para gaming con RTX 4060, 16GB RAM, SSD 1TB. Perfecta para juegos y trabajo.',
        price: 1299.99,
        inventory: 15,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Auriculares Wireless Premium',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería.',
        price: 249.99,
        inventory: 50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch Fitness Pro',
        description: 'Reloj inteligente con monitoreo de salud, GPS y resistencia al agua.',
        price: 199.99,
        inventory: 30,
      },
    }),
  ])

  // Seed Raffles
  const raffles = await Promise.all([
    prisma.raffle.create({
      data: {
        name: 'Rifa iPhone 15 Pro',
        description: 'Gana el último iPhone 15 Pro de 256GB en color azul titanio',
        totalTickets: 100,
        ticketPrice: 25.00,
        soldTickets: 0,
        isActive: true,
      },
    }),
    prisma.raffle.create({
      data: {
        name: 'Rifa Tesla Model 3',
        description: 'Participa por un Tesla Model 3 completamente equipado. ¡La rifa del siglo!',
        totalTickets: 1000,
        ticketPrice: 150.00,
        soldTickets: 0,
        isActive: true,
      },
    }),
    prisma.raffle.create({
      data: {
        name: 'Rifa MacBook Pro M3',
        description: 'MacBook Pro de 14 pulgadas con chip M3 Pro, 18GB RAM y 512GB SSD',
        totalTickets: 200,
        ticketPrice: 75.00,
        soldTickets: 0,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`📦 Created ${products.length} products`)
  console.log(`🎟️ Created ${raffles.length} raffles`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })