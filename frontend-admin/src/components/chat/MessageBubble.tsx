'use client';

import { Message, MessageRole } from '@/types/chat';
import { format } from 'date-fns';
import { User, Bot, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === MessageRole.USER;

  return (
    <div
      className={clsx(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={clsx(
          'max-w-[70%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        {/* Message Text */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>

        {/* Metadata */}
        {message.metadata && (
          <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
            {message.metadata.confidence !== undefined && (
              <div className="flex items-center gap-2 text-xs opacity-75">
                <CheckCircle className="w-3 h-3" />
                <span>Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
              </div>
            )}

            {message.metadata.suggestedActions && message.metadata.suggestedActions.length > 0 && (
              <div className="text-xs opacity-75 mt-2">
                <p className="font-medium mb-1">Suggested Actions:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {message.metadata.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={clsx(
            'text-xs mt-1',
            isUser ? 'text-white/70' : 'text-gray-500'
          )}
        >
          {format(new Date(message.createdAt), 'HH:mm')}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
