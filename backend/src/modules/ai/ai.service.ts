import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Lead } from '@database/entities/lead.entity';
import { AiConversation } from '@database/entities/ai-conversation.entity';
import {
  ChatMessageDto,
  ChatResponseDto,
} from './dto/chat.dto';
import {
  QualifyLeadAiDto,
  LeadQualificationResponseDto,
} from './dto/qualify-lead.dto';
import {
  AnalyzeConversationDto,
  ConversationAnalysisDto,
} from './dto/analyze-conversation.dto';

@Injectable()
export class AiService {
  private readonly openaiApiKey: string;
  private readonly openaiEnabled: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(AiConversation)
    private readonly aiConversationRepository: Repository<AiConversation>,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.openaiEnabled = !!this.openaiApiKey && this.openaiApiKey !== 'your-openai-api-key-here';
  }

  /**
   * Chat with AI agent
   * TODO: Implement actual OpenAI API call in production
   */
  async chat(chatDto: ChatMessageDto): Promise<ChatResponseDto> {
    // For now, return a mock response
    // In production, this would call OpenAI API
    
    if (!this.openaiEnabled) {
      return this.mockChatResponse(chatDto);
    }

    // TODO: Implement OpenAI API integration
    // const openai = new OpenAI({ apiKey: this.openaiApiKey });
    // const response = await openai.chat.completions.create({...});
    
    return this.mockChatResponse(chatDto);
  }

  /**
   * Qualify a lead using AI
   */
  async qualifyLead(qualifyDto: QualifyLeadAiDto): Promise<LeadQualificationResponseDto> {
    // Find the lead
    const lead = await this.leadRepository.findOne({
      where: { id: qualifyDto.leadId },
      relations: ['customer', 'vehicle'],
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // For now, use rule-based qualification
    // In production, this would use OpenAI API
    if (!this.openaiEnabled) {
      return this.mockLeadQualification(lead, qualifyDto);
    }

    // TODO: Implement OpenAI API integration for lead qualification
    return this.mockLeadQualification(lead, qualifyDto);
  }

  /**
   * Analyze conversation sentiment and intent
   */
  async analyzeConversation(
    analyzeDto: AnalyzeConversationDto,
  ): Promise<ConversationAnalysisDto> {
    if (!this.openaiEnabled) {
      return this.mockConversationAnalysis(analyzeDto);
    }

    // TODO: Implement OpenAI API integration for conversation analysis
    return this.mockConversationAnalysis(analyzeDto);
  }

  /**
   * Save AI conversation to database
   */
  async saveConversation(
    leadId: string,
    messages: Array<{ role: string; content: string }>,
    agentType: string,
  ): Promise<AiConversation> {
    const conversation = this.aiConversationRepository.create({
      leadId,
      role: 'user' as any, // ConversationRole.USER
      message: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      response: 'AI response', // Would be generated
      aiAgent: agentType,
      metadata: { messages },
    });

    return this.aiConversationRepository.save(conversation);
  }

  /**
   * Get AI statistics
   */
  async getStatistics() {
    const totalConversations = await this.aiConversationRepository.count();

    const conversationsByAgent = await this.aiConversationRepository
      .createQueryBuilder('conversation')
      .select('conversation.ai_agent', 'agentType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('conversation.ai_agent')
      .getRawMany();

    const leadsQualified = await this.leadRepository.count({
      where: { aiQualificationScore: Not(IsNull()) },
    });

    return {
      totalConversations,
      byAgentType: conversationsByAgent.reduce((acc, item) => {
        acc[item.agentType] = parseInt(item.count);
        return acc;
      }, {}),
      leadsQualified,
      openaiEnabled: this.openaiEnabled,
    };
  }

  /**
   * Mock chat response (used when OpenAI is not configured)
   */
  private mockChatResponse(chatDto: ChatMessageDto): ChatResponseDto {
    const agentType = chatDto.agentType || 'support';
    const conversationHistory = chatDto.conversationHistory || [];
    
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: chatDto.message,
    });

    // Generate mock response based on agent type
    let responseMessage = '';
    let suggestedActions: string[] = [];
    let escalateToHuman = false;

    switch (agentType) {
      case 'qualifier':
        responseMessage = this.generateQualifierResponse(chatDto.message);
        suggestedActions = ['Collect vehicle details', 'Ask about insurance', 'Request photos'];
        break;
      case 'support':
        responseMessage = this.generateSupportResponse(chatDto.message);
        suggestedActions = ['Check claim status', 'Provide estimate', 'Schedule appointment'];
        break;
      case 'sales':
        responseMessage = this.generateSalesResponse(chatDto.message);
        suggestedActions = ['Send quote', 'Schedule consultation', 'Offer discount'];
        break;
      default:
        responseMessage = 'How can I help you today?';
    }

    // Check if should escalate (simple keyword detection)
    const escalationKeywords = ['speak to human', 'talk to person', 'manager', 'complaint'];
    escalateToHuman = escalationKeywords.some(keyword => 
      chatDto.message.toLowerCase().includes(keyword)
    );

    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: responseMessage,
    });

    return {
      message: responseMessage,
      agentType,
      confidence: 0.85,
      suggestedActions,
      escalateToHuman,
      conversationHistory,
    };
  }

  /**
   * Mock lead qualification (rule-based)
   */
  private mockLeadQualification(
    lead: Lead,
    qualifyDto: QualifyLeadAiDto,
  ): LeadQualificationResponseDto {
    let score = 50; // Base score
    let reasoning = 'Lead qualification based on available information:\n';

    // Score based on insurance
    if (lead.hasInsurance) {
      score += 20;
      reasoning += '- Has insurance (+20)\n';
    }

    // Score based on vehicle details
    if (lead.vehicleMake && lead.vehicleModel && lead.vehicleYear) {
      score += 15;
      reasoning += '- Complete vehicle information (+15)\n';
    }

    // Score based on accident description
    if (lead.accidentDescription && lead.accidentDescription.length > 50) {
      score += 10;
      reasoning += '- Detailed accident description (+10)\n';
    }

    // Score based on contact completeness
    if (lead.email && lead.phone) {
      score += 5;
      reasoning += '- Complete contact information (+5)\n';
    }

    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score));

    // Determine priority
    let priority = 'medium';
    if (score >= 70) priority = 'high';
    else if (score < 40) priority = 'low';

    // Suggested actions
    const suggestedActions: string[] = [];
    if (!lead.hasInsurance) suggestedActions.push('Verify insurance coverage');
    if (!lead.vehicleYear) suggestedActions.push('Collect complete vehicle details');
    if (score >= 70) suggestedActions.push('Contact within 24 hours');
    else suggestedActions.push('Follow up within 3-5 days');

    return {
      leadId: lead.id,
      qualificationScore: score,
      priority,
      reasoning,
      suggestedActions,
      confidence: 0.75,
      estimatedValue: this.estimateLeadValue(lead),
      recommendedAgent: priority === 'high' ? 'Senior Agent' : 'Standard Agent',
    };
  }

  /**
   * Mock conversation analysis
   */
  private mockConversationAnalysis(
    analyzeDto: AnalyzeConversationDto,
  ): ConversationAnalysisDto {
    const messages = analyzeDto.conversationHistory.map(m => m.content.toLowerCase());
    const fullText = messages.join(' ');

    // Simple sentiment analysis
    const positiveWords = ['thanks', 'great', 'excellent', 'perfect', 'good'];
    const negativeWords = ['bad', 'terrible', 'angry', 'upset', 'disappointed'];
    
    const positiveCount = positiveWords.filter(w => fullText.includes(w)).length;
    const negativeCount = negativeWords.filter(w => fullText.includes(w)).length;
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Detect intent
    let intent = 'inquiry';
    if (fullText.includes('estimate') || fullText.includes('quote')) intent = 'quote_request';
    if (fullText.includes('claim') || fullText.includes('insurance')) intent = 'claim_inquiry';
    if (fullText.includes('appointment') || fullText.includes('schedule')) intent = 'booking';

    // Key topics (simple keyword extraction)
    const topics: string[] = [];
    if (fullText.includes('repair')) topics.push('repair');
    if (fullText.includes('insurance')) topics.push('insurance');
    if (fullText.includes('cost') || fullText.includes('price')) topics.push('pricing');
    if (fullText.includes('time') || fullText.includes('when')) topics.push('timeline');

    return {
      sentiment,
      intent,
      keyTopics: topics,
      customerSatisfaction: sentiment === 'positive' ? 85 : sentiment === 'negative' ? 40 : 65,
      escalationRecommended: sentiment === 'negative' || negativeCount > 2,
      summary: `${analyzeDto.conversationHistory.length} messages exchanged. Customer sentiment: ${sentiment}.`,
      actionItems: this.generateActionItems(intent, sentiment),
    };
  }

  /**
   * Helper: Generate qualifier agent response
   */
  private generateQualifierResponse(message: string): string {
    const lower = message.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hello! I\'m here to help you get started with your auto body repair. Can you tell me about the damage to your vehicle?';
    }
    if (lower.includes('accident') || lower.includes('damage')) {
      return 'I understand. Can you describe what happened? Also, do you have insurance that will cover the repairs?';
    }
    if (lower.includes('insurance')) {
      return 'Great! Having insurance will help streamline the process. Can you provide your insurance company name and policy number?';
    }
    if (lower.includes('estimate') || lower.includes('quote')) {
      return 'I can help you get an estimate. First, could you share your vehicle\'s make, model, and year?';
    }
    
    return 'Thank you for that information. To better assist you, could you provide details about your vehicle and the type of damage?';
  }

  /**
   * Helper: Generate support agent response
   */
  private generateSupportResponse(message: string): string {
    const lower = message.toLowerCase();
    
    if (lower.includes('status') || lower.includes('progress')) {
      return 'I can check the status of your claim. Could you provide your claim number or reference number?';
    }
    if (lower.includes('how long') || lower.includes('when ready')) {
      return 'Typical repairs take 3-7 business days depending on the extent of damage and parts availability. I can provide a more specific timeline once we assess your vehicle.';
    }
    if (lower.includes('cost') || lower.includes('price')) {
      return 'I\'d be happy to discuss costs with you. Have you received an estimate yet? If not, we can schedule a free inspection.';
    }
    
    return 'I\'m here to help! Let me know if you have questions about your repair, timeline, or anything else.';
  }

  /**
   * Helper: Generate sales agent response
   */
  private generateSalesResponse(message: string): string {
    const lower = message.toLowerCase();
    
    if (lower.includes('discount') || lower.includes('deal')) {
      return 'We currently have special offers for first-time customers! I can provide you with details on our current promotions.';
    }
    if (lower.includes('appointment') || lower.includes('schedule')) {
      return 'Excellent! I can help you schedule an appointment. What day and time works best for you?';
    }
    if (lower.includes('insurance')) {
      return 'We work with all major insurance companies and can handle the claims process for you. This makes it much easier on your end!';
    }
    
    return 'I\'d love to help you get started. Would you like to schedule a free inspection and estimate?';
  }

  /**
   * Helper: Estimate lead value
   */
  private estimateLeadValue(lead: Lead): number {
    let value = 500; // Base value
    
    if (lead.hasInsurance) value += 1000;
    if (lead.accidentDescription?.includes('major')) value += 1500;
    if (lead.accidentDescription?.includes('minor')) value += 300;
    
    // Estimate based on vehicle year
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(lead.vehicleYear || '0');
    if (vehicleYear >= currentYear - 3) value += 1000; // Newer vehicles
    
    return Math.round(value);
  }

  /**
   * Helper: Generate action items based on intent and sentiment
   */
  private generateActionItems(intent: string, sentiment: string): string[] {
    const actions: string[] = [];
    
    switch (intent) {
      case 'quote_request':
        actions.push('Send detailed estimate');
        actions.push('Schedule inspection');
        break;
      case 'claim_inquiry':
        actions.push('Verify insurance information');
        actions.push('Update claim status');
        break;
      case 'booking':
        actions.push('Confirm appointment');
        actions.push('Send calendar invite');
        break;
      default:
        actions.push('Follow up within 24 hours');
    }
    
    if (sentiment === 'negative') {
      actions.push('Escalate to supervisor');
      actions.push('Offer compensation or discount');
    }
    
    return actions;
  }
}
