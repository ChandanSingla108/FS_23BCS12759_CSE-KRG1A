# 🧠 ProjectManagementApp

A full-stack **Project Management Application** built with **Spring Boot (Java)** and **React (Vite)**.  
It enables user registration, authentication, and project management features with a scalable backend and responsive frontend.

---

## 📋 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Pre-requisites](#-pre-requisites)
3. [Quick Start (Development Setup)](#-quick-start-development-setup)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [API Documentation](#-api-documentation)
5. [Configuration & Environment Variables](#-configuration--environment-variables)
6. [Security Notes](#-security-notes)
7. [Development Notes](#-development-notes)
8. [Troubleshooting](#-troubleshooting)
9. [Tests](#-tests)
10. [Deployment Guide](#-deployment-guide)
11. [Contributing](#-contributing)
12. [License & Contact](#-license--contact)

---

## 🧩 Tech Stack

**Backend:**
- Java 17  
- Spring Boot 3.5.7  
- Spring Data JPA  
- Spring Security (starter, open config for dev)  
- Microsoft SQL Server (via JDBC Driver)  
- Maven  

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS

**Database:**
- Microsoft SQL Server  
  (Configurable — can switch to H2 for quick testing)

**Tools:**
- VS Code or IntelliJ IDEA  
- Postman / curl for testing  
- Git & GitHub for version control  

---

## ⚙️ Pre-requisites

Before starting, ensure you have:

| Tool | Version | Notes |
|------|----------|-------|
| **Node.js** | ≥ 18.x | For frontend (Vite) |
| **npm** | ≥ 9.x | For dependency management |
| **Java** | 17 | Required for Spring Boot |
| **Maven** | ≥ 3.8 | To build and run backend |
| **SQL Server** | 2019+ | Database engine |

🧠 **Optional (Quick Start)**: Use **H2 Database** for temporary local development.

---

## 🚀 Quick Start (Development Setup)

### 🧱 Backend Setup

1. **Navigate to the backend folder**
   ```bash
   cd backend
Configure database connection
Update the application.properties file:


spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ProjectManagementDB;encrypt=false
spring.datasource.username=sa
spring.datasource.password=Madhav@2017
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
⚠️ Security Warning:
Do not commit credentials (like the above password) in production.
Move them to environment variables or a .env file.

Run the backend


mvn spring-boot:run
✅ App starts at: http://localhost:8080

(Optional) Use H2 Database instead of SQL Server

properties

spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
Visit http://localhost:8080/h2-console.

💻 Frontend Setup
Navigate to frontend folder


cd frontend
Install dependencies


npm install
Start development server


npm run dev
✅ Runs on: http://localhost:5173

📡 API Documentation
Base URL:
http://localhost:8080/api/users

🟢 POST /api/users/add — Register User
Registers a new user.

Request Body (JSON):

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password1!",
  "role": "TEAM_MEMBER"
}
Responses:

201 Created


{
  "success": true,
  "message": "User registered successfully!",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "TEAM_MEMBER" }
}
409 Conflict


{ "success": false, "message": "User already exists!" }
500 Internal Server Error

Example curl:


curl -X POST http://localhost:8080/api/users/add \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com","password":"Password1!","role":"TEAM_MEMBER"}'
🟡 POST /api/users/login — Login User
Request Body:


{
  "email": "alice@example.com",
  "password": "Password1!"
}
Responses:

200 OK


{
  "success": true,
  "message": "Login successful",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "TEAM_MEMBER" }
}
401 Unauthorized


{ "success": false, "message": "Invalid credentials" }
404 Not Found


{ "success": false, "message": "User not found" }
Example curl:


curl -X POST http://localhost:8080/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com","password":"Password1!"}'
🔵 GET /api/users/all — Get All Users
Response:


[
  { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "TEAM_MEMBER" },
  { "id": 2, "name": "Bob", "email": "bob@example.com", "role": "PROJECT_MANAGER" }
]
🔵 GET /api/users/{email} — Get User by Email
Example:
GET /api/users/alice@example.com

Response:


{ "id": 1, "name": "Alice", "email": "alice@example.com", "role": "TEAM_MEMBER" }
Status Codes:

200 OK — Found

404 Not Found — User not found

⚙️ Configuration & Environment Variables
🔧 application.properties (Backend)
Property	Description
spring.datasource.url	Database connection string
spring.datasource.username	DB username
spring.datasource.password	DB password
spring.jpa.hibernate.ddl-auto	Schema generation strategy
server.port	Backend port (default: 8080)

🧠 For production, externalize credentials via application-prod.properties or environment variables.

🌍 CORS Configuration
@CrossOrigin(origins = "http://localhost:5173")
Allows frontend (Vite) to call backend APIs during development.

🔐 Security Notes
Currently, SecurityConfig disables CSRF and allows all requests (for dev ease).

⚠️ Not secure for production.

✅ To Secure It:
Enable CSRF protection.

Hash passwords using BCryptPasswordEncoder.

Implement JWT-based authentication (stateless sessions).

Restrict endpoints based on roles.

Use HTTPS and environment-based secret keys.

🧑‍💻 Development Notes
🗂️ Folder Structure
Backend


backend/
 ├── src/main/java/com/projectmanagementapp/backend/
 │   ├── controller/ (UserController.java)
 │   ├── model/ (User.java)
 │   ├── repository/ (UserRepository.java)
 │   ├── service/ (UserService.java)
 │   └── BackendApplication.java
 └── src/main/resources/application.properties
Frontend


frontend/
 ├── src/
 │   ├── pages/
 │   │   ├── Login.jsx
 │   │   └── Register.jsx
 │   ├── services/api.js
 │   ├── main.jsx
 │   └── App.jsx
 └── package.json
🧩 Adding New Functionality
Backend: Add new controllers under controller/ and services under service/.

Frontend: Create new React components in /src/pages/ and define routes in App.jsx.

🧯 Troubleshooting
Issue	Possible Fix
❌ Cannot connect to SQL Server	Check connection string, ensure SQL Server is running, port 1433 open.
⚠️ CORS error in frontend	Ensure @CrossOrigin(origins = "http://localhost:5173") is set.
🧩 HTTP 500 Internal Server Error	Check backend logs and enable spring.jpa.show-sql=true.
🔑 Login always fails	Passwords are stored as plain text — use BCrypt hashing to secure.

🧪 Tests
Backend:
Run tests with:


mvn test
Spring Boot test dependencies are preconfigured.

Frontend:
No unit tests yet. You can add Jest or Vitest later.

🚀 Deployment Guide
Backend:
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
Frontend:
npm run build
Then deploy the /dist folder using:

Nginx

Vercel

Netlify
or serve via Spring Boot static resources.

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature-name)

Commit changes (git commit -m 'Add new feature')

Push to branch (git push origin feature-name)

Open a Pull Request 🚀

📜 License & Contact
This project is licensed under the MIT License.
For any inquiries or collaboration requests:

Developer: Chandan Singla
📧 Email: chandansingl411@gmail.com
🌐 GitHub: https://github.com/ChandanSingla108



🌱 Next Steps (Future Improvements)
✅ Add JWT Authentication and Role-Based Access Control.

✅ Integrate BCrypt password encryption.

✅ Add CI/CD workflow via GitHub Actions.

✅ Enhance frontend validation and error handling.

✅ Implement Docker Compose for containerized deployment.

“Build smart, collaborate efficiently, and scale seamlessly — that’s the power of ProjectManagementApp.” ✨

### 🖼️ Adding Screenshots
![manager dashboard screenshot](./screenshots/Screenshot1.png)
![projects screenshot](./screenshots/Screenshot2.png)
![manage teams screenshot](./screenshots/Screenshot3.png)
![chat screenshot](./screenshots/Screenshot4.png)
![register screenshot](./screenshots/Screenshot5.png)
![member dashboard screenshot](./screenshots/Screenshot6.png)
![kanban board screenshot](./screenshots/Screenshot7.png)
