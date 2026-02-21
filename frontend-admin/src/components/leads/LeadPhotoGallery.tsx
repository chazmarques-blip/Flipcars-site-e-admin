'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Download, ZoomIn, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
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

  const goToNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {photos.map((photoUrl, index) => (
            <div
              key={index}
              onClick={() => setSelectedPhotoIndex(index)}
              className="relative group aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <img
                src={photoUrl}
                alt={`Damage photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with zoom icon */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3 h-3 text-gray-700" />
                </div>
              </div>
              
              {/* Photo number */}
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal with Navigation */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5" />
              <span className="text-lg font-medium">
                Photo {selectedPhotoIndex + 1} of {photos.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(photos[selectedPhotoIndex]);
                }}
                className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(null);
                }}
                className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            {/* Previous Button */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 p-3 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors z-10"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            {selectedPhotoIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 p-3 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors z-10"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="p-4 bg-black bg-opacity-50" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {photos.map((photoUrl, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(index);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    index === selectedPhotoIndex
                      ? 'border-blue-500 ring-2 ring-blue-400'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
