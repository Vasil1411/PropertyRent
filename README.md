Markdown
# 🏠 RentProperty REST API (Spring Boot Backend)

A robust, secure, and production-ready RESTful backend service for a Real Estate Rental application. Built with **Spring Boot 3**, **Spring Security**, **JWT Authentication**, and **PostgreSQL**, this project provides comprehensive API endpoints for managing properties (including multipart image uploads), user roles, and secure authentication.

---

## 🚀 Tech Stack

* **Java 25**
* **Spring Boot 3.x**
* **Spring Security** (Stateless Session Management with JWT)
* **Spring Data JPA / Hibernate**
* **PostgreSQL** Database
* **Lombok**
* **API Documentation:** springdoc-openapi (Swagger UI)

---

## ✨ Key Features

* **JWT-based Authentication & Authorization:** Secure login and registration workflow with role-based access control (Admin, Broker, User).
* **Multipart Property Management (CRUD):**
    * Endpoints to create and update properties by accepting a combined payload of **JSON data** (titles, prices, descriptions, etc.) and **image files (`multipart/form-data`)**.
    * Public endpoints for listing and filtering properties by city, deal type, price range, and rooms.
* **CORS Support:** Pre-configured CORS mapping for seamless frontend integration (`localhost:5173`, `localhost:5174`).
* **API Documentation:** Interactive Swagger UI documentation out-of-the-box.

---

## 📡 API Endpoints Overview

### 🔐 Authentication (`/api/user`)
* `POST /api/user/register` - Register a new user
* `POST /api/user/login` - Authenticate and receive a JWT token

### 🏡 Properties (`/api/properties`)
* `GET /api/properties` - Get all available property listings (Public)
* `GET /api/properties/{id}` - Get details of a specific property (Public)
* `GET /api/properties/search` - Search/filter properties by parameters (Public)
* `POST /api/properties` - Create a new property with **JSON data + image files** (`multipart/form-data`, requires JWT)
* `PUT /api/properties/{id}` - Update an existing property with JSON data + optional new images (`multipart/form-data`, requires JWT)
* `DELETE /api/properties/{id}` - Delete a property (Authenticated / requires JWT)

---

## 🛠️ Getting Started & Installation

### Prerequisites
* Java JDK 25
* Maven
* PostgreSQL Database running locally or remotely

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/your-repo-name.git](https://github.com/YOUR_USERNAME/your-repo-name.git)
cd your-repo-name
2. Configure PostgreSQL Database
Update your src/main/resources/application.properties with your PostgreSQL credentials:

Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/property_rent_db
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
3. Run the Application
Bash
mvn spring-boot:run
The server will start on port 8080.

📖 API Documentation (Swagger UI)
Once the application is running, you can explore, test endpoints, and try out the multipart file uploads directly through the interactive Swagger documentation:
👉 http://localhost:8080/swagger-ui/index.html

📄 License
This project is open-source and available under the MIT License.