'use client';

import React, { useState } from 'react';
import { LeadNote } from '@/types/lead';
import { MessageSquare, Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LeadNotesProps {
  leadId: string;
  notes: LeadNote[];
  onAddNote?: (content: string) => void;
  currentUserId?: string;
}

export const LeadNotes: React.FC<LeadNotesProps> = ({ 
  leadId, 
  notes, 
  onAddNote,
  currentUserId = '1' // Default to mock user
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onAddNote) {
        await onAddNote(newNote.trim());
      }
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <span className="text-sm text-gray-500">({notes.length})</span>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this lead..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notes yet. Add the first note to track this lead.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {note.createdBy}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(note.createdAt), { 
                        addSuffix: true 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap pl-10">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
