# SpendFlow - Enterprise Reimbursement Management

SpendFlow is a modern, automated system for managing company expenses and reimbursements. Designed for high-performance teams, it replaces manual spreadsheets with intelligent workflows, multi-currency support, and OCR scanning.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Ensure you have a PostgreSQL server running. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/spendflow"
JWT_SECRET="your-super-secret-key"
```

Sync the database schema:
```bash
npx prisma db push
```

### 3. Seed Demo Data
Populate the system with demo users and a company:
```bash
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Login Credentials (Seed Data)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@odoo.com | password123 |
| **Manager** | manager@odoo.com | password123 |
| **Employee** | employee@odoo.com | password123 |

## ✨ Features

- **Custom JWT Auth**: Secure, self-hosted authentication system.
- **Role-Based Access**: Dedicated views for Admins, Managers, and Employees.
- **Smart OCR Mock**: Instant receipt scanning and auto-filling of expense forms.
- **Complex Workflows**: Support for sequential, percentage-based, and override logic.
- **Multi-Currency**: Integrated with ExchangeRate API for real-time global spending.
- **Premium UI**: Dark mode ready, Odoo-inspired aesthetic with smooth Framer Motion animations.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL.
- **Auth**: Custom JWT middleware with Bcrypt password hashing.
