# 🚚 Courier SaaS Portal

A modular monorepo for a multi-role courier management system built with:
- ⚙️ Spring Boot (Backend)
- ⚛️ React (Frontend)
- 🐘 PostgreSQL (Database)
- 🐳 Docker + Compose (Local setup)
- 🔐 JWT-based Authentication
- 🧪 Swagger for API testing

---

## 📦 Project Structure

```

courier-saas-portal/
├── backend/         # Spring Boot app
├── frontend/        # React app
├── docker/          # docker-compose.yml and nginx.conf
└── .env             # Environment variables for Docker

````

---

## 🚀 Quick Start: Run Entire Stack with Docker

### ✅ Requirements
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Docker Hub credentials (for pulling prebuilt images) **OR** local build setup

### 📂 1. Clone the Repository
```bash
git clone https://github.com/your-org/courier-saas-portal.git
cd courier-saas-portal
````

### 🧪 2. Set Up `.env`

Create a `.env` file at the root:

```env
POSTGRES_DB=courierdb
POSTGRES_USER=courierdb
POSTGRES_PASSWORD=Courier@123

SPRING_PORT=8080
REACT_PORT=3000
```

### 🐳 3. Run All Services

```bash
cd docker
docker-compose up --build -d
```

Access:

* 🚀 React App: `http://localhost:3000`
* 🔐 Swagger API Docs: `http://localhost:8080/swagger-ui/index.html`
* 🐘 PostgreSQL: exposed on `localhost:5432`

---

## ⚙️ Run Backend Manually (Spring Boot)

### Prerequisites

* JDK 17+
* Maven
* PostgreSQL (or use Docker)

### Commands

```bash
cd backend
cp src/main/resources/application-dev.properties src/main/resources/application.properties
# Update DB credentials if needed

mvn clean spring-boot:run
```

Default backend will run at:
`http://localhost:8080`

---

## 💻 Run Frontend Manually (React)

### Prerequisites

* Node.js 18+
* npm

### Commands

```bash
cd frontend
npm install
npm start
```

Frontend runs at:
`http://localhost:3000`

---
## User Credential with Roles

* ✅ ADMIN
  admin@gmail.com
  Admin@123
* ✅ STAFF
  staff@gmail.com
  Staff@123
* ✅ DELIVERY_PARTNER
  delivery_partner@gmail.com
  Delivery@123
* ✅ CUSTOMER
  customer@gmail.com
  Customer@123


## 🔑 Authentication Info

* ✅ JWT-based login
* ✅ Role-based access control
* ✅ Public APIs: `/api/users/login`, `/api/users/register`
* ✅ Swagger at: `/swagger-ui/index.html`

---

## 🧠 Developer Notes

* Backend uses **Flyway** for DB migration (`src/main/resources/db/migration`)
---

## 🐳 Docker Image Publishing (for contributors)

```bash
# Build and push backend
docker build -t saurabh896/courier-backend:latest ./backend
docker push saurabh896/courier-backend:latest

# Build and push frontend
docker build -t saurabh896/courier-frontend:latest ./frontend
docker push saurabh896/courier-frontend:latest
```

---

## 🙋‍♂️ Need Help?

* Raise an issue on GitHub
