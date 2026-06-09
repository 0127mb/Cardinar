# 🚗 Cardinar - Car Cover Shop API

A modern REST API for managing a car cover shop built with **NestJS** using **Vertical Slice Architecture** and **CQRS Pattern**.

## 🎯 Quick Links

- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Docker](#-docker-deployment)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Architecture

### Key Features

- ✅ **Vertical Slice Architecture**: Organized by features, not layers
- ✅ **CQRS Pattern**: Separate read (queries) and write (commands) operations
- ✅ **Clean Code**: Type-safe with full TypeScript
- ✅ **Database**: PostgreSQL with TypeORM
- ✅ **Authentication**: JWT + Passport.js
- ✅ **File Upload**: Direct image integration
- ✅ **API Documentation**: Swagger/OpenAPI
- ✅ **Testing**: Unit & E2E with test database
- ✅ **Docker Ready**: Complete Docker setup

### Tech Stack

| Technology | Purpose |
|-----------|---------|
| NestJS 11 | Backend framework |
| TypeORM | Database ORM |
| PostgreSQL | Primary database |
| Redis | Caching layer |
| JWT | Authentication |
| Swagger | API docs |
| Jest | Testing framework |
| Docker | Containerization |

## 🚀 Quick Start

### Prerequisites

- Node.js v20+
- pnpm (or npm)
- Docker & Docker Compose

### 1. Installation

```bash
# Clone repository
cd car-cover-shop

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

### 2. Start with Docker

```bash
# Start PostgreSQL, test DB, and Redis
docker-compose up -d

# Check services are running
docker-compose ps
```

### 3. Run Application

```bash
# Development mode (with watch)
pnpm start:dev

# The app will be available at:
# API: http://localhost:3000/api
# Docs: http://localhost:3000/api/docs
# Health: http://localhost:3000/health
```

## 📊 Project Structure

```
src/
├── features/                    # Vertical slices
│   ├── auth/                   # Authentication
│   │   ├── commands/          # Write operations
│   │   ├── controller/        # HTTP endpoints
│   │   ├── dto/               # Request/Response
│   │   └── auth.module.ts
│   │
│   ├── products/              # Products feature
│   ├── orders/                # Orders feature
│   ├── colors/                # Color management
│   ├── materials/             # Material management
│   ├── branches/              # Branch locations
│   └── ... (other features)
│
├── shared/
│   ├── entities/              # TypeORM entities
│   ├── enums/                 # Application enums
│   ├── guards/                # Auth guards
│   ├── decorators/            # Custom decorators
│   ├── database/              # DB config
│   └── mail/                  # Email service
│
└── main.ts                    # Entry point
```

## 📋 API Endpoints Overview

### Authentication

```bash
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login
POST   /api/auth/verify-otp       # Verify OTP
```

### Products

```bash
GET    /api/products              # List all products
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Orders

```bash
POST   /api/orders                # Create order (authenticated)
GET    /api/orders                # List orders (admin)
GET    /api/orders/:id            # Get order details
PUT    /api/orders/:id/status     # Update status (admin)
DELETE /api/orders/:id            # Delete order (admin)
```

### Master Data

```bash
GET    /api/colors                # Get all colors
GET    /api/materials             # Get all materials
GET    /api/categories            # Get all categories
GET    /api/car-makes             # Get all car makes
GET    /api/car-models            # Get all car models
GET    /api/branches              # Get all branches
```

## 🔐 Authentication

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phoneNumber": "+998901234567",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'

# Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "user": { ... }
# }
```

### Using Token

```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📋 Detailed API Examples

### Create Product (with image)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Premium Car Cover" \
  -F "price=299.99" \
  -F "categoryId=1" \
  -F "description=Premium quality car cover" \
  -F "file=@product.jpg"
```

### Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": 1,
    "fullName": "John Doe",
    "phoneNumber": "+998901234567",
    "email": "john@example.com",
    "delivery": true,
    "paymentMethod": "cash",
    "items": [
      {
        "productId": 1,
        "articulId": 1,
        "quantity": 2
      }
    ]
  }'
```

### Update Order Status

```bash
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

## 🧪 Testing

### Run All Tests

```bash
# Unit tests
pnpm test

# Unit tests with coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Run E2E Tests

```bash
# Make sure test database is ready
docker-compose up postgres_test -d

# Run E2E tests
pnpm test:e2e
```

### E2E Test Features

- ✅ Automatic test database setup
- ✅ Automatic cleanup after tests
- ✅ Transaction rollback support
- ✅ Isolated test environment
- ✅ Full CRUD testing for all endpoints

## 🐳 Docker Deployment

### Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Build Docker Image

```bash
# Build image
docker build -t cardinar:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DB_URL=postgres://... \
  --name cardinar \
  cardinar:latest
```

### Services Included

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Production DB |
| PostgreSQL Test | 5433 | Test DB |
| Redis | 6379 | Cache layer |

## 🔧 Environment Configuration

Create `.env` file:

```bash
# Database
DB_URL=postgres://postgres:123456@localhost:5432/cardinar

# JWT
JWT_SECRET=k9PzR4mN2wX7vL8qT1yB5hG0uS3iF6oE8aC2jD7kV1pM
JWT_EXPIRES_IN=7d

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=your@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development
```

## 📦 Available Scripts

```bash
# Development
pnpm start          # Run app
pnpm start:dev      # Watch mode
pnpm start:debug    # Debug mode

# Build
pnpm build          # Compile TypeScript
pnpm start:prod     # Run compiled app

# Code quality
pnpm lint           # ESLint check
pnpm format         # Format with Prettier

# Testing
pnpm test           # Unit tests
pnpm test:watch     # Watch mode
pnpm test:cov       # Coverage report
pnpm test:e2e       # E2E tests

# Database
pnpm typeorm        # TypeORM CLI
```

## 🚨 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Verify connection
psql -U postgres -h localhost -d cardinar
```

### Port 3000 Already in Use

```bash
# Change port in .env
PORT=3001

# Or kill process
lsof -ti:3000 | xargs kill -9
```

### E2E Tests Timeout

```bash
# Ensure test DB is running
docker-compose up postgres_test -d

# Wait for ready state
sleep 5

# Run tests
pnpm test:e2e
```

### Redis Connection Error

```bash
# Check Redis is running
docker-compose logs redis

# Verify connection
redis-cli ping

# Should respond: PONG
```

### File Upload Not Working

```bash
# Create uploads directory
mkdir -p uploads

# Set correct permissions
chmod 755 uploads

# Ensure Node process can write
```

## 📚 Swagger Documentation

Access interactive API docs:

```
http://localhost:3000/api/docs
```

Features:
- ✅ Try out endpoints
- ✅ View request/response schemas
- ✅ Authentication support
- ✅ Download OpenAPI spec

## 🔒 Security

### Features Implemented

- ✅ JWT Token authentication
- ✅ Password hashing (Argon2)
- ✅ Admin role-based access
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (TypeORM)
- ✅ Rate limiting on OTP
- ✅ Secure error handling

### Best Practices

1. Never commit `.env` file
2. Rotate JWT secret regularly
3. Use HTTPS in production
4. Keep dependencies updated
5. Enable database backups

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `listen EADDRINUSE` | Change PORT in .env or kill process |
| `connection refused` | Start docker-compose services |
| `ENOENT: no such file` | Run `mkdir -p uploads` |
| `jwt malformed` | Ensure token is valid and not expired |
| `Unauthorized` | Include Authorization header with token |

## 🤝 Contributing

1. Create feature branch
2. Follow vertical slice architecture
3. Use CQRS pattern
4. Add tests
5. Update documentation
6. Create pull request

## 📖 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)

## 📄 License

UNLICENSED - All rights reserved

## 🎉 Getting Help

1. Check [Troubleshooting](#-troubleshooting)
2. Review [API Documentation](http://localhost:3000/api/docs)
3. Check application logs: `docker-compose logs app`
4. Contact development team

---

**Built with ❤️ using NestJS, TypeORM, and CQRS Pattern**

Last Updated: 2026-05-22
