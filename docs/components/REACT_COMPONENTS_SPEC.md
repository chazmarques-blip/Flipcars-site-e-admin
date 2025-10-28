# FlipCars 2.0 - React Components Specification

## 📋 Visão Geral

Especificação técnica detalhada de todos os componentes React para Site Público e Dashboard Administrativo.

**Convenções:**
- Componentes funcionais com Hooks
- TypeScript strict mode
- Props validation com interfaces
- Styled com Tailwind CSS + Styled Components
- Testing com Jest + React Testing Library

---

## 🌐 SITE PÚBLICO (Next.js)

### 1. Layout Components

#### `<Header />`
**Localização:** `components/layout/Header.tsx`

```typescript
interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false, sticky = true }) => {
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  // Refs
  const headerRef = useRef<HTMLElement>(null);

  // Effects
  useEffect(() => {
    // Scroll detection for background change
  }, []);

  return (
    <header className={`${sticky ? 'sticky top-0' : ''} z-50`}>
      {/* Desktop Header */}
      <nav className="container">
        <Logo />
        <NavigationMenu />
        <LanguageSelector />
        <CTAButtons />
      </nav>

      {/* Mobile Header */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};
```

**Props:**
- `transparent`: Header com fundo transparente (para hero sections)
- `sticky`: Header fixo no topo ao scrollar

**State:**
- `mobileMenuOpen`: Controle do menu mobile
- `scrolled`: Detecta scroll para mudar background

**Subcomponentes:**
- `<Logo />`: Logo com links
- `<NavigationMenu />`: Menu principal desktop
- `<LanguageSelector />`: Seletor de idioma (EN/ES/PT)
- `<CTAButtons />`: Botões de call-to-action (Phone, WhatsApp)
- `<MobileMenu />`: Menu mobile com overlay

---

#### `<Footer />`
**Localização:** `components/layout/Footer.tsx`

```typescript
interface FooterProps {
  variant?: 'default' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <FooterColumn title={t('footer.about')}>
            <Logo variant="white" size="md" />
            <p>{t('footer.description')}</p>
          </FooterColumn>

          {/* Column 2: Quick Links */}
          <FooterColumn title={t('footer.quickLinks')}>
            <FooterLink href="/services">{t('nav.services')}</FooterLink>
            <FooterLink href="/gallery">{t('nav.gallery')}</FooterLink>
            <FooterLink href="/contact">{t('nav.contact')}</FooterLink>
          </FooterColumn>

          {/* Column 3: Contact */}
          <FooterColumn title={t('footer.contact')}>
            <ContactInfo />
          </FooterColumn>

          {/* Column 4: Hours */}
          <FooterColumn title={t('footer.hours')}>
            <BusinessHours />
          </FooterColumn>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-medium mt-8 pt-8">
          <BottomBar />
        </div>
      </div>
    </footer>
  );
};
```

---

### 2. Hero & Landing Components

#### `<HeroSection />`
**Localização:** `components/sections/HeroSection.tsx`

```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaPrimary?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  ctaSecondary?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  socialProof?: {
    rating: number;
    reviewCount: number;
    source: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  ctaPrimary,
  ctaSecondary,
  socialProof,
}) => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background */}
      {backgroundVideo ? (
        <VideoBackground src={backgroundVideo} />
      ) : (
        <ImageBackground src={backgroundImage} alt="Hero background" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{title}</h1>
          <p className="text-xl md:text-2xl mb-8">{subtitle}</p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {ctaPrimary && (
              <Button
                variant="primary"
                size="lg"
                href={ctaPrimary.href}
                onClick={ctaPrimary.onClick}
              >
                {ctaPrimary.text}
              </Button>
            )}
            {ctaSecondary && (
              <Button
                variant="secondary"
                size="lg"
                href={ctaSecondary.href}
                onClick={ctaSecondary.onClick}
              >
                {ctaSecondary.text}
              </Button>
            )}
          </div>

          {/* Social Proof */}
          {socialProof && <SocialProof {...socialProof} />}
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
};
```

