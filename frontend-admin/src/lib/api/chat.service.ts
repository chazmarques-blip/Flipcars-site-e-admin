import apiClient from './client';
import {
  Conversation,
  Message,
  CreateConversationDto,
  CreateMessageDto,
  UpdateConversationDto,
  ConversationFilters,
  ConversationStats,
  ConversationStatus,
  StreamingMessage,
} from '@/types/chat';
import { PaginatedResponse } from '@/types';

export const chatService = {
  /**
   * Get paginated conversations with filters
   */
  async getConversations(
    page: number = 1,
    limit: number = 10,
    filters?: ConversationFilters
  ): Promise<PaginatedResponse<Conversation>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.leadId) params.append('leadId', filters.leadId);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.claimId) params.append('claimId', filters.claimId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await apiClient.get<PaginatedResponse<Conversation>>(
      `/conversations?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get conversation statistics
   */
  async getStatistics(): Promise<ConversationStats> {
    const response = await apiClient.get<ConversationStats>('/conversations/statistics');
    return response.data;
  },

  /**
   * Get conversations assigned to current user
   */
  async getMyConversations(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Conversation>> {
    const response = await apiClient.get<PaginatedResponse<Conversation>>(
      `/conversations/my-conversations?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get conversation by ID
   */
  async getConversationById(id: string): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Create new conversation
   */
  async createConversation(data: CreateConversationDto): Promise<Conversation> {
    const response = await apiClient.post<Conversation>('/conversations', data);
    return response.data;
  },

  /**
   * Update conversation
   */
  async updateConversation(id: string, data: UpdateConversationDto): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}`, data);
    return response.data;
  },

  /**
   * Update conversation status
   */
  async updateConversationStatus(
    id: string,
    status: ConversationStatus
  ): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Delete conversation
   */
  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}`);
  },

  /**
   * Send message in conversation
   */
  async sendMessage(data: CreateMessageDto): Promise<Message> {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  /**
   * Send message with streaming response
   */
  async sendMessageStreaming(
    data: CreateMessageDto,
    onChunk: (chunk: StreamingMessage) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete?.();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onChunk(data as StreamingMessage);
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  },

  /**
   * Generate conversation summary
   */
  async generateSummary(conversationId: string): Promise<{ summary: string }> {
    const response = await apiClient.post<{ summary: string }>(
      `/conversations/${conversationId}/summarize`
    );
    return response.data;
  },

  /**
   * Analyze conversation sentiment and intent
   */
  async analyzeConversation(conversationId: string): Promise<Conversation> {
    const response = await apiClient.post<Conversation>(
      `/conversations/${conversationId}/analyze`
    );
    return response.data;
  },

  /**
   * Get suggested responses based on conversation context
   */
  async getSuggestedResponses(conversationId: string): Promise<{ suggestions: string[] }> {
    const response = await apiClient.get<{ suggestions: string[] }>(
      `/conversations/${conversationId}/suggestions`
    );
    return response.data;
  },
};
