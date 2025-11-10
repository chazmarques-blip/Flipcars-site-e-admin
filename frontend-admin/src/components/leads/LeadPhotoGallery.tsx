'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X, Download, ZoomIn, Upload } from 'lucide-react';
import Image from 'next/image';

interface LeadPhotoGalleryProps {
  photos: string[];
  leadId: string;
  onUpload?: (files: FileList) => Promise<void>;
  readOnly?: boolean;
}

export function LeadPhotoGallery({ 
  photos = [], 
  leadId, 
  onUpload,
  readOnly = false 
}: LeadPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !onUpload) return;

    try {
      setIsUploading(true);
      await onUpload(files);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (photoUrl: string) => {
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead-${leadId}-photo-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading photo:', error);
      alert('Failed to download photo. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Damage Photos ({photos.length})
        </h3>
        {!readOnly && onUpload && (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload Photos'}
            </div>
          </label>
        )}
      </div>

      {/* Gallery Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No photos uploaded yet</p>
          {!readOnly && onUpload && (
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-blue-600 hover:underline">
                Click to upload photos
              </span>
            </label>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photoUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
            >
              <Image
                src={photoUrl}
                alt={`Damage photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedPhoto(photoUrl)}
                  className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  title="View full size"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDownload(photoUrl)}
                  className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedPhoto}
              alt="Full size photo"
              fill
              className="object-contain"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Download button in lightbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(selectedPhoto);
            }}
            className="absolute bottom-4 right-4 p-3 bg-white rounded-full hover:bg-gray-100"
          >
            <Download className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