---

### 3. Form Components

#### `<EstimateForm />`
**Localização:** `components/forms/EstimateForm.tsx`

```typescript
interface EstimateFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

interface LeadFormData {
  // Step 1: Contact
  name: string;
  phone: string;
  email: string;
  preferredLanguage: 'en' | 'es' | 'pt';

  // Step 2: Vehicle
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleVIN?: string;
  vehicleLicensePlate?: string;

  // Step 3: Insurance
  hasInsurance: boolean;
  insuranceProvider?: string;
  insuranceClaimNumber?: string;

  // Step 4: Accident
  isDrivable: boolean;
  needsTow: boolean;
  needsRental: boolean;
  accidentDescription: string;

  // Step 5: Photos
  photos: File[];
}

const EstimateForm: React.FC<EstimateFormProps> = ({ onSubmit, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LeadFormData>>({});
  const { t } = useTranslation();

  const steps = [
    { id: 1, title: t('form.steps.contact'), icon: <UserIcon /> },
    { id: 2, title: t('form.steps.vehicle'), icon: <CarIcon /> },
    { id: 3, title: t('form.steps.insurance'), icon: <ShieldIcon /> },
    { id: 4, title: t('form.steps.accident'), icon: <AlertIcon /> },
    { id: 5, title: t('form.steps.photos'), icon: <CameraIcon /> },
  ];

  const handleNext = async () => {
    // Validate current step
    const isValid = await validateStep(currentStep, formData);
    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      onStepChange?.(currentStep + 1);
    } else {
      await onSubmit(formData as LeadFormData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      {/* Form Steps */}
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
        {currentStep === 1 && <ContactStep data={formData} onChange={setFormData} />}
        {currentStep === 2 && <VehicleStep data={formData} onChange={setFormData} />}
        {currentStep === 3 && <InsuranceStep data={formData} onChange={setFormData} />}
        {currentStep === 4 && <AccidentStep data={formData} onChange={setFormData} />}
        {currentStep === 5 && <PhotoUploadStep data={formData} onChange={setFormData} />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button variant="ghost" onClick={handleBack}>
              {t('form.back')}
            </Button>
          )}
          <Button variant="primary" onClick={handleNext} className="ml-auto">
            {currentStep === steps.length ? t('form.submit') : t('form.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

**Step Components:**

```typescript
// ContactStep.tsx
const ContactStep: React.FC<StepProps> = ({ data, onChange }) => (
  <>
    <Input
      name="name"
      label={t('form.name')}
      required
      value={data.name}
      onChange={(e) => onChange({ ...data, name: e.target.value })}
    />
    <Input
      name="phone"
      label={t('form.phone')}
      type="tel"
      required
      value={data.phone}
      onChange={(e) => onChange({ ...data, phone: e.target.value })}
    />
    <Input
      name="email"
      label={t('form.email')}
      type="email"
      value={data.email}
      onChange={(e) => onChange({ ...data, email: e.target.value })}
    />
    <Select
      name="preferredLanguage"
      label={t('form.preferredLanguage')}
      options={[
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'pt', label: 'Português' },
      ]}
      value={data.preferredLanguage}
      onChange={(value) => onChange({ ...data, preferredLanguage: value })}
    />
  </>
);

