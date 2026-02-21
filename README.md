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

- **Java 17** + **Spring Boot 3.2.5** + **Spring Cloud 2023.0.1**
- **Spring Cloud Netflix Eureka** for service discovery
- **Spring Cloud Gateway** for API routing
- **Spring Security + JWT** for authentication and authorization
- **Spring Data JPA** with H2 (dev) / MySQL (prod)

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

### Build
```bash
mvn clean install
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