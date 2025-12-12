# 🚗 GariBhara — Vehicle Rental System (Backend API)

A production-grade, modular Vehicle Rental System built using **Node.js**, **TypeScript**, **Express.js**, and **PostgreSQL**. Includes robust authentication, layered architecture, and scalable modules for real-world production use.

🔗 **GitHub Repository:** [https://github.com/Abir-Ahmed-Faysal/gariLagbe-server](https://github.com/Abir-Ahmed-Faysal/gariLagbe-server)
🔗 **Live Deployment:** [https://gari-bhara-server.vercel.app/](https://gari-bhara-server.vercel.app/)

---

## 🌟 Features

| Module                 | Capabilities                                             |
| ---------------------- | -------------------------------------------------------- |
| **User Management**    | Signup, Login, Profile Update, Admin Controls            |
| **Vehicle Management** | CRUD Operations, Availability Status, Validations        |
| **Booking Management** | Price Calculation, Booking Lifecycle, Availability Check |
| **Security**           | JWT Auth, Password Hashing, Role-Based Access            |

---

## 🏗️ Tech Stack

* **Node.js + TypeScript**
* **Express.js**
* **PostgreSQL**
* **bcrypt** (password hashing)
* **jsonwebtoken** (JWT authentication)

---

## 📁 Project Structure

```
src/
│── modules/
│   ├── auth/
│   ├── users/
│   ├── vehicles/
│   └── bookings/
│
│── middleware/
│── utilities/
│── routes/
│── server.ts
│── app.ts
```

✔ Layered architecture (Controllers → Services → DB Layer)
✔ Feature-based module separation
✔ Highly scalable and maintainable

---

## 🧩 Database Schema

### 👤 Users Table

| Column   | Details               |
| -------- | --------------------- |
| id       | Primary Key           |
| name     | Required              |
| email    | Unique, lowercase     |
| password | Bcrypted              |
| phone    | Required              |
| role     | `admin` or `customer` |

---

### 🚗 Vehicles Table

| Column              | Details               |
| ------------------- | --------------------- |
| id                  | Primary Key           |
| vehicle_name        | Required              |
| type                | `car`, `bike`, etc.   |
| registration_number | Unique                |
| daily_rent_price    | Positive Number       |
| availability_status | `available`, `booked` |

---

### 📅 Bookings Table

| Column          | Details                            |
| --------------- | ---------------------------------- |
| id              | Primary Key                        |
| customer_id     | FK → Users                         |
| vehicle_id      | FK → Vehicles                      |
| rent_start_date | Required                           |
| rent_end_date   | End > Start                        |
| total_price     | Calculated                         |
| status          | `active`, `completed`, `cancelled` |

---

## 🔐 Roles & Permissions

| Feature             | Admin | Customer |
| ------------------- | ----- | -------- |
| Sign Up / Login     | ✔     | ✔        |
| View Vehicles       | ✔     | ✔        |
| Create Booking      | ✔     | ✔        |
| Manage All Users    | ✔     | ✘        |
| Manage All Bookings | ✔     | ✘        |
| Update Own Profile  | ✔     | ✔        |

---

## 🔑 Authentication Flow

1. User logs in → JWT token issued
2. Client sends Authorization Header:

   ```
   Authorization: Bearer <token>
   ```
3. Middleware validates token
4. Role-based access granted

---

## 🌐 API Endpoints

### 🔐 Auth

| Method | Endpoint              | Access |
| ------ | --------------------- | ------ |
| POST   | `/api/v1/auth/signup` | Public |
| POST   | `/api/v1/auth/signin` | Public |

---

### 🚗 Vehicles

| Method | Endpoint                      | Access |
| ------ | ----------------------------- | ------ |
| POST   | `/api/v1/vehicles`            | Admin  |
| GET    | `/api/v1/vehicles`            | Public |
| GET    | `/api/v1/vehicles/:vehicleId` | Public |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin  |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin  |

---

### 👤 Users

| Method | Endpoint                | Access       |
| ------ | ----------------------- | ------------ |
| GET    | `/api/v1/users`         | Admin        |
| PUT    | `/api/v1/users/:userId` | Admin or Own |
| DELETE | `/api/v1/users/:userId` | Admin        |

---

### 📅 Bookings

| Method | Endpoint                      | Access         |
| ------ | ----------------------------- | -------------- |
| POST   | `/api/v1/bookings`            | Customer/Admin |
| GET    | `/api/v1/bookings`            | Role-based     |
| PUT    | `/api/v1/bookings/:bookingId` | Role-based     |

---

## 🧠 Business Logic Summary

| Scenario                    | System Behavior       |
| --------------------------- | --------------------- |
| Booking created             | Vehicle → `booked`    |
| Booking cancelled           | Vehicle → `available` |
| Booking returned            | Vehicle → `available` |
| End date passed             | Auto return logic     |
| User has active bookings    | Cannot delete user    |
| Vehicle has active bookings | Cannot delete vehicle |

---

## 📚 Documentation Files

| File                  | Purpose                   |
| --------------------- | ------------------------- |
| `README.md`           | Project overview          |
| `API_REFERENCE.md`    | Endpoint rules + examples |
| `SUBMISSION_GUIDE.md` | Reviewer instructions     |

---

## ⚡ Response Format

### ✔ Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### ❌ Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