// PhotoUploadStep.tsx
const PhotoUploadStep: React.FC<StepProps> = ({ data, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const urls = await uploadPhotos(files);
      onChange({ ...data, photos: [...(data.photos || []), ...urls] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>{t('form.uploadPhotos')}</h3>
      <p className="text-sm text-neutral-medium mb-4">
        {t('form.photoGuidance')}
      </p>

      <FileUpload
        accept="image/*"
        multiple
        maxFiles={10}
        maxSize={10 * 1024 * 1024} // 10MB
        onUpload={handleUpload}
        loading={uploading}
      />

      {/* Preview */}
      {data.photos && data.photos.length > 0 && (
        <PhotoGrid photos={data.photos} onRemove={(index) => {
          const newPhotos = [...data.photos];
          newPhotos.splice(index, 1);
          onChange({ ...data, photos: newPhotos });
        }} />
      )}
    </div>
  );
};
```

---

### 4. AI Chat Widget

#### `<AIChatWidget />`
**Localização:** `components/chat/AIChatWidget.tsx`

```typescript
interface AIChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  initialOpen?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  position = 'bottom-right',
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);

  const initializeConversation = async () => {
    const greeting = t('chat.greeting');
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          message: input,
          language: i18n.language,
          context: { messages },
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.leadId && !leadId) {
        setLeadId(data.leadId);
      }

      if (data.shouldEscalate) {
        handleEscalation();
      }
    } catch (error) {
      console.error('Chat error:', error);
      showErrorMessage();
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalation = () => {
    // Show human agent connection options
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: t('chat.escalation.message'),
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4'} 
            z-50 w-14 h-14 rounded-full bg-accent-primary text-white shadow-lg 
            hover:bg-accent-hover transition-all`}
        >
          <ChatIcon />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4'}
            z-50 w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl flex flex-col`}
        >
          {/* Header */}
          <div className="bg-accent-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BotIcon />
              <div>
                <h3 className="font-semibold">{t('chat.title')}</h3>
                <p className="text-xs opacity-90">{t('chat.subtitle')}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.inputPlaceholder')}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

---

### 5. Gallery Components

#### `<BeforeAfterGallery />`
**Localização:** `components/gallery/BeforeAfterGallery.tsx`

```typescript
interface GalleryItem {
  id: string;
  title: string;
  before: string;
  after: string;
  vehicleType: string;
  repairType: string;
}

interface BeforeAfterGalleryProps {
  items: GalleryItem[];
  columns?: 1 | 2 | 3 | 4;
  showFilters?: boolean;
}

const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  items,
  columns = 3,
  showFilters = true,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'suv', label: 'SUV' },
    { id: 'truck', label: 'Truck' },
  ];

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="flex gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedFilter === filter.id
                  ? 'bg-accent-primary text-white'
                  : 'bg-neutral-lighter text-neutral-dark'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {filteredItems.map((item, index) => (
          <BeforeAfterCard
            key={item.id}
            item={item}
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
};
```

---

## 🖥 DASHBOARD ADMINISTRATIVO (React)

### 1. Dashboard Components

#### `<DashboardLayout />`
**Localização:** `components/admin/layout/DashboardLayout.tsx`

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-neutral-lighter">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar user={user} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
```

---

#### `<LeadPipeline />`
**Localização:** `components/admin/leads/LeadPipeline.tsx`

```typescript
interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  aiQualificationScore: number;
  createdAt: Date;
  // ... other fields
}

interface LeadPipelineProps {
  view?: 'kanban' | 'list';
}

