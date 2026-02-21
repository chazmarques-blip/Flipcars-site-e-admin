'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Download, Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface LeadPhotoGalleryProps {
  photos: string[];
  leadId: string;
  onUpload?: (files: FileList) => Promise<void>;
  readOnly?: boolean;
}

interface PhotoOrientation {
  [key: string]: 'portrait' | 'landscape' | 'square';
}

export function LeadPhotoGallery({ 
  photos = [], 
  leadId, 
  onUpload,
  readOnly = false 
}: LeadPhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const [photoOrientations, setPhotoOrientations] = useState<PhotoOrientation>({});
  const imageRef = useRef<HTMLImageElement>(null);

  // Detect photo orientation
  useEffect(() => {
    const detectOrientations = async () => {
      const orientations: PhotoOrientation = {};
      
      for (let i = 0; i < Math.min(photos.length, 3); i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const ratio = img.width / img.height;
            if (ratio > 1.2) {
              orientations[i] = 'landscape';
            } else if (ratio < 0.8) {
              orientations[i] = 'portrait';
            } else {
              orientations[i] = 'square';
            }
            resolve();
          };
          img.onerror = () => {
            orientations[i] = 'square';
            resolve();
          };
        });
      }
      
      setPhotoOrientations(orientations);
    };

    if (photos.length > 0) {
      detectOrientations();
    }
  }, [photos]);

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
      setZoom(1);
    }
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
      setZoom(1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // Keyboard navigation + zoom
  useEffect(() => {
    if (photos.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
      if (e.key === '0') resetZoom();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  // Determine layout based on first 3 photos
  const getVisiblePhotos = () => {
    if (photos.length === 0) return [];
    
    const firstOrientation = photoOrientations[0];
    
    // If first photo is portrait, show up to 3
    if (firstOrientation === 'portrait') {
      return photos.slice(0, Math.min(3, photos.length));
    }
    
    // If landscape, show up to 2
    return photos.slice(0, Math.min(2, photos.length));
  };

  const visiblePhotos = getVisiblePhotos();

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
          {/* Main Photo Viewer - Multiple Photos Side by Side */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* Photos Grid */}
            <div 
              className="absolute inset-0 p-4 flex gap-2 items-center justify-center overflow-auto"
              style={{ cursor: zoom > 1 ? 'move' : 'default' }}
            >
              {visiblePhotos.map((photoUrl, idx) => (
                <div 
                  key={idx}
                  className="relative flex items-center justify-center"
                  style={{ 
                    flex: photoOrientations[idx] === 'portrait' ? '0 0 auto' : '1 1 0',
                    maxWidth: photoOrientations[idx] === 'portrait' ? '30%' : '48%',
                    height: '100%'
                  }}
                >
                  <img
                    ref={idx === 0 ? imageRef : null}
                    src={photoUrl}
                    alt={`Photo ${idx + 1}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center'
                    }}
                  />
                  {/* Photo Number Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Only if more than visible */}
            {photos.length > visiblePhotos.length && (
              <>
                {selectedPhotoIndex > 0 && (
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all z-10"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}

                {selectedPhotoIndex + visiblePhotos.length < photos.length && (
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all z-10"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </>
            )}

            {/* Top Bar - Counter, Zoom, Download */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="px-3 py-1.5 bg-black bg-opacity-60 text-white text-sm font-medium rounded-lg">
                {visiblePhotos.length > 1 
                  ? `Photos ${selectedPhotoIndex + 1}-${selectedPhotoIndex + visiblePhotos.length} of ${photos.length}`
                  : `Photo ${selectedPhotoIndex + 1} of ${photos.length}`
                }
              </div>
              
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-black bg-opacity-60 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={resetZoom}
                    className="px-2 py-1 hover:bg-white hover:bg-opacity-10 rounded text-white text-xs font-medium transition-colors"
                    title="Reset Zoom (0)"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Download */}
                <button
                  onClick={() => handleDownload(photos[selectedPhotoIndex])}
                  className="p-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Zoom Hint */}
            {zoom === 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black bg-opacity-40 text-white text-xs rounded-lg pointer-events-none">
                Use +/- keys or buttons to zoom
              </div>
            )}
          </div>

          {/* Thumbnail Grid - Below Main Viewer */}
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {photos.map((photoUrl, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedPhotoIndex(index);
                  setZoom(1);
                }}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index >= selectedPhotoIndex && index < selectedPhotoIndex + visiblePhotos.length
                    ? 'border-gold ring-2 ring-gold ring-opacity-50 scale-105'
                    : 'border-gray-200 hover:border-gold hover:scale-105'
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
