<div align="center">

# 🛒 E-Commerce Microservices Platform

### A production-ready e-commerce platform built with a fully distributed microservices architecture

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)

![License](https://img.shields.io/github/license/VladimirRamirez07/ecommerce-microservices?style=flat-square&color=blue)
![Last Commit](https://img.shields.io/github/last-commit/VladimirRamirez07/ecommerce-microservices?style=flat-square&color=green)
![Repo Size](https://img.shields.io/github/repo-size/VladimirRamirez07/ecommerce-microservices?style=flat-square&color=orange)
![Services](https://img.shields.io/badge/Microservices-5-purple?style=flat-square)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Microservices](#-microservices)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Kafka Events](#-kafka-events)
- [Database Design](#-database-design)
- [Author](#-author)

---

## 🌐 Overview

This project is a **fully distributed e-commerce platform** divided into independent microservices, each responsible for a specific business domain. The system demonstrates key software architecture principles including:

- ✅ **Async communication** via Apache Kafka event streaming
- ✅ **Fault tolerance** with independent service deployments
- ✅ **Data consistency** with database-per-service pattern
- ✅ **Scalability** through containerized services with Docker
- ✅ **Security** with JWT-based authentication
- ✅ **API documentation** with auto-generated Swagger UI per service

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          API Consumers                               │
│                    (Web / Mobile / External)                         │
└───────┬─────────┬──────────────┬────────────┬────────────────────────┘
        │         │              │            │            │
        ▼         ▼              ▼            ▼            ▼
┌───────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
│  Users    │ │ Catalog │ │Inventory │ │ Orders  │ │Payments  │
│ Service   │ │ Service │ │ Service  │ │ Service │ │ Service  │
│  :3001    │ │  :3002  │ │  :3003   │ │  :3004  │ │  :3005   │
│           │ │         │ │          │ │         │ │          │
│ Swagger ✓ │ │Swagger ✓│ │Swagger ✓ │ │Swagger ✓│ │Swagger ✓ │
└─────┬─────┘ └────┬────┘ └────┬─────┘ └────┬────┘ └─────┬────┘
      │             │           │             │             │
      ▼             ▼           ▼             └──────┬──────┘
┌──────────┐  ┌──────────┐ ┌──────────┐             │
│PostgreSQL│  │ MongoDB  │ │PostgreSQL│      ┌───────▼──────┐
│ users_db │  │catalog_db│ │inventory │      │  Apache      │
└──────────┘  └──────────┘ │   _db    │      │  Kafka       │
                            └──────────┘      │              │
                                              │  Topics:     │
                                              │  order.*     │
                                              │  payment.*   │
                                              └──────────────┘
```

### Communication Patterns

| Pattern | Used For |
|---------|----------|
| **REST / HTTP** | Synchronous client-facing requests |
| **Apache Kafka** | Async inter-service event communication |
| **Database per Service** | Data isolation and independence |

---

## 🚀 Microservices

### 👤 Users Service — Port `3001`
Handles user registration, authentication, and profile management.

- JWT-based authentication with Passport
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control (Admin / Customer)
- Soft delete for user deactivation

### 📦 Catalog Service — Port `3002`
Manages the product catalog and categories using MongoDB for flexible schema.

- Product CRUD with full attribute support
- Category management
- Advanced filtering, search, and pagination
- MongoDB with Mongoose ODM

### 📊 Inventory Service — Port `3003`
Tracks stock levels and movements for all products.

- Real-time stock tracking (quantity / reserved / available)
- Stock operations: `IN`, `OUT`, `RESERVE`, `RELEASE`
- Complete movement audit trail
- Low stock alerts endpoint

### 🛍️ Orders Service — Port `3004`
Manages the full order lifecycle and publishes events to Kafka.

- Complete order lifecycle management
- Order item tracking with subtotal calculation
- Kafka producer for async event publishing
- Order filtering by user

### 💳 Payments Service — Port `3005`
Handles payment processing and publishes results to Kafka.

- Multiple payment methods (credit card, debit card, bank transfer, digital wallet)
- Payment status lifecycle (pending → processing → completed/failed)
- Refund support
- Kafka events on payment outcome

---

## ⚡ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS + TypeScript | Modular, decorator-based backend framework |
| **Runtime** | Node.js 20 | JavaScript runtime |
| **Auth** | JWT + Passport.js | Stateless authentication |
| **ORM (SQL)** | TypeORM | PostgreSQL integration |
| **ODM (NoSQL)** | Mongoose | MongoDB integration |
| **SQL Database** | PostgreSQL 15 | Relational data (users, orders, inventory, payments) |
| **NoSQL Database** | MongoDB 6 | Flexible document store (catalog) |
| **Message Broker** | Apache Kafka | Async event-driven communication |
| **Zookeeper** | Apache Zookeeper | Kafka cluster coordination |
| **Validation** | class-validator | DTO input validation |
| **Serialization** | class-transformer | Object transformation |
| **Documentation** | Swagger / OpenAPI | Auto-generated API docs |
| **Containers** | Docker + Docker Compose | Service orchestration |
| **Password Hashing** | bcryptjs | Secure credential storage |

---

## 📁 Project Structure

```
ecommerce-microservices/
│
├── 📁 services/
│   │
│   ├── 📁 users-service/              # Auth & User Management
│   │   └── src/
│   │       ├── auth/                  # JWT, login, register
│   │       │   ├── dto/
│   │       │   └── strategies/
│   │       ├── users/                 # User CRUD
│   │       │   ├── dto/
│   │       │   └── entities/
│   │       └── config/                # Database config
│   │
│   ├── 📁 catalog-service/            # Product Catalog
│   │   └── src/
│   │       ├── products/              # Product CRUD + search
│   │       │   ├── dto/
│   │       │   └── schemas/
│   │       ├── categories/            # Category management
│   │       │   ├── dto/
│   │       │   └── schemas/
│   │       └── config/
│   │
│   ├── 📁 inventory-service/          # Stock Management
│   │   └── src/
│   │       ├── inventory/             # Stock operations
│   │       │   ├── dto/
│   │       │   └── entities/
│   │       └── config/
│   │
│   ├── 📁 orders-service/             # Order Lifecycle + Kafka
│   │   └── src/
│   │       ├── orders/                # Order management
│   │       │   ├── dto/
│   │       │   └── entities/
│   │       ├── kafka/                 # Kafka producer
│   │       └── config/
│   │
│   └── 📁 payments-service/           # Payment Processing + Kafka
│       └── src/
│           ├── payments/              # Payment processing
│           │   ├── dto/
│           │   └── entities/
│           ├── kafka/                 # Kafka producer
│           └── config/
│
├── 📁 infrastructure/
│   └── docker-compose.yml             # Full stack orchestration
│
├── 📁 docs/
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🐳 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 20+](https://nodejs.org/) *(for local development)*
- [NestJS CLI](https://docs.nestjs.com/cli/overview) *(for local development)*

### 🚀 Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/VladimirRamirez07/ecommerce-microservices.git
cd ecommerce-microservices

# Start all services
cd infrastructure
docker-compose up --build
```

All services, databases, Kafka, and Zookeeper will start automatically.

### 🛠️ Run Locally (Development)

```bash
# Install dependencies for each service
cd services/users-service && npm install
cd ../catalog-service && npm install
cd ../inventory-service && npm install
cd ../orders-service && npm install
cd ../payments-service && npm install

# Start each service individually
npm run start:dev
```

> ⚠️ Make sure PostgreSQL, MongoDB, and Kafka are running locally before starting services.

---

## 📚 API Documentation

Each service exposes its own Swagger UI for interactive API exploration:

| Service | Swagger URL |
|---------|-------------|
| 👤 Users | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) |
| 📦 Catalog | [http://localhost:3002/api/docs](http://localhost:3002/api/docs) |
| 📊 Inventory | [http://localhost:3003/api/docs](http://localhost:3003/api/docs) |
| 🛍️ Orders | [http://localhost:3004/api/docs](http://localhost:3004/api/docs) |
| 💳 Payments | [http://localhost:3005/api/docs](http://localhost:3005/api/docs) |

### Key Endpoints

```
# Auth
POST   /api/v1/auth/register       → Register new user
POST   /api/v1/auth/login          → Login & get JWT token
GET    /api/v1/auth/profile        → Get current user (JWT required)

# Products
GET    /api/v1/products            → List products (filter/search/paginate)
POST   /api/v1/products            → Create product
GET    /api/v1/products/:id        → Get product by ID
PUT    /api/v1/products/:id        → Update product
DELETE /api/v1/products/:id        → Deactivate product

# Inventory
GET    /api/v1/inventory           → Get all inventory
POST   /api/v1/inventory           → Create inventory entry
GET    /api/v1/inventory/low-stock → Get low stock alerts
PUT    /api/v1/inventory/:id/stock → Update stock (IN/OUT/RESERVE/RELEASE)
GET    /api/v1/inventory/:id/movements → Stock movement history

# Orders
POST   /api/v1/orders              → Create new order
GET    /api/v1/orders              → Get all orders
GET    /api/v1/orders/user/:userId → Get orders by user
PUT    /api/v1/orders/:id/status   → Update order status
DELETE /api/v1/orders/:id/cancel   → Cancel order

# Payments
POST   /api/v1/payments            → Process payment
GET    /api/v1/payments            → Get all payments
GET    /api/v1/payments/order/:id  → Get payments by order
DELETE /api/v1/payments/:id/refund → Refund payment
```

---

## 📡 Kafka Events

The system uses event-driven communication through Apache Kafka:

| Topic | Producer | Payload | Description |
|-------|----------|---------|-------------|
| `order.created` | orders-service | `{ id, userId, totalAmount, items, status }` | New order placed |
| `order.status.updated` | orders-service | `{ id, userId, status, updatedAt }` | Order status changed |
| `order.cancelled` | orders-service | `{ id, userId, items }` | Order cancelled |
| `payment.completed` | payments-service | `{ id, orderId, userId, amount, transactionId }` | Payment successful |
| `payment.failed` | payments-service | `{ id, orderId, userId, amount, status }` | Payment failed |
| `payment.refunded` | payments-service | `{ id, orderId, userId, amount }` | Payment refunded |

---

## 🗄️ Database Design

### PostgreSQL — users_db
| Table | Key Fields |
|-------|-----------|
| `users` | id (UUID), email (unique), password (hashed), firstName, lastName, role, isActive |

### MongoDB — catalog_db
| Collection | Key Fields |
|-----------|-----------|
| `products` | name, description, price, sku, categoryId, images, attributes, isActive |
| `categories` | name, description, isActive |

### PostgreSQL — inventory_db
| Table | Key Fields |
|-------|-----------|
| `inventory` | id (UUID), productId (unique), quantity, reserved, available, lowStockThreshold |
| `stock_movements` | id (UUID), inventoryId, type (IN/OUT/RESERVE/RELEASE), quantity, reason, orderId |

### PostgreSQL — orders_db
| Table | Key Fields |
|-------|-----------|
| `orders` | id (UUID), userId, status, totalAmount, shippingAddress |
| `order_items` | id (UUID), orderId, productId, productName, quantity, unitPrice, subtotal |

### PostgreSQL — payments_db
| Table | Key Fields |
|-------|-----------|
| `payments` | id (UUID), orderId, userId, amount, status, method, transactionId, failureReason |

---

## 👨‍💻 Author

<div align="center">

**Vladimir Ramirez**

[![GitHub](https://img.shields.io/badge/GitHub-VladimirRamirez07-181717?style=for-the-badge&logo=github)](https://github.com/VladimirRamirez07)

*Built with ❤️ as a professional portfolio project demonstrating microservices architecture*

</div>

---

<div align="center">

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>