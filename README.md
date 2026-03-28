#  PriyaDivine Backend

A production-ready e-commerce backend built using the MERN stack, designed for scalability, security, and real-world usage.

---

##  Overview

PriyaDivine is a fully functional backend system for an e-commerce platform focused on devotional and handmade products. It handles authentication, product management, cart operations, order processing, payments, and admin analytics.

This backend is designed with **production-level architecture**, including transaction safety, inventory management, and secure API handling.

---

##  Tech Stack

* **Node.js** & **Express.js**
* **MongoDB Atlas** & **Mongoose**
* **JWT Authentication**
* **Cloudinary** (Image Upload)
* **Razorpay** (Payment Integration)
* **Joi** (Validation)
* **Helmet & Rate Limiting** (Security)

---

##  Key Features

###  Authentication

* User registration & login
* Password hashing using bcrypt
* JWT-based authentication
* Role-based access (Admin/User)

---

###  Product Management

* Create, update, delete products (Admin)
* Image upload via Cloudinary
* Product search & filtering

---

### 🛒 Cart System

* Add/remove/update items
* Stores product snapshot (name, price, image)
* Auto total price calculation

---

###  Order System

* Create order after payment verification
* Immutable order data (snapshot stored)
* Order status tracking:

  * processing → shipped → delivered

---

### Payment Integration

* Razorpay order creation
* Secure payment verification using signature
* Duplicate payment prevention
* Order creation only after successful payment

---

###  Inventory Management

* Stock validation before order creation
* Atomic stock deduction using MongoDB transactions
* Prevents overselling

---

###  Admin Dashboard APIs

* Total users, orders, products
* Revenue calculation
* Monthly sales analytics
* Top-selling products (with aggregation + lookup)

---

##  System Architecture

```
Client
  ↓
Validation Layer
  ↓
Authentication Middleware
  ↓
Controllers (Business Logic)
  ↓
Database (MongoDB with Transactions)
  ↓
Error Handling Middleware
```

---

##  Security Features

* Helmet for secure HTTP headers
* Rate limiting to prevent abuse
* Input validation using Joi
* JWT authentication
* Protected routes with role-based access

---

##  Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret

CLIENT_URL=http://localhost:5173
```

---

##  Run Locally

```bash
npm install
npm run dev
```

---

##  Deployment

The backend is deployed on Render and connected to MongoDB Atlas for production usage.

---

##  API Testing

You can test APIs using Postman.

Example endpoints:

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
POST   /api/products (admin)

POST   /api/cart
GET    /api/cart

POST   /api/payment/create-order
POST   /api/payment/verify

GET    /api/admin/stats
```

---

##  Key Concepts Implemented

* Transaction handling with MongoDB sessions
* Inventory locking to prevent overselling
* Secure payment verification flow
* Aggregation pipelines for analytics
* Separation of concerns (MVC structure)
* Production-grade middleware architecture

---

##  Future Improvements

* Frontend integration (React + Tailwind)
* Email notifications
* Coupon & discount system
* Advanced logging system

---

##  Author

**Chandra Subhashini Thakran**

---

##  Final Note

This backend is not just a CRUD project. It is built with a focus on **real-world system design, data consistency, and production readiness**.
