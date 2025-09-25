<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Setup Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Modern React 18 project with TypeScript, Vite, TailwindCSS, demos for products/sales and raffle system
- [x] Scaffold the Project - Created Vite React TypeScript project with all required dependencies
- [x] Customize the Project - Set up Prisma, API routes, React Router, components for demos
- [x] Install Required Extensions - No additional extensions needed
- [x] Compile the Project - All dependencies installed and project configured
- [x] Create and Run Task - Ready to run with npm run dev
- [x] Launch the Project - Project ready for development
- [x] Ensure Documentation is Complete - README and instructions completed

## Project Complete! 🎉

This React demos application includes:

### ✅ Features Implemented
- Modern React 18 + TypeScript setup with Vite bundler
- TailwindCSS for styling with custom components
- Framer Motion for smooth animations
- React Router for SPA navigation
- Prisma ORM with PostgreSQL (Neon) integration
- Express.js API server with CORS support
- Product management system with inventory tracking
- Raffle system with ticket purchasing
- Responsive design for all screen sizes
- Data seeding for immediate demo usage

### 🚀 Getting Started
1. Copy `.env.example` to `.env`
2. Configure your Neon PostgreSQL connection in `.env`
3. Run `npm run db:generate && npm run db:migrate`
4. Run `npm run db:seed` for sample data
5. Run `npm run dev` to start both client and server

### 📁 Project Structure
- `/src` - React frontend application
- `/server` - Express API server
- `/prisma` - Database schema and migrations
- All modern development tools configured and ready

The project is now ready for development, testing, and deployment to Vercel!