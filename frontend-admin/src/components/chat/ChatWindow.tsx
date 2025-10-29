'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, MessageRole, StreamingMessage } from '@/types/chat';
import { chatService } from '@/lib/api/chat.service';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Card } from '@/components/ui';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export interface ChatWindowProps {
  conversationId: string;
  onMessageSent?: (message: Message) => void;
  enableStreaming?: boolean;
  className?: string;
}

export function ChatWindow({
  conversationId,
  onMessageSent,
  enableStreaming = true,
  className = '',
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();

  // Load messages
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Send message with streaming
  const handleSendWithStreaming = async (content: string) => {
    setIsSending(true);
    setIsStreaming(true);

    // Add user message immediately
    const userMessage: Message = {
      id: uuidv4(),
      conversationId,
      role: MessageRole.USER,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create placeholder for AI response
    const aiMessageId = uuidv4();
    const aiMessage: Message = {
      id: aiMessageId,
      conversationId,
      role: MessageRole.ASSISTANT,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      await chatService.sendMessageStreaming(
        { conversationId, content },
        (chunk: StreamingMessage) => {
          // Update AI message with streaming content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: chunk.content, metadata: chunk.metadata }
                : msg
            )
          );
        },
        (error) => {
          console.error('Streaming error:', error);
          toast.error('Failed to receive AI response');
          // Remove failed AI message
          setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
        },
        () => {
          setIsStreaming(false);
          setStreamingMessageId(undefined);
          setIsSending(false);
        }
      );

      onMessageSent?.(aiMessage);
    } catch {
      toast.error('Failed to send message');
      // Remove both messages on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== userMessage.id && msg.id !== aiMessageId)
      );
    } finally {
      setIsSending(false);
      setIsStreaming(false);
      setStreamingMessageId(undefined);
    }
  };

  // Send message without streaming
  const handleSendWithoutStreaming = async (content: string) => {
    setIsSending(true);

    // Add user message immediately
    const userMessage: Message = {
      id: uuidv4(),
      conversationId,
      role: MessageRole.USER,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const aiMessage = await chatService.sendMessage({ conversationId, content });
      setMessages((prev) => [...prev, aiMessage]);
      onMessageSent?.(aiMessage);
    } catch {
      toast.error('Failed to send message');
      // Remove user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = (content: string) => {
    if (enableStreaming) {
      handleSendWithStreaming(content);
    } else {
      handleSendWithoutStreaming(content);
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        streamingMessageId={streamingMessageId}
      />

      <MessageInput
        onSend={handleSend}
        isLoading={isSending}
        disabled={isStreaming}
      />
    </Card>
  );
}
