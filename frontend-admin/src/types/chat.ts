export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum ConversationType {
  GENERAL = 'general',
  LEAD_QUALIFICATION = 'lead_qualification',
  CLAIM_ANALYSIS = 'claim_analysis',
  CUSTOMER_SUPPORT = 'customer_support',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: {
    leadId?: string;
    customerId?: string;
    claimId?: string;
    confidence?: number;
    suggestedActions?: string[];
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  type: ConversationType;
  status: ConversationStatus;
  
  // Participants
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  
  // Context
  leadId?: string;
  customerId?: string;
  claimId?: string;
  
  // Messages
  messages: Message[];
  messageCount: number;
  lastMessage?: Message;
  
  // Metadata
  summary?: string;
  tags?: string[];
  aiInsights?: {
    sentiment?: 'positive' | 'neutral' | 'negative';
    intent?: string;
    urgency?: 'low' | 'medium' | 'high';
    suggestedNextSteps?: string[];
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  lastActivityAt: string;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
  metadata?: {
    leadId?: string;
    customerId?: string;
    claimId?: string;
    [key: string]: unknown;
  };
}

export interface CreateConversationDto {
  title: string;
  type?: ConversationType;
  leadId?: string;
  customerId?: string;
  claimId?: string;
  initialMessage?: string;
}

export interface UpdateConversationDto {
  title?: string;
  status?: ConversationStatus;
  tags?: string[];
  summary?: string;
}

export interface ConversationFilters {
  type?: ConversationType;
  status?: ConversationStatus;
  userId?: string;
  search?: string;
  leadId?: string;
  customerId?: string;
  claimId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ConversationStats {
  total: number;
  active: number;
  resolved: number;
  archived: number;
  byType: {
    general: number;
    leadQualification: number;
    claimAnalysis: number;
    customerSupport: number;
  };
  avgResponseTime: number;
  avgMessagesPerConversation: number;
}

export interface StreamingMessage {
  conversationId: string;
  content: string;
  isDone: boolean;
  metadata?: {
    confidence?: number;
    suggestedActions?: string[];
  };
}

export interface ChatSettings {
  model: 'gpt-4' | 'gpt-3.5-turbo';
  temperature: number;
  maxTokens: number;
  streamResponses: boolean;
  enableSuggestions: boolean;
  enableAutoSummary: boolean;
}
