'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Download, Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

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
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [zoomLevels, setZoomLevels] = useState<{[key: number]: number}>({});
  const [photoOrientations, setPhotoOrientations] = useState<PhotoOrientation>({});

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

  // Determine how many photos to show based on orientation
  const getPhotosPerView = () => {
    const firstOrientation = photoOrientations[startIndex];
    return firstOrientation === 'portrait' ? 3 : 2;
  };

  const photosPerView = getPhotosPerView();
  const visiblePhotos = photos.slice(startIndex, startIndex + photosPerView);
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex + photosPerView < photos.length;

  const goToNext = () => {
    if (canGoNext) {
      setStartIndex(prev => prev + photosPerView);
      setZoomLevels({}); // Reset all zooms
    }
  };

  const goToPrevious = () => {
    if (canGoPrevious) {
      setStartIndex(prev => Math.max(0, prev - photosPerView));
      setZoomLevels({}); // Reset all zooms
    }
  };

  const handleZoomIn = (photoIndex: number) => {
    setZoomLevels(prev => ({
      ...prev,
      [photoIndex]: Math.min((prev[photoIndex] || 1) + 0.25, 3)
    }));
  };

  const handleZoomOut = (photoIndex: number) => {
    setZoomLevels(prev => ({
      ...prev,
      [photoIndex]: Math.max((prev[photoIndex] || 1) - 0.25, 0.5)
    }));
  };

  const resetZoom = (photoIndex: number) => {
    setZoomLevels(prev => ({
      ...prev,
      [photoIndex]: 1
    }));
  };

  const getZoom = (photoIndex: number) => zoomLevels[photoIndex] || 1;

  // Keyboard navigation
  useEffect(() => {
    if (photos.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startIndex, photos.length, photosPerView, canGoNext, canGoPrevious]);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
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
        <div className="space-y-2">
          {/* Main Photo Viewer - Fixed Grid with Individual Zoom */}
          <div className="relative bg-[#1a1d2e] rounded-lg p-3" style={{ height: '400px' }}>
            {/* Photos Grid - Each photo in its own fixed container */}
            <div className="h-full flex gap-3">
              {visiblePhotos.map((photoUrl, idx) => {
                const absoluteIndex = startIndex + idx;
                const currentZoom = getZoom(absoluteIndex);
                
                return (
                  <div 
                    key={absoluteIndex}
                    className="relative flex-1 bg-[#0f1117] rounded-lg border border-gray-700 overflow-hidden"
                    style={{ position: 'relative' }}
                  >
                    {/* Scrollable container for zoomed image */}
                    <div 
                      className="absolute inset-0 overflow-auto"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#4a5568 transparent'
                      }}
                    >
                      <div 
                        className="w-full h-full flex items-center justify-center p-2"
                        style={{
                          minWidth: '100%',
                          minHeight: '100%'
                        }}
                      >
                        <img
                          src={photoUrl}
                          alt={`Photo ${absoluteIndex + 1}`}
                          className="transition-transform duration-200"
                          style={{ 
                            transform: `scale(${currentZoom})`,
                            transformOrigin: 'center center',
                            maxWidth: currentZoom === 1 ? '100%' : 'none',
                            maxHeight: currentZoom === 1 ? '100%' : 'none',
                            width: currentZoom > 1 ? `${currentZoom * 100}%` : 'auto',
                            height: currentZoom > 1 ? `${currentZoom * 100}%` : 'auto',
                            objectFit: 'contain',
                            cursor: currentZoom > 1 ? 'grab' : 'default'
                          }}
                        />
                      </div>
                    </div>

                    {/* Photo Number Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-80 text-white text-xs font-semibold rounded z-10 border border-gray-700">
                      #{absoluteIndex + 1}
                    </div>

                    {/* Individual Zoom Controls */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-80 rounded-lg p-1.5 z-10 border border-gray-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomOut(absoluteIndex);
                        }}
                        disabled={currentZoom <= 0.5}
                        className="p-1.5 hover:bg-gold hover:text-black rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                        title="Zoom Out (-)"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetZoom(absoluteIndex);
                        }}
                        className="px-2 py-1 hover:bg-gold hover:text-black rounded text-white text-xs font-semibold min-w-[45px] text-center transition-all"
                        title="Reset Zoom (Click)"
                      >
                        {Math.round(currentZoom * 100)}%
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoomIn(absoluteIndex);
                        }}
                        disabled={currentZoom >= 3}
                        className="p-1.5 hover:bg-gold hover:text-black rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                        title="Zoom In (+)"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Zoom Hint - Only at 100% */}
                    {currentZoom === 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black bg-opacity-70 text-white text-xs rounded-lg pointer-events-none border border-gray-600">
                        🔍 Click + to zoom
                      </div>
                    )}

                    {/* Scrollable Hint - When zoomed */}
                    {currentZoom > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gold bg-opacity-90 text-black text-xs font-medium rounded-lg pointer-events-none">
                        Scroll to move
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows - Outside the photo grid */}
            {canGoPrevious && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 p-2.5 bg-black bg-opacity-90 hover:bg-gold hover:text-black rounded-full transition-all z-30 shadow-xl border-2 border-gray-700"
                title="Previous Photos (← Arrow Key)"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {canGoNext && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 bg-black bg-opacity-90 hover:bg-gold hover:text-black rounded-full transition-all z-30 shadow-xl border-2 border-gray-700"
                title="Next Photos (→ Arrow Key)"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-black bg-opacity-90 text-white text-sm font-semibold rounded-lg z-20 border border-gray-700">
              Photos {startIndex + 1}–{Math.min(startIndex + photosPerView, photos.length)} of {photos.length}
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(photos[startIndex])}
              className="absolute bottom-3 right-3 p-2.5 bg-black bg-opacity-90 hover:bg-gold text-white hover:text-black rounded-lg transition-all z-20 border border-gray-700 shadow-lg"
              title="Download First Visible Photo"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Grid - Below Main Viewer */}
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {photos.map((photoUrl, index) => (
              <button
                key={index}
                onClick={() => {
                  setStartIndex(index);
                  setZoomLevels({});
                }}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index >= startIndex && index < startIndex + photosPerView
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
