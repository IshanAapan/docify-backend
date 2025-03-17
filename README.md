# Docify Backend - Doctor Appointment System 🏥  

## Overview  
This is the **backend API** for **Docify**, a doctor appointment system built with **Node.js, Express.js, and MongoDB**. It handles user authentication, doctor applications, appointment scheduling, and admin management.  

## Tech Stack  
- **Node.js** - Server-side runtime  
- **Express.js** - Web framework  
- **MongoDB** - NoSQL database  
- **Mongoose** - MongoDB ODM  
- **JWT (JSON Web Token)** - Authentication  
- **bcrypt** - Password hashing  
- **CORS** - Cross-Origin Resource Sharing  

## Features  

### 🔹 Authentication  
- **JWT-based authentication** for secure login  
- **bcrypt** for password encryption  

### 🔹 User Roles & Permissions  
- **Guest** - Can only view doctors  
- **Patient** - Can book appointments & update profile  
- **Doctor** - Can manage appointments once approved  
- **Admin** - Manages users, doctors, and appointments  

### 🔹 Appointment System  
- Patients can **book** appointments  
- Doctors can **approve/reject** appointment requests  
- Admin can **manage** all appointments  

### 🔹 Doctor Application & Approval  
- Users can **apply** to become doctors  
- Admin **reviews & approves/rejects** doctor applications  

## Installation & Setup  

1️⃣ **Clone the repository:**  
git clone https://github.com/your-repo/docify-backend.git
cd docify-backend

2️⃣ Install dependencies:
npm install

3️⃣ Set up environment variables:
Create a .env file in the root directory and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

4️⃣ Start the backend server:
npm start

