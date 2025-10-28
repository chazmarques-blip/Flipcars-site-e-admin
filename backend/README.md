# FlipCars 2.0 - Backend API

**Phase 1: Backend Core Development**

Complete NestJS backend with AI-powered lead qualification system for auto body shop management.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.development

# Start Docker services (PostgreSQL, Redis, Mailhog, MinIO)
docker-compose up -d

# Run database migrations
npm run migration:run

# Seed initial data
npm run seed

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication (JWT, RBAC)
│   │   ├── users/           # User management
│   │   ├── leads/           # Lead/CRM management
│   │   ├── customers/       # Customer management
│   │   ├── ai/              # AI integration (OpenAI)
│   │   ├── storage/         # File storage (AWS S3)
│   │   ├── cms/             # Content management
│   │   ├── claims/          # Claim tracking
│   │   ├── communications/  # Email/SMS/WhatsApp
│   │   ├── analytics/       # Analytics & reporting
│   │   └── customer-portal/ # Customer self-service
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards (JWT, RBAC)
│   │   ├── interceptors/    # Request interceptors
│   │   ├── pipes/           # Validation pipes
│   │   └── dto/             # Shared DTOs
│   ├── config/              # Configuration
│   ├── database/            # Database layer
│   │   ├── migrations/      # TypeORM migrations
│   │   ├── seeds/           # Seed data scripts
│   │   └── entities/        # Database entities
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── test/                     # E2E tests
├── docker-compose.yml       # Docker services
├── .env.development         # Development environment
└── package.json
```

---

## 🛠️ Available Scripts

### Development
```bash
npm run start:dev    # Start with hot-reload
npm run start:debug  # Start with debugger
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Building
```bash
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Testing
```bash
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
npm run test:e2e     # Run end-to-end tests
```

### Database
```bash
npm run migration:generate -- -n MigrationName  # Generate migration
npm run migration:run                           # Run migrations
npm run migration:revert                        # Revert last migration
npm run seed                                    # Run seed scripts
```

---

## 🐳 Docker Services

Start all services:
```bash
docker-compose up -d
```

### Services & Ports
- **PostgreSQL**: `localhost:5432` (user: `flipcars`, pass: `flipcars123`)
- **pgAdmin**: `http://localhost:5050` (email: `admin@flipcars.us`, pass: `admin123`)
- **Redis**: `localhost:6379`
- **Mailhog**: `http://localhost:8025` (SMTP UI for email testing)
- **MinIO**: `http://localhost:9001` (S3-compatible storage, user: `minioadmin`, pass: `minioadmin123`)

Stop all services:
```bash
docker-compose down
```

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Lead Management
```
POST   /api/leads              # Create new lead
GET    /api/leads              # List leads (with filters)
GET    /api/leads/:id          # Get lead details
PUT    /api/leads/:id          # Update lead
DELETE /api/leads/:id          # Delete lead
PATCH  /api/leads/:id/status   # Update status
POST   /api/leads/:id/assign   # Assign to agent
```

### AI Integration
```
POST /api/ai/qualify           # Qualify lead (0-100 score)
POST /api/ai/chat              # AI chat conversation
GET  /api/ai/knowledge-base    # List KB entries
POST /api/ai/knowledge-base    # Add KB entry
POST /api/ai/feedback          # Submit AI feedback
```

### User Management
```
GET    /api/users              # List users
GET    /api/users/:id          # Get user
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
GET    /api/users/me           # Current user profile
```

Full API documentation: `/api/docs` (Swagger UI - coming in Week 4)

---

## 🔐 Authentication & Authorization

### JWT Authentication
- Access token: 15 minutes expiration
- Refresh token: 7 days expiration
- RS256 algorithm

### Roles & Permissions (RBAC)
1. **super_admin**: Full system access
2. **admin**: Manage users, leads, content
3. **agent**: Manage assigned leads, communicate with customers
4. **customer**: View own leads and claims
5. **read_only**: View-only access

### Protected Routes
Add `@UseGuards(JwtAuthGuard, RolesGuard)` decorator:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'agent')
@Get('leads')
findAll() { ... }
```

---

## 🤖 AI Integration

### OpenAI GPT-4 Configuration
Set your API key in `.env.development`:
```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### Lead Qualification System
- **Scoring**: 0-100 based on multiple factors
- **Priority Levels**:
  - LOW (0-40): Self-service or schedule callback
  - MEDIUM (41-70): Schedule appointment
  - HIGH (71-100): Immediate human contact

### Escalation Triggers
1. Explicit request: "I want to speak to a person"
2. Low confidence: AI confidence < 70%
3. Frustration detected: Sentiment analysis
4. High-value lead: Score >= 90

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:cov
```

Target: >80% overall coverage

### E2E Tests
```bash
npm run test:e2e
```

---

## 📊 Database Schema

### Key Tables
- `users`: User accounts with roles
- `customers`: Customer information
- `leads`: Lead records with AI scoring
- `vehicles`: Vehicle information
- `claims`: Repair claims
- `claim_timeline`: Claim status history
- `ai_conversations`: AI chat history
- `ai_feedback`: AI response quality feedback
- `ai_knowledge_base`: AI knowledge entries
- `messages`: Internal messaging
- `communications`: Email/SMS logs

Full schema: `/docs/database/DATABASE_SCHEMA.md`

---

## 🌍 Internationalization (i18n)

Supported languages:
- English (en)
- Spanish (es)
- Portuguese (pt)

Set `Accept-Language` header in requests:
```
Accept-Language: es
```

---

## 🔒 Security Features

- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT with RS256 algorithm
- ✅ Rate limiting (100 requests/minute per IP)
- ✅ CORS enabled
- ✅ Helmet security headers
- ✅ XSS protection
- ✅ Input validation with class-validator
- ✅ SQL injection protection (TypeORM parameterized queries)

---

## 📝 Environment Variables

See `.env.example` for all available configuration options.

Critical variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `OPENAI_API_KEY`: OpenAI API key
- `AWS_ACCESS_KEY_ID`: AWS credentials (for S3)

---

## 🐛 Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres
```

### Port already in use
```bash
# Change PORT in .env.development
PORT=3002
```

### OpenAI API errors
- Verify your API key in `.env.development`
- Check rate limits on your OpenAI account
- Ensure sufficient credits

---

## 📚 Documentation

- **API Specification**: `/docs/api/API_SPECIFICATION.md`
- **Database Schema**: `/docs/database/DATABASE_SCHEMA.md`
- **AI Flows**: `/docs/ai-flows/AI_INTERACTION_FLOWS.md`
- **Phase 1 Plan**: `/docs/phase1/PHASE1_KICKOFF.md`

---

## 🤝 Contributing

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add JWT refresh token endpoint
fix(leads): correct AI scoring calculation
docs(readme): update installation instructions
```

### Branch Naming
- `feature/module-name-description`
- `fix/bug-description`
- `docs/documentation-update`

---

## 📞 Support

For issues or questions, contact the development team.

---

## 📄 License

PROPRIETARY - All rights reserved by FlipCars

---

**Phase**: Phase 1 - Backend Core Development (Week 1/4)  
**Status**: 🟢 In Progress  
**Last Updated**: 2025-10-28
