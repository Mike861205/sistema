# 🚀 React Demos - Productos y Rifas

Una aplicación web moderna construida con React 18, TypeScript, Vite y TailwindCSS que demuestra dos sistemas funcionales: gestión de productos/ventas y sistema de rifas.

## ✨ Características

### 🏠 Landing Page
- Diseño moderno y atractivo con animaciones Framer Motion
- Responsive design con TailwindCSS
- Navegación fluida entre secciones
- Gradientes y efectos visuales modernos

### 📦 Sistema de Productos y Ventas
- ✅ Formulario para crear productos (nombre, precio, descripción, inventario)
- ✅ Lista de productos con diseño de tarjetas
- ✅ Funcionalidad de venta que descuenta automáticamente el inventario
- ✅ Validación de stock disponible
- ✅ Estados en tiempo real (loading, success, error)
- ✅ Persistencia en base de datos PostgreSQL

### 🎟️ Sistema de Rifas
- ✅ Formulario para crear rifas (nombre, descripción, total de boletos, precio)
- ✅ Vista de rifas activas con progreso visual
- ✅ Compra de boletos numerados secuencialmente
- ✅ Tracking de boletos vendidos vs disponibles
- ✅ Modal para captura de datos del comprador
- ✅ Estados de rifa (activa, completada)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI con hooks modernos
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Bundler ultrarrápido para desarrollo
- **TailwindCSS** - Framework CSS utilitario
- **Framer Motion** - Librería de animaciones
- **React Router** - Navegación SPA

### Backend
- **Node.js + Express** - Servidor API RESTful
- **Prisma ORM** - ORM moderno para TypeScript
- **PostgreSQL (Neon)** - Base de datos en la nube

### DevTools
- **TypeScript** - Desarrollo con tipado fuerte
- **Concurrent Scripts** - Ejecución simultánea de cliente y servidor
- **Hot Reload** - Recarga automática en desarrollo

## 🗄️ Estructura de Base de Datos

### Productos
```sql
- id: String (CUID)
- name: String
- description: String  
- price: Float
- inventory: Int
- createdAt: DateTime
- updatedAt: DateTime
```

### Ventas
```sql
- id: String (CUID)
- productId: String (FK)
- quantity: Int
- total: Float
- createdAt: DateTime
```

### Rifas
```sql
- id: String (CUID)
- name: String
- description: String (opcional)
- totalTickets: Int
- ticketPrice: Float
- soldTickets: Int
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### Boletos
```sql
- id: String (CUID)
- raffleId: String (FK)
- ticketNumber: Int
- buyerName: String (opcional)
- buyerEmail: String (opcional)
- createdAt: DateTime
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd react-demos-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
1. Crear una cuenta en [Neon](https://neon.tech)
2. Crear una nueva base de datos PostgreSQL
3. Copiar el archivo `.env.example` a `.env`
4. Configurar la variable `DATABASE_URL` con tu connection string de Neon:

```bash
cp .env.example .env
# Editar .env con tu DATABASE_URL
```

### 4. Configurar Prisma
```bash
npm run db:generate
npm run db:migrate
```

### 5. Poblar con datos de ejemplo (opcional)
```bash
npm run db:seed
```

### 6. Ejecutar en desarrollo
```bash
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend API en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
react-demos-app/
├── src/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── ProductsPage.tsx
│   │   └── RafflesPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   └── index.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🌐 API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear nuevo producto
- `POST /api/products/:id/sell` - Procesar venta

### Rifas
- `GET /api/raffles` - Obtener rifas activas
- `POST /api/raffles` - Crear nueva rifa
- `POST /api/raffles/:id/buy-ticket` - Comprar boleto

### Estadísticas
- `GET /api/stats/sales` - Obtener estadísticas de ventas

## 🎨 Características de UI/UX

### Diseño Responsive
- Mobile-first design
- Breakpoints adaptativos
- Navegación touch-friendly

### Animaciones
- Transiciones suaves con Framer Motion
- Estados de loading animados
- Hover effects en tarjetas
- Modales con spring animations

### Feedback Visual
- Mensajes de éxito/error
- Estados de loading
- Validación de formularios
- Progress bars para rifas

## 🚢 Deploy en Vercel

### 1. Preparar el repositorio
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Configurar Vercel
1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno:
   - `DATABASE_URL`: Tu connection string de Neon
   - `NODE_ENV`: production

### 3. Comandos de build
- Build Command: `npm run build`
- Output Directory: `dist`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo completo (cliente + servidor)
npm run dev:client   # Solo cliente React
npm run dev:server   # Solo servidor Express
npm run build        # Build para producción
npm run preview      # Preview del build
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar base de datos
```

## 🎯 Casos de Uso

### Para Desarrolladores
- Referencia de implementación React + TypeScript
- Ejemplo de integración Prisma + PostgreSQL
- Patrón de API RESTful con Express
- Implementación de formularios complejos

### Para Demostraciones
- Sistema de inventario básico
- E-commerce simplificado
- Sistema de sorteos/concursos
- Dashboard de administración

## 🤝 Contribuciones

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙋‍♂️ Soporte

¿Necesitas ayuda? 
- Abre un [Issue](../../issues)
- Contacta al desarrollador

---

**¡Construido con ❤️ usando React 18 y las mejores prácticas de desarrollo moderno!**