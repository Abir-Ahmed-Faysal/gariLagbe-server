🚗 Vehicle Rental System — Backend API

A robust backend service for seamless vehicle rental management with secure authentication, role-based access, and automated booking workflow.

📌 Features
Module	Capabilities
User Management	Registration, login & role-based access (Admin / Customer)
Vehicle Management	CRUD operations with status tracking
Booking Management	Pricing calculation, availability validation, booking lifecycle
Security	JWT authentication, password hashing
🏗️ Tech Stack

Node.js + TypeScript

Express.js

PostgreSQL

bcrypt for password hashing

jsonwebtoken for secure access

📁 Project Structure

To ensure clean separation of concerns, the project follows a modular feature-based architecture:

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


✔ Fully layered: controllers → services → DB queries
✔ Independent modules for scalability and maintenance

🧩 Database Schema
🧍 Users Table
Column	Details
id	PK – Auto-generated
name	Required
email	Required, unique, lowercase
password	Hashed using bcrypt
phone	Required
role	`'admin'
🚗 Vehicles Table
Column	Details
id	PK
vehicle_name	Required
type	`'car'
registration_number	Unique
daily_rent_price	Positive number
availability_status	`'available'
📅 Bookings Table
Column	Details
id	PK
customer_id	FK → Users
vehicle_id	FK → Vehicles
rent_start_date	Required
rent_end_date	Must be later than start date
total_price	Calculated
status	`'active'
🔐 Roles & Permissions
Feature	Admin	Customer
Sign Up / Sign In	✔	✔
View Vehicles	✔	✔
Create Booking	✔	✔
Manage All Users	✔	✘
Manage All Bookings	✔	✘
Update Own Profile	✔	✔
🔑 Authentication Flow

1️⃣ User login → JWT Token issued
2️⃣ Client sends token in Authorization Header

Authorization: Bearer <token>


3️⃣ Token validated → User role checked
4️⃣ Grant access if authorized

🌐 API Endpoints

📌 All endpoints strictly follow response & validation rules defined in API Reference

Auth
Method	Endpoint	Access
POST	/api/v1/auth/signup	Public
POST	/api/v1/auth/signin	Public
Vehicles
Method	Endpoint	Access
POST	/api/v1/vehicles	Admin
GET	/api/v1/vehicles	Public
GET	/api/v1/vehicles/:vehicleId	Public
PUT	/api/v1/vehicles/:vehicleId	Admin
DELETE	/api/v1/vehicles/:vehicleId	Admin
Users
Method	Endpoint	Access
GET	/api/v1/users	Admin
PUT	/api/v1/users/:userId	Admin or Own
DELETE	/api/v1/users/:userId	Admin
Bookings
Method	Endpoint	Access
POST	/api/v1/bookings	Customer or Admin
GET	/api/v1/bookings	Role-based
PUT	/api/v1/bookings/:bookingId	Role-based
🧠 Business Rules Summary
Scenario	System Behavior
Booking created	Vehicle → "booked"
Booking cancelled	Vehicle → "available"
Booking returned	Vehicle → "available"
Past end date	Auto return logic updates status
Active bookings exist	Cannot delete vehicle/user
📚 Documentation Files
File	Purpose
README.md	Core project overview (this file)
API_REFERENCE.md	Detailed request + response rules
SUBMISSION_GUIDE.md	Submission instructions

➡️ Full API details are provided in:
📌 API_REFERENCE.md (already formatted & included)

⚡ Response Format Standards
✔ Success
{
  "success": true,
  "message": "Operation message",
  "data": {}
}

❌ Error
{
  "success": false,
  "message": "Error reason",
  "errors": {}
}