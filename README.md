<div align="center">
  <img src="https://via.placeholder.com/150/12b4a3/ffffff?text=APEXIUMS" alt="APEXIUMS Logo" width="120" height="120" />
  <br/>
  <h1>✨ APEXIUMS ✨</h1>
  <p><strong>Next-Generation Enterprise Retail & POS Management System</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
</div>

<br/>

## 🌟 Overview

**APEXIUMS** is a production-grade, multi-tenant Retail Management System built for modern businesses. It combines point-of-sale (POS), deep inventory control, staff role management, financial tracking, and supplier operations into one seamless, blazingly fast platform. 

Whether you're running a single retail branch or a headquarters managing multiple stores, APEXIUMS provides the scalable architecture needed to handle millions of transactions.

## 🚀 Key Features

- 🔐 **Advanced RBAC (Role-Based Access Control)**: Secure granular permissions for Super Admins, Store Admins, Managers, Cashiers, and Accountants.
- 💳 **Lightning Fast POS**: Barcode-scanner ready Point of Sale system with automated inventory deduction.
- 📦 **Deep Inventory Management**: Real-time stock levels, low-stock alerts, category sorting, and multi-branch movement.
- 🚚 **Supplier & Wholesale Tracking**: Track purchase orders, wholesale debts, and stock intake.
- 💰 **Finance & Debt Tracking**: Advanced accounting ledger to track store revenue, customer debts, expenses, and automated balance sheets.
- 🏢 **Multi-Tenant Architecture**: HQ Super Admin dashboard to oversee and manage multiple isolated branch stores.

## 🛠️ Technology Stack

**Frontend Architecture:**
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Custom Premium UI
- **State Management:** Zustand + TanStack Query (React Query)
- **Icons & Visualization:** Lucide React, Recharts

**Backend Architecture:**
- **Runtime:** Node.js + Express
- **Language:** TypeScript 
- **Database & ORM:** PostgreSQL + Prisma ORM (v5)
- **Caching & Auth:** Redis + JWT (JSON Web Tokens)
- **Validation:** Zod

---

## 🏎️ Quick Start Guide

We use a high-performance hybrid setup: databases run in Docker, while the Node.js servers run natively for maximum development speed.

### 1️⃣ Spin up the Databases
Make sure Docker Desktop is running, then execute:
`ash
docker compose up -d
`
*(This instantly provisions PostgreSQL on port 5432 and Redis on port 6379)*

### 2️⃣ Start the Backend API Server
Open a new terminal in the ackend folder:
`ash
cd backend
npm install
npm run dev
`
*(The backend will securely run on http://localhost:5000)*

### 3️⃣ Start the Frontend UI Server
Open a new terminal in the rontend folder:
`ash
cd frontend
npm install
npm run dev
`
*(The APEXIUMS dashboard will be available at http://localhost:3000)*

---

## 🔑 Default Master Credentials

After running the initial setup and database seed, you can access the Headquarters portal at http://localhost:3000/admin/login:

- **Super Admin Email**: dmin@example.com
- **Master Password**: dmin123

---

## 🗄️ Database Management (Prisma)

If you ever need to reset your database schema, run new migrations, or re-seed the system data, run these commands from the ackend directory:

`ash
# Generate Prisma Client
npx prisma generate

# Apply new migrations to database
npx prisma migrate dev --name <migration_name>

# Reset and seed the database
npx prisma migrate reset
npm run seed
`

## 🔒 Security Architecture
- Robust middleware enforcing authorization across all 5+ user roles.
- cryptjs for secure password hashing.
- Redis-backed JWT refresh token architecture.
- Complete backend validation ensuring data integrity before database insertion.
