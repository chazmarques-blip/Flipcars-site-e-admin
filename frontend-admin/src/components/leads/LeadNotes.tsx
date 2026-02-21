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
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
        <span className="text-xs text-gray-500">({notes.length})</span>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3 h-3" />
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No notes yet.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-2 space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {note.createdBy}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {formatDistanceToNow(new Date(note.createdAt), { 
                        addSuffix: true 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-wrap pl-7">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
