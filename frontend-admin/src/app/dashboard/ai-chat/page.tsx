'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Search, Archive, CheckCircle } from 'lucide-react';
import { Button, Badge, Input, Spinner } from '@/components/ui';
import { ChatWindow } from '@/components/chat';
import { Conversation, ConversationStatus, ConversationType } from '@/types/chat';
import { chatService } from '@/lib/api/chat.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getMyConversations();
      setConversations(response.data);
      
      // Auto-select first conversation or most recent
      if (response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    setIsCreatingConversation(true);
    try {
      const newConversation = await chatService.createConversation({
        title: `New Chat ${new Date().toLocaleDateString()}`,
        type: ConversationType.GENERAL,
        initialMessage: 'Hello! How can I help you today?',
      });

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      toast.success('New conversation created!');
    } catch {
      toast.error('Failed to create conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleArchiveConversation = async (id: string) => {
    try {
      await chatService.updateConversationStatus(id, ConversationStatus.ARCHIVED);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      
      if (selectedConversation?.id === id) {
        setSelectedConversation(conversations[0] || null);
      }
      
      toast.success('Conversation archived');
    } catch {
      toast.error('Failed to archive conversation');
    }
  };

  const handleResolveConversation = async (id: string) => {
    try {
      const updated = await chatService.updateConversationStatus(id, ConversationStatus.RESOLVED);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      toast.success('Conversation resolved');
    } catch {
      toast.error('Failed to resolve conversation');
    }
  };

  const getStatusBadge = (status: ConversationStatus) => {
    const variants: Record<ConversationStatus, 'success' | 'warning' | 'default'> = {
      [ConversationStatus.ACTIVE]: 'success',
      [ConversationStatus.RESOLVED]: 'default',
      [ConversationStatus.ARCHIVED]: 'warning',
    };

    return <Badge variant={variants[status]} size="sm">{status.toUpperCase()}</Badge>;
  };

  const getTypeIcon = () => {
    // Return different icons based on conversation type
    return <MessageSquare className="w-4 h-4" />;
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      {/* Conversations Sidebar */}
      <div className="w-80 flex flex-col bg-white border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-gray-900">AI Chat</h2>
            <Button
              size="sm"
              onClick={handleCreateConversation}
              isLoading={isCreatingConversation}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No conversations found</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateConversation}
                className="mt-4"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Start New Chat
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={clsx(
                    'w-full p-4 text-left hover:bg-gray-50 transition-colors',
                    selectedConversation?.id === conversation.id && 'bg-primary-50 border-l-4 border-primary'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getTypeIcon()}
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.title}
                      </h3>
                    </div>
                    {getStatusBadge(conversation.status)}
                  </div>

                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {conversation.lastMessage.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{conversation.messageCount} messages</span>
                    <span>
                      {formatDistanceToNow(new Date(conversation.lastActivityAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    {conversation.status === ConversationStatus.ACTIVE && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveConversation(conversation.id);
                        }}
                        className="text-xs text-success hover:underline flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveConversation(conversation.id);
                      }}
                      className="text-xs text-gray-500 hover:underline flex items-center gap-1"
                    >
                      <Archive className="w-3 h-3" />
                      Archive
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedConversation.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedConversation.messageCount} messages • Last activity{' '}
                    {formatDistanceToNow(new Date(selectedConversation.lastActivityAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedConversation.status)}
                  
                  {selectedConversation.aiInsights && (
                    <div className="flex items-center gap-2 text-sm">
                      {selectedConversation.aiInsights.sentiment && (
                        <Badge variant="default" size="sm">
                          {selectedConversation.aiInsights.sentiment}
                        </Badge>
                      )}
                      {selectedConversation.aiInsights.urgency && (
                        <Badge
                          variant={
                            selectedConversation.aiInsights.urgency === 'high'
                              ? 'danger'
                              : selectedConversation.aiInsights.urgency === 'medium'
                              ? 'warning'
                              : 'success'
                          }
                          size="sm"
                        >
                          {selectedConversation.aiInsights.urgency} urgency
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <ChatWindow
              conversationId={selectedConversation.id}
              onMessageSent={() => loadConversations()}
              className="flex-1"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Welcome to AI Chat</h3>
              <p className="mb-6">Select a conversation or start a new one to begin chatting</p>
              <Button
                onClick={handleCreateConversation}
                isLoading={isCreatingConversation}
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
