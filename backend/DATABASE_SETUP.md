# Database Setup Guide

## Prerequisites

- Docker & Docker Compose installed
- Node.js 20.x LTS
- PostgreSQL 15+ (or use Docker)

---

## Quick Start

### 1. Start Database Services

```bash
# Start all Docker services (PostgreSQL, Redis, pgAdmin, Mailhog, MinIO)
docker-compose up -d

# Check services are running
docker-compose ps
```

Services will be available at:
- **PostgreSQL**: `localhost:5432`
  - Database: `flipcars_dev`
  - Username: `flipcars`
  - Password: `flipcars123`
- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@flipcars.us`
  - Password: `admin123`

### 2. Run Database Migrations

```bash
# Run all pending migrations
npm run migration:run

# Verify migrations applied
npm run typeorm migration:show
```

### 3. Seed Test Data

```bash
# Run seed scripts to populate test data
npm run seed
```

---

## Database Schema Overview

### 20 Tables Created

#### Authentication & Authorization
- `roles` - User roles (super_admin, admin, agent, customer, read_only)
- `permissions` - Fine-grained permissions
- `role_permissions` - Many-to-many relationship
- `users` - User accounts with password hashing
- `user_roles` - Many-to-many relationship

#### CRM & Lead Management
- `customers` - Customer information
- `leads` - Lead records with AI scoring (0-100)
- `vehicles` - Vehicle information

#### Claims Management
- `claims` - Repair claims
- `claim_timeline` - Status history and events
- `claim_documents` - Associated documents

#### AI Integration
- `ai_conversations` - Chat history with AI agents
- `ai_feedback` - Quality feedback on AI responses
- `ai_knowledge_base` - Knowledge base for AI responses

#### Communications
- `messages` - Internal messaging system
- `communications` - Email/SMS/WhatsApp logs

#### Content Management
- `pages` - CMS pages (Home, About, Services, etc.)
- `blog_posts` - Blog content
- `gallery_items` - Gallery photos (before/after, facilities)

#### File Management
- `file_uploads` - Centralized file storage tracking

---

## Entity Relationships

### Key Foreign Keys

```
users
  ├─> user_roles (many-to-many with roles)
  └─> assigned_leads (one-to-many)

customers
  ├─> user (one-to-one optional)
  ├─> leads (one-to-many)
  ├─> vehicles (one-to-many)
  └─> claims (one-to-many)

leads
  ├─> customer (many-to-one)
  ├─> vehicle (many-to-one optional)
  ├─> assigned_human_agent (many-to-one users)
  └─> ai_conversations (one-to-many)

claims
  ├─> customer (many-to-one)
  ├─> vehicle (many-to-one)
  ├─> assigned_agent (many-to-one users)
  ├─> timeline (one-to-many)
  └─> documents (one-to-many)
```

---

## Indexes Created

### Performance Indexes

- **users**: `idx_user_email`, `idx_user_language`
- **customers**: `idx_customer_email`
- **leads**: 
  - `idx_lead_customer`
  - `idx_lead_reference`
  - `idx_lead_ai_score`
  - `idx_lead_assigned_agent`
  - `idx_lead_status`
  - `idx_lead_created_at`
- **claims**: `idx_claim_number`, `idx_claim_customer`, `idx_claim_status`, `idx_claim_created_at`
- **ai_conversations**: `idx_conversation_lead`, `idx_conversation_created_at`
- **communications**: `idx_comm_customer`, `idx_comm_lead`, `idx_comm_type`, `idx_comm_status`

### Full-Text Search Indexes
(To be added in future migrations)
- leads.name
- leads.accident_description
- ai_knowledge_base.content

---

## Migration Commands

### Generate New Migration
```bash
# Auto-generate migration from entity changes
npm run migration:generate -- -n MigrationName

# Or create empty migration
npx typeorm migration:create src/database/migrations/MigrationName
```

### Run Migrations
```bash
# Run all pending migrations
npm run migration:run

# Show migration status
npm run typeorm migration:show
```

### Revert Migrations
```bash
# Revert the last executed migration
npm run migration:revert
```

---

## Seed Data

### Run Seeds
```bash
npm run seed
```

### Seed Data Includes

1. **5 Users** (one per role)
   - Super Admin: `superadmin@flipcars.us` / `SuperAdmin123!`
   - Admin: `admin@flipcars.us` / `Admin123!`
   - Agent: `agent@flipcars.us` / `Agent123!`
   - Customer: `customer@flipcars.us` / `Customer123!`
   - Read-Only: `readonly@flipcars.us` / `ReadOnly123!`

2. **20 Sample Leads** with varying AI scores (0-100)
   - 5 LOW priority (score 0-40)
   - 10 MEDIUM priority (score 41-70)
   - 5 HIGH priority (score 71-100)

3. **10 Knowledge Base Entries** for AI
   - FAQs
   - Process descriptions
   - Policy information

4. **Sample CMS Pages**
   - Home
   - About Us
   - Services
   - FAQ
   - Contact

5. **10 Gallery Items**
   - Before/After photos
   - Facility photos
   - Completed work

---

## Database Administration

### Using pgAdmin

1. Open pgAdmin: `http://localhost:5050`
2. Login with credentials (see above)
3. Add New Server:
   - **Name**: FlipCars Dev
   - **Host**: postgres (Docker service name) or localhost
   - **Port**: 5432
   - **Database**: flipcars_dev
   - **Username**: flipcars
   - **Password**: flipcars123

### Using psql CLI

```bash
# Connect to database via Docker
docker-compose exec postgres psql -U flipcars -d flipcars_dev

# Common queries
\dt                    # List all tables
\d+ users              # Describe users table
\di                    # List all indexes
SELECT COUNT(*) FROM leads;
```

---

## Backup & Restore

### Backup Database

```bash
# Backup via Docker
docker-compose exec postgres pg_dump -U flipcars flipcars_dev > backup_$(date +%Y%m%d).sql

# Or using pg_dump directly
pg_dump -h localhost -U flipcars -d flipcars_dev -f backup.sql
```

### Restore Database

```bash
# Restore via Docker
docker-compose exec -T postgres psql -U flipcars flipcars_dev < backup.sql

# Or using psql directly
psql -h localhost -U flipcars -d flipcars_dev -f backup.sql
```

---

## Troubleshooting

### Connection Refused

```bash
# Check PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Migration Errors

```bash
# Check current migration status
npm run typeorm migration:show

# Manually revert if needed
npm run migration:revert

# Check data source configuration
cat src/database/data-source.ts
```

### Permission Denied

```bash
# Ensure correct file permissions
chmod 600 .env.development

# Restart services
docker-compose restart
```

---

## Environment Variables

Required variables in `.env.development`:

```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=flipcars
DATABASE_PASSWORD=flipcars123
DATABASE_NAME=flipcars_dev
DATABASE_SYNCHRONIZE=false     # NEVER use true in production
DATABASE_LOGGING=true          # Set to false in production
```

---

## Next Steps

After database setup:

1. ✅ Verify all 20 tables created
2. ✅ Confirm seed data loaded
3. ✅ Test API endpoints with database
4. ✅ Start implementing auth module
5. ✅ Add unit tests for entities

---

**Status**: Database schema and entities ready  
**Tables**: 20 core tables  
**Migrations**: Initial schema migration created  
**Seeds**: Test data scripts prepared  
**Last Updated**: 2025-10-28
