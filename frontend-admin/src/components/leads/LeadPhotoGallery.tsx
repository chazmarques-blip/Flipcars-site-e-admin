'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
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
    if (selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (photos.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
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

      {/* Gallery */}
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
        <div className="space-y-4">
          {/* Main Photo Viewer - Always Visible */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* Current Photo */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={photos[selectedPhotoIndex]}
                alt={`Photo ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation Arrows */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all z-10"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {selectedPhotoIndex < photos.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all z-10"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Photo Counter & Download */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="px-3 py-1.5 bg-black bg-opacity-60 text-white text-sm font-medium rounded-lg">
                Photo {selectedPhotoIndex + 1} of {photos.length}
              </div>
              <button
                onClick={() => handleDownload(photos[selectedPhotoIndex])}
                className="p-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Grid - Below Main Viewer */}
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {photos.map((photoUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index === selectedPhotoIndex
                    ? 'border-blue-500 ring-2 ring-blue-400 scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                }`}
              >
                <img
                  src={photoUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Number Badge */}
                <div className="absolute top-0.5 left-0.5 px-1 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
