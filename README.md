
---

# 🛒 Order Management Backend API

A **full-featured backend** for managing orders, built with **Node.js, TypeScript, Prisma, and PostgreSQL**. Provides REST APIs to create, read, update, delete, and search orders with product counts.

---

## 🔹 Tech Stack

* **Backend Framework:** Node.js + Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (RDBMS)
* **ORM:** Prisma
* **Validation & Sanitization:** Zod
* **API Testing:** Postman / cURL
* **Deployment:** Render

---
## 🚀Deployed URL: https://checkministry-assignment-server.onrender.com/api/v1/orders
---

## 📦 Features

* CRUD operations on **Orders**
* Search orders by **ID** or **description** (case-insensitive)
* Count of products per order
* Input validation & sanitization
* Error handling (404, 400, 500)
* Clean, modular architecture (Controllers, Routes, Middleware)
* Ready for production (compiled TypeScript → JavaScript)

---

## 🔹 Project Structure

```
project-root/
│
├─ src/
│   ├─ controllers/      # Controller functions for business logic
│   ├─ routes/           # Express routes
│   ├─ middlewares/      # Middleware (validation)
|   ├─ utils/            # Utility Functions (format orders)
│   ├─ db.ts             # Prisma client setup
│   └─ index.ts          # Entry point
│
├─ prisma/
│   ├─ schema.prisma     # Database schema
│   └─ seed.ts           # Sample products data seed 
│
├─ package.json
├─ tsconfig.json
├─ .env                  # Environment variables
└─ README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Tima99/CheckMinistry-Assignment-Server
cd CheckMinistry-Assignment-Server
```

### 2️⃣ Install dependencies

```bash
npm -D install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

> Replace the values with your PostgreSQL credentials.

---

### 4️⃣ Prisma setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations to create tables:

```bash
npx prisma migrate dev --name init
```

(Mandatory) Seed sample products:

```bash
npx ts-node prisma/seed.ts
```

---

### 5️⃣ Running the API

#### Development

```bash
npm run dev
```

* Uses `ts-node` to run TypeScript directly.
* Available at: `http://localhost:3000/api/v1/orders`

#### Production

```bash
npm run build
npm start
```

* Compiles TypeScript → JavaScript in `dist/`
* Runs Node on compiled JS

---

### 6️⃣ API Endpoints

| Method | URL                        | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/v1/orders`           | Get all orders              |
| GET    | `/api/v1/orders/:id`       | Get order by ID             |
| POST   | `/api/v1/orders`           | Create a new order          |
| PUT    | `/api/v1/orders/:id`       | Update order description    |
| DELETE | `/api/v1/orders/:id`       | Delete order by ID          |
| GET    | `/api/v1/orders/search?q=` | Search by ID or description |
| GET    | `/api/v1/products`         | Get all products            |

### 7️⃣ Testing

* **Postman / Insomnia / cURL** can be used to test all endpoints.
* Example cURL to create an order:

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"orderDescription":"New Laptop","productIds":[1,2]}'
```

---

### 8️⃣ Notes & Recommendations

* All numeric queries search **order ID**, otherwise search is **case-insensitive on description**.
* Input validation handled using **Zod** schemas.
* Product IDs are validated against database before creating an order.
* Minor validation can be handled in the controller, but for complex structures, it is recommended to use Zod.

---