const LeadPipeline: React.FC<LeadPipelineProps> = ({ view = 'kanban' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState(view);

  const columns = [
    { id: 'new', title: 'New', color: 'blue' },
    { id: 'qualified_ai', title: 'AI Qualified', color: 'purple' },
    { id: 'human_contacted', title: 'Contacted', color: 'yellow' },
    { id: 'estimate_sent', title: 'Estimate Sent', color: 'orange' },
    { id: 'converted', title: 'Converted', color: 'green' },
  ];

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lead Pipeline</h2>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              leads={leads.filter((l) => l.status === column.id)}
              onDrop={(leadId) => handleStatusChange(leadId, column.id)}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && <LeadTable leads={leads} />}
    </div>
  );
};
```

---

#### `<LeadDetails />`
**Localização:** `components/admin/leads/LeadDetails.tsx`

```typescript
interface LeadDetailsProps {
  leadId: string;
  onClose: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ leadId, onClose }) => {
  const { data: lead, isLoading } = useQuery(['lead', leadId], () =>
    fetchLead(leadId)
  );

  if (isLoading) return <LoadingSpinner />;
  if (!lead) return <NotFound />;

  return (
    <Drawer open={true} onClose={onClose} width="80%">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{lead.name}</h2>
            <p className="text-neutral-medium">Ref: {lead.referenceNumber}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <Tab value="overview">Overview</Tab>
            <Tab value="conversation">AI Conversation</Tab>
            <Tab value="photos">Photos</Tab>
            <Tab value="notes">Notes</Tab>
            <Tab value="activity">Activity</Tab>
          </TabsList>

          {/* Overview Tab */}
          <TabPanel value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Contact Information">
                <InfoRow label="Phone" value={lead.phone} />
                <InfoRow label="Email" value={lead.email} />
                <InfoRow label="Language" value={lead.preferredLanguage} />
              </InfoCard>

              <InfoCard title="Vehicle">
                <InfoRow label="Make/Model" value={`${lead.vehicleMake} ${lead.vehicleModel}`} />
                <InfoRow label="Year" value={lead.vehicleYear} />
                <InfoRow label="VIN" value={lead.vehicleVIN} />
              </InfoCard>

              <InfoCard title="Insurance">
                <InfoRow label="Provider" value={lead.insuranceProvider} />
                <InfoRow label="Claim Number" value={lead.insuranceClaimNumber} />
              </InfoCard>

              <InfoCard title="AI Qualification">
                <QualificationScore score={lead.aiQualificationScore} />
                <InfoRow label="Last AI Interaction" value={formatDate(lead.lastAiInteraction)} />
              </InfoCard>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <Button variant="primary" onClick={() => handleCall(lead)}>
                Call Lead
              </Button>
              <Button variant="secondary" onClick={() => handleEmail(lead)}>
                Send Email
              </Button>
              <Button variant="success" onClick={() => handleConvert(lead)}>
                Convert to Claim
              </Button>
            </div>
          </TabPanel>

          {/* AI Conversation Tab */}
          <TabPanel value="conversation">
            <div className="space-y-4">
              {/* AI Summary */}
              <Card>
                <h3 className="font-semibold mb-2">AI-Generated Summary</h3>
                <AIConversationSummary leadId={lead.id} />
              </Card>

              {/* Conversation History */}
              <Card>
                <h3 className="font-semibold mb-4">Full Conversation</h3>
                <ConversationTimeline messages={lead.conversationHistory} />
              </Card>

              {/* AI Suggestions */}
              <Card>
                <h3 className="font-semibold mb-2">AI Suggested Response</h3>
                <AISuggestedResponse
                  leadId={lead.id}
                  onUse={(response) => handleUseResponse(response)}
                />
              </Card>
            </div>
          </TabPanel>

          {/* Other tabs... */}
        </Tabs>
      </div>
    </Drawer>
  );
};
```

---

## 🧩 Shared Components

### `<Button />`
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  href,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all';
  
  const variantClasses = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover',
    secondary: 'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white',
    ghost: 'text-neutral-dark hover:bg-neutral-lighter',
    danger: 'bg-error text-white hover:bg-error-dark',
    success: 'bg-success text-white hover:bg-success-dark',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon && <span className="mr-2">{icon}</span>}
        {loading ? <Spinner /> : children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={loading} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

---

### `<Input />`, `<Select />`, `<FileUpload />`
*(Especificações similares seguindo os mesmos padrões)*

---

## 📦 Component Organization

```
/components
├── /layout              # Layout components (Header, Footer, etc.)
├── /sections            # Page sections (Hero, Features, etc.)
├── /forms               # Form components
├── /chat                # AI Chat widget
├── /gallery             # Gallery components
├── /admin               # Admin dashboard components
│   ├── /layout
│   ├── /leads
│   ├── /claims
│   ├── /content
│   └── /analytics
└── /shared              # Shared components (Button, Input, etc.)
```

---

**Versão:** 1.0  
**Última Atualização:** 2025-10-28  
**Status:** DRAFT - Fase 0
