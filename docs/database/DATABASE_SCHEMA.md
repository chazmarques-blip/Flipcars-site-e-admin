# FlipCars 2.0 - Database Schema

## 📋 Visão Geral

**SGBD:** PostgreSQL 14+  
**ORM:** TypeORM ou Prisma  
**Encoding:** UTF-8  
**Timezone:** UTC

---

## 🗂 Entidades (Tables)

### 1. users
Usuários internos da plataforma (equipe FlipCars)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'attendant', 'technician', 'marketing')),
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**TypeORM Entity:**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}

enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ATTENDANT = 'attendant',
  TECHNICIAN = 'technician',
  MARKETING = 'marketing',
}
```

---

### 2. customers
Clientes da FlipCars

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'es', 'pt')),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'USA',
  date_of_birth DATE,
  drivers_license_number VARCHAR(100),
  drivers_license_state VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers(name);
```

---

### 3. leads
Leads/potenciais clientes

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'es', 'pt')),
  
  -- Vehicle Info
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  vehicle_vin VARCHAR(17),
  vehicle_license_plate VARCHAR(20),
  vehicle_color VARCHAR(50),
  
  -- Insurance Info
  has_insurance BOOLEAN DEFAULT true,
  insurance_provider VARCHAR(255),
  insurance_claim_number VARCHAR(255),
  insurance_policy_number VARCHAR(255),
  
  -- Accident Info
  is_drivable BOOLEAN,
  needs_tow BOOLEAN,
  needs_rental BOOLEAN,
  accident_description TEXT,
  accident_date DATE,
  
  -- Lead Management
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified_ai', 'human_contacted', 'estimate_sent', 'scheduled', 'lost', 'converted')),
  source VARCHAR(100), -- google_ads, meta_ads, organic, referral, etc.
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  
  -- AI Integration
  ai_qualification_score INTEGER CHECK (ai_qualification_score BETWEEN 0 AND 100),
  ai_conversation_history JSONB DEFAULT '[]',
  last_ai_interaction TIMESTAMP WITH TIME ZONE,
  assigned_ai_agent VARCHAR(100),
  
  -- Human Assignment
  assigned_human_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  last_human_interaction TIMESTAMP WITH TIME ZONE,
  
  -- Estimated Value
  estimated_repair_value DECIMAL(10, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE,
  lost_at TIMESTAMP WITH TIME ZONE,
  lost_reason TEXT
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_assigned_human ON leads(assigned_human_agent_id);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_reference_number ON leads(reference_number);
```

---

### 4. lead_photos
Fotos dos veículos enviadas pelos leads

```sql
CREATE TABLE lead_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_key VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  caption TEXT,
  uploaded_by_customer BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lead_photos_lead_id ON lead_photos(lead_id);
```

---

### 5. lead_notes
Notas internas sobre leads

```sql
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX idx_lead_notes_created_at ON lead_notes(created_at);
```

---

### 6. vehicles
Veículos dos clientes

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  vin VARCHAR(17) UNIQUE,
  license_plate VARCHAR(20),
  color VARCHAR(50),
  mileage INTEGER,
  engine VARCHAR(100),
  transmission VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
```

---

### 7. claims
Sinistros/serviços de reparo

```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'intake' CHECK (status IN ('intake', 'inspection', 'estimate_approval', 'parts_ordering', 'repair_in_progress', 'paint', 'quality_check', 'completed', 'delivered', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Insurance
  insurance_provider VARCHAR(255),
  insurance_claim_number VARCHAR(255),
  insurance_policy_number VARCHAR(255),
  insurance_adjuster_name VARCHAR(255),
  insurance_adjuster_phone VARCHAR(50),
  insurance_adjuster_email VARCHAR(255),
  
  -- Values
  estimated_value DECIMAL(10, 2),
  approved_value DECIMAL(10, 2),
  actual_value DECIMAL(10, 2),
  
  -- Dates
  estimated_completion_date DATE,
  actual_completion_date DATE,
  delivered_date DATE,
  
  -- Assignments
  assigned_technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Additional Services
  tow_service_requested BOOLEAN DEFAULT false,
  rental_car_requested BOOLEAN DEFAULT false,
  rental_car_provider VARCHAR(255),
  
  -- Notes
  internal_notes TEXT,
  customer_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_customer_id ON claims(customer_id);
CREATE INDEX idx_claims_vehicle_id ON claims(vehicle_id);
CREATE INDEX idx_claims_assigned_technician ON claims(assigned_technician_id);
CREATE INDEX idx_claims_created_at ON claims(created_at);
CREATE INDEX idx_claims_claim_number ON claims(claim_number);
```

---

### 8. claim_timeline
Timeline de eventos do sinistro

```sql
CREATE TABLE claim_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_visible_to_customer BOOLEAN DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_claim_timeline_claim_id ON claim_timeline(claim_id);
CREATE INDEX idx_claim_timeline_timestamp ON claim_timeline(timestamp);
```

---

### 9. claim_photos
Fotos do progresso do reparo

```sql
CREATE TABLE claim_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  timeline_event_id UUID REFERENCES claim_timeline(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_key VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  caption TEXT,
  category VARCHAR(50), -- before, during, after, damage, repair
  uploaded_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_visible_to_customer BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_claim_photos_claim_id ON claim_photos(claim_id);
CREATE INDEX idx_claim_photos_timeline_event_id ON claim_photos(timeline_event_id);
CREATE INDEX idx_claim_photos_category ON claim_photos(category);
```

---

### 10. claim_documents
Documentos relacionados aos sinistros

```sql
CREATE TABLE claim_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_key VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  category VARCHAR(50), -- estimate, invoice, insurance, receipt, other
  uploaded_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_visible_to_customer BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_claim_documents_claim_id ON claim_documents(claim_id);
CREATE INDEX idx_claim_documents_category ON claim_documents(category);
```

---

### 11. messages
Mensagens entre cliente e oficina

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'staff', 'ai')),
  sender_id UUID, -- References users(id) if staff, customers(id) if customer, NULL if ai
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_claim_id ON messages(claim_id);
CREATE INDEX idx_messages_lead_id ON messages(lead_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

---

### 12. communications
Log de comunicações (email, SMS, WhatsApp)

```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
  
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  
  -- Contact Info
  from_address VARCHAR(255),
  to_address VARCHAR(255) NOT NULL,
  
  -- Content
  subject VARCHAR(500),
  body TEXT NOT NULL,
  template_used VARCHAR(100),
  language VARCHAR(10),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  external_message_id VARCHAR(255),
  error_message TEXT,
  
  -- Metadata
  sent_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_communications_customer_id ON communications(customer_id);
CREATE INDEX idx_communications_lead_id ON communications(lead_id);
CREATE INDEX idx_communications_claim_id ON communications(claim_id);
CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_communications_created_at ON communications(created_at);
```

---

### 13. pages
Páginas do CMS

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Multilingual Content
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  title_pt VARCHAR(500),
  
  content_en TEXT,
  content_es TEXT,
  content_pt TEXT,
  
  meta_title_en VARCHAR(255),
  meta_title_es VARCHAR(255),
  meta_title_pt VARCHAR(255),
  
  meta_description_en TEXT,
  meta_description_es TEXT,
  meta_description_pt TEXT,
  
  -- SEO
  featured_image_url TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Publishing
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_published_at ON pages(published_at);
```

---

### 14. blog_posts
Posts do blog

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Multilingual Content
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  title_pt VARCHAR(500),
  
  excerpt_en TEXT,
  excerpt_es TEXT,
  excerpt_pt TEXT,
  
  content_en TEXT,
  content_es TEXT,
  content_pt TEXT,
  
  -- SEO
  meta_title_en VARCHAR(255),
  meta_title_es VARCHAR(255),
  meta_title_pt VARCHAR(255),
  
  meta_description_en TEXT,
  meta_description_es TEXT,
  meta_description_pt TEXT,
  
  featured_image_url TEXT,
  
  -- Categorization
  category VARCHAR(100),
  tags TEXT[], -- Array of tags
  
  -- Reading
  read_time_minutes INTEGER,
  
  -- Author
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  author_avatar_url TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
```

---

### 15. gallery_items
Galeria "Antes & Depois"

```sql
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multilingual Content
  title_en VARCHAR(500),
  title_es VARCHAR(500),
  title_pt VARCHAR(500),
  
  description_en TEXT,
  description_es TEXT,
  description_pt TEXT,
  
  -- Images
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  
  -- Vehicle Info
  vehicle_type VARCHAR(100), -- sedan, suv, truck, etc.
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  
  -- Repair Info
  repair_type VARCHAR(100), -- collision, paint, bodywork, etc.
  repair_description TEXT,
  
  -- Display
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_items_status ON gallery_items(status);
CREATE INDEX idx_gallery_items_vehicle_type ON gallery_items(vehicle_type);
CREATE INDEX idx_gallery_items_repair_type ON gallery_items(repair_type);
CREATE INDEX idx_gallery_items_is_featured ON gallery_items(is_featured);
CREATE INDEX idx_gallery_items_display_order ON gallery_items(display_order);
```

---

### 16. ai_conversations
Conversas completas da IA (para análise e melhoria)

```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Conversation Data
  messages JSONB NOT NULL DEFAULT '[]',
  language VARCHAR(10),
  
  -- AI Analysis
  qualification_score INTEGER,
  sentiment VARCHAR(50),
  intent VARCHAR(100),
  key_points TEXT[],
  
  -- Outcome
  was_escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  escalated_at TIMESTAMP WITH TIME ZONE,
  escalated_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Performance
  total_messages INTEGER DEFAULT 0,
  average_response_time DECIMAL(10, 2), -- in seconds
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_lead_id ON ai_conversations(lead_id);
CREATE INDEX idx_ai_conversations_was_escalated ON ai_conversations(was_escalated);
CREATE INDEX idx_ai_conversations_started_at ON ai_conversations(started_at);
```

---

### 17. ai_feedback
Feedback sobre respostas da IA (para treinamento)

```sql
CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  message_index INTEGER NOT NULL,
  
  -- Feedback
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  was_helpful BOOLEAN,
  was_accurate BOOLEAN,
  feedback_text TEXT,
  
  -- Review
  reviewed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_feedback_conversation_id ON ai_feedback(conversation_id);
CREATE INDEX idx_ai_feedback_rating ON ai_feedback(rating);
CREATE INDEX idx_ai_feedback_reviewed_at ON ai_feedback(reviewed_at);
```

---

### 18. ai_knowledge_base
Base de conhecimento para a IA

```sql
CREATE TABLE ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  category VARCHAR(100) NOT NULL, -- faq, insurance, process, services, etc.
  question_en TEXT,
  question_es TEXT,
  question_pt TEXT,
  
  answer_en TEXT NOT NULL,
  answer_es TEXT,
  answer_pt TEXT,
  
  -- Keywords for matching
  keywords TEXT[],
  
  -- Usage
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_knowledge_base_category ON ai_knowledge_base(category);
CREATE INDEX idx_ai_knowledge_base_is_active ON ai_knowledge_base(is_active);
CREATE INDEX idx_ai_knowledge_base_keywords ON ai_knowledge_base USING GIN(keywords);
```

---

### 19. settings
Configurações gerais do sistema

```sql
CREATE TABLE settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exemplos de configurações:
-- 'ai_agent_persona': { tone, formality, greeting_messages }
-- 'business_hours': { monday: { open, close }, ... }
-- 'contact_info': { phone, email, whatsapp, address }
-- 'social_media': { facebook, instagram, youtube }
```

---

### 20. audit_logs
Logs de auditoria

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action
  action VARCHAR(100) NOT NULL, -- create, update, delete, login, etc.
  entity_type VARCHAR(100), -- lead, claim, user, etc.
  entity_id UUID,
  
  -- Details
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## 🔗 Relacionamentos (Entity Relationships)

### Diagrama ER (Descrição Textual)

```
users (1) ----< (N) leads (assigned_human_agent_id)
users (1) ----< (N) claims (assigned_technician_id, assigned_manager_id)
users (1) ----< (N) lead_notes (author_id)
users (1) ----< (N) pages (author_id)
users (1) ----< (N) blog_posts (author_id)

customers (1) ----< (N) leads (customer_id)
customers (1) ----< (N) vehicles
customers (1) ----< (N) claims

leads (1) ----< (N) lead_photos
leads (1) ----< (N) lead_notes
leads (1) ----< (N) messages
leads (1) ----< (N) communications
leads (1) ----< (1) claims (lead_id)
leads (1) ----< (N) ai_conversations

vehicles (1) ----< (N) claims

claims (1) ----< (N) claim_timeline
claims (1) ----< (N) claim_photos
claims (1) ----< (N) claim_documents
claims (1) ----< (N) messages
claims (1) ----< (N) communications

ai_conversations (1) ----< (N) ai_feedback
```

---

## 📊 Views (Database Views)

### view_lead_summary
Resumo de leads com informações agregadas

```sql
CREATE VIEW view_lead_summary AS
SELECT 
  l.id,
  l.reference_number,
  l.name,
  l.email,
  l.phone,
  l.status,
  l.source,
  l.ai_qualification_score,
  l.estimated_repair_value,
  l.created_at,
  u.name AS assigned_agent_name,
  COUNT(DISTINCT ln.id) AS notes_count,
  COUNT(DISTINCT lp.id) AS photos_count
FROM leads l
LEFT JOIN users u ON l.assigned_human_agent_id = u.id
LEFT JOIN lead_notes ln ON l.id = ln.lead_id
LEFT JOIN lead_photos lp ON l.id = lp.lead_id
GROUP BY l.id, u.name;
```

---

### view_claim_summary
Resumo de sinistros com informações agregadas

```sql
CREATE VIEW view_claim_summary AS
SELECT 
  c.id,
  c.claim_number,
  c.status,
  c.priority,
  c.estimated_value,
  c.actual_value,
  c.estimated_completion_date,
  c.created_at,
  cust.name AS customer_name,
  cust.phone AS customer_phone,
  v.make AS vehicle_make,
  v.model AS vehicle_model,
  v.year AS vehicle_year,
  tech.name AS technician_name,
  mgr.name AS manager_name,
  COUNT(DISTINCT ct.id) AS timeline_events_count,
  COUNT(DISTINCT cp.id) AS photos_count
FROM claims c
LEFT JOIN customers cust ON c.customer_id = cust.id
LEFT JOIN vehicles v ON c.vehicle_id = v.id
LEFT JOIN users tech ON c.assigned_technician_id = tech.id
LEFT JOIN users mgr ON c.assigned_manager_id = mgr.id
LEFT JOIN claim_timeline ct ON c.id = ct.claim_id
LEFT JOIN claim_photos cp ON c.id = cp.claim_id
GROUP BY c.id, cust.name, cust.phone, v.make, v.model, v.year, tech.name, mgr.name;
```

---

## 🔄 Migrations & Seeds

### Migration Strategy
1. Use ferramentas de migração do TypeORM ou Prisma
2. Versionamento de schemas com timestamps
3. Rollback plan para cada migração
4. Testes em ambiente staging antes de produção

### Seed Data (Initial Data)

#### Admin User
```sql
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'admin@flipcars.us',
  '$2b$10$...', -- Hash de "AdminP@ssw0rd!"
  'FlipCars Admin',
  'admin',
  true
);
```

#### Settings
```sql
INSERT INTO settings (key, value, description, is_public) VALUES
('contact_info', '{"phone": "+1-321-960-8661", "email": "info@flipcars.us", "address": "5200 Old Winter Garden Rd, Suite 110A, Orlando, FL 32835"}', 'Contact information', true),
('business_hours', '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "10:00", "close": "16:00"}, "sunday": {"open": null, "close": null}}', 'Business hours', true),
('ai_agent_persona', '{"tone": "empathetic", "formality": "professional_friendly", "greeting_en": "Hi! I'm FlipCars virtual assistant. How can I help you today?", "greeting_es": "¡Hola! Soy el asistente virtual de FlipCars. ¿Cómo puedo ayudarte?", "greeting_pt": "Olá! Sou o assistente virtual da FlipCars. Como posso ajudar?"}', 'AI agent configuration', false);
```

#### AI Knowledge Base (Sample)
```sql
INSERT INTO ai_knowledge_base (category, question_en, answer_en, question_es, answer_es, question_pt, answer_pt, keywords, is_active) VALUES
(
  'faq',
  'Do you work with my insurance?',
  'Yes! We work with all major insurance providers including State Farm, Geico, Progressive, Allstate, and many others. We handle all the paperwork directly with your insurance company.',
  '¿Trabajan con mi seguro?',
  '¡Sí! Trabajamos con todas las principales compañías de seguros incluyendo State Farm, Geico, Progressive, Allstate y muchas otras. Manejamos todo el papeleo directamente con tu compañía de seguros.',
  'Vocês trabalham com minha seguradora?',
  'Sim! Trabalhamos com todas as principais seguradoras incluindo State Farm, Geico, Progressive, Allstate e muitas outras. Cuidamos de toda a papelada diretamente com sua seguradora.',
  ARRAY['insurance', 'seguro', 'seguradora', 'state farm', 'geico', 'progressive', 'allstate'],
  true
);
```

---

## 🔍 Queries Comuns (Common Queries)

### 1. Buscar leads qualificados pela IA não contatados
```sql
SELECT * FROM leads
WHERE status = 'qualified_ai'
AND assigned_human_agent_id IS NULL
AND ai_qualification_score >= 70
ORDER BY ai_qualification_score DESC, created_at ASC
LIMIT 10;
```

### 2. Relatório de conversão de leads por fonte
```sql
SELECT 
  source,
  COUNT(*) AS total_leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) AS converted_leads,
  ROUND(COUNT(CASE WHEN status = 'converted' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) AS conversion_rate
FROM leads
WHERE created_at >= '2025-10-01' AND created_at < '2025-11-01'
GROUP BY source
ORDER BY conversion_rate DESC;
```

### 3. Sinistros atrasados
```sql
SELECT 
  c.*,
  cust.name AS customer_name,
  cust.phone AS customer_phone
FROM claims c
JOIN customers cust ON c.customer_id = cust.id
WHERE c.status NOT IN ('completed', 'delivered', 'cancelled')
AND c.estimated_completion_date < CURRENT_DATE
ORDER BY c.estimated_completion_date ASC;
```

### 4. Performance da IA por dia
```sql
SELECT 
  DATE(started_at) AS date,
  COUNT(*) AS total_conversations,
  AVG(qualification_score) AS avg_qualification_score,
  COUNT(CASE WHEN was_escalated THEN 1 END) AS escalated_count,
  ROUND(COUNT(CASE WHEN was_escalated THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) AS escalation_rate,
  AVG(average_response_time) AS avg_response_time
FROM ai_conversations
WHERE started_at >= '2025-10-01' AND started_at < '2025-11-01'
GROUP BY DATE(started_at)
ORDER BY date DESC;
```

---

## 🔐 Permissões e Segurança

### Row Level Security (RLS) - PostgreSQL
```sql
-- Exemplo: Técnicos só veem sinistros atribuídos a eles
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY technician_claims_policy ON claims
FOR SELECT
TO technician_role
USING (assigned_technician_id = current_user_id());
```

### Sensitive Data
- **passwords:** Sempre armazenar como hash (bcrypt, rounds: 10)
- **VIN:** Considerar encriptação em repouso
- **Insurance numbers:** Considerar encriptação em repouso
- **PII:** Compliance com regulamentações (CCPA, se aplicável)

---

## 📈 Performance & Otimização

### Índices Compostos Adicionais
```sql
-- Lead search optimization
CREATE INDEX idx_leads_search ON leads(status, source, created_at);

-- Claim assignment optimization
CREATE INDEX idx_claims_tech_status ON claims(assigned_technician_id, status);

-- AI conversation performance
CREATE INDEX idx_ai_conv_lead_started ON ai_conversations(lead_id, started_at);
```

### Partitioning (Para grandes volumes)
```sql
-- Particionar audit_logs por mês (exemplo)
CREATE TABLE audit_logs (
  -- ... columns
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2025_10 PARTITION OF audit_logs
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

---

## 🔄 Backup & Recovery

### Estratégia de Backup
1. **Full Backup:** Diário às 2:00 AM UTC
2. **Incremental Backup:** A cada 4 horas
3. **Point-in-Time Recovery:** WAL archiving habilitado
4. **Retention:** 30 dias para full backups, 7 dias para incrementais

### Scripts de Backup (exemplo)
```bash
# Full backup
pg_dump -h localhost -U flipcars_user -d flipcars_db -F c -f /backups/flipcars_$(date +%Y%m%d).dump

# Restore
pg_restore -h localhost -U flipcars_user -d flipcars_db /backups/flipcars_20251028.dump
```

---

**Versão:** 1.0  
**Última Atualização:** 2025-10-28  
**Status:** DRAFT - Fase 0
