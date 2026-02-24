# Agility - Agile Project Management Tool

A Spring Boot microservices-based Agile project management tool supporting Scrum and Kanban methodologies.

## Architecture

The application follows a microservices architecture using Spring Cloud:

| Service | Port | Description |
|---------|------|-------------|
| **Eureka Server** | 8761 | Service registry for service discovery |
| **API Gateway** | 8080 | Single entry point with JWT authentication |
| **User Service** | 8081 | User management, roles, developer profiles |
| **Project Service** | 8082 | Project and Sprint management |
| **Task Service** | 8083 | Task and Backlog management |
| **Time Tracking Service** | 8084 | Time logging and capacity calculations |
| **Reporting Service** | 8085 | Dashboards, metrics, and reports |

## Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2.5** + **Spring Cloud 2023.0.1**
- **Spring Cloud Netflix Eureka** for service discovery
- **Spring Cloud Gateway** for API routing
- **Spring Security + JWT** for authentication and authorization
- **Spring Data JPA** with H2 (dev) / MySQL (prod)

### Frontend
- **React 19** with **Vite** for fast development
- **React Router** for client-side routing
- **Axios** for API communication with JWT interceptors

## User Roles

- **Administrateur** - System administration
- **Product Owner** - Product backlog management
- **Scrum Master** - Sprint management
- **Développeur** - Development and time tracking
- **Manager** - Dashboard and reporting

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+

### Build
```bash
# Backend
mvn clean install

# Frontend
cd frontend && npm install && npm run build
```

### Run (in order)
```bash
# 1. Start Eureka Server
cd eureka-server && mvn spring-boot:run

# 2. Start API Gateway
cd api-gateway && mvn spring-boot:run

# 3. Start Business Services (any order)
cd user-service && mvn spring-boot:run
cd project-service && mvn spring-boot:run
cd task-service && mvn spring-boot:run
cd timetracking-service && mvn spring-boot:run
cd reporting-service && mvn spring-boot:run

# 4. Start Frontend (dev mode on port 3000)
cd frontend && npm run dev
```

### API Endpoints (via Gateway at port 8080)

- `POST /api/users/auth/register` - Register a new user
- `POST /api/users/auth/login` - Login and get JWT token
- `/api/users/**` - User management
- `/api/projects/**` - Project CRUD
- `/api/sprints/**` - Sprint management
- `/api/tasks/**` - Task management
- `/api/backlog/**` - Backlog management
- `/api/timetracking/**` - Time entry logging
- `/api/reports/**` - Reports and dashboards

## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Authentication with username/password |
| **Register** | `/register` | New user registration with role selection |
| **Dashboard** | `/` | Overview with project/task/sprint metrics |
| **Projects** | `/projects` | Project CRUD with methodology selection |
| **Sprints** | `/projects/:id/sprints` | Sprint management per project |
| **Task Board** | `/projects/:id/board`, `/tasks` | Kanban board with drag-and-drop |
| **Time Tracking** | `/timetracking` | Timesheet entry with daily/total summaries |
| **Reports** | `/reports` | Sprint progress, burndown, velocity, workload |

## Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Service URLs (Docker)

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8080 |
| **Eureka Dashboard** | http://localhost:8761 |
| **User Service** | http://localhost:8081 |
| **Project Service** | http://localhost:8082 |
| **Task Service** | http://localhost:8083 |
| **Time Tracking Service** | http://localhost:8084 |
| **Reporting Service** | http://localhost:8085 |

### Build Individual Images

```bash
# Build a specific service
docker build -t agility/eureka-server -f eureka-server/Dockerfile .
docker build -t agility/api-gateway -f api-gateway/Dockerfile .
docker build -t agility/user-service -f user-service/Dockerfile .
docker build -t agility/project-service -f project-service/Dockerfile .
docker build -t agility/task-service -f task-service/Dockerfile .
docker build -t agility/timetracking-service -f timetracking-service/Dockerfile .
docker build -t agility/reporting-service -f reporting-service/Dockerfile .
docker build -t agility/frontend ./frontend
```