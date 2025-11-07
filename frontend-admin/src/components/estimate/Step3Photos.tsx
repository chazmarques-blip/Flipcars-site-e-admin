'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, X, Check } from 'lucide-react';
import { Step3PhotosFormData, step3PhotosSchema } from '@/lib/validations/estimate';
import { EstimateRequest, EstimatePhotos } from '@/types/estimate';
import { Button } from '@/components/ui/Button';
import { handlePhotoUpload, PHOTO_LABELS } from '@/lib/utils/photo';

interface Step3PhotosProps {
  initialData: Partial<EstimateRequest>;
  onNext: (data: Partial<EstimateRequest>) => void;
  onBack: () => void;
}

type RequiredPhotoKey = 'driverFront' | 'passengerFront' | 'driverRear' | 'passengerRear' | 'vinNumber' | 'odometer';
type OptionalPhotoKey = 'detail1' | 'detail2' | 'detail3' | 'detail4' | 'detail5' | 'detail6';

export function Step3Photos({ initialData, onNext, onBack }: Step3PhotosProps) {
  const [photos, setPhotos] = useState<EstimatePhotos & Record<string, string | undefined>>(
    initialData.photos || {}
  );
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [skipPhotos, setSkipPhotos] = useState<boolean>(false);

  const requiredPhotos: Array<{ key: RequiredPhotoKey; label: string }> = [
    { key: 'driverFront', label: PHOTO_LABELS.driverFront },
    { key: 'passengerFront', label: PHOTO_LABELS.passengerFront },
    { key: 'driverRear', label: PHOTO_LABELS.driverRear },
    { key: 'passengerRear', label: PHOTO_LABELS.passengerRear },
    { key: 'vinNumber', label: PHOTO_LABELS.vinNumber },
    { key: 'odometer', label: PHOTO_LABELS.odometer },
  ];

  const optionalPhotos: Array<{ key: string; label: string }> = [
    { key: 'detail1', label: PHOTO_LABELS.detail1 },
    { key: 'detail2', label: PHOTO_LABELS.detail2 },
    { key: 'detail3', label: PHOTO_LABELS.detail3 },
    { key: 'detail4', label: PHOTO_LABELS.detail4 },
    { key: 'detail5', label: PHOTO_LABELS.detail5 },
    { key: 'detail6', label: PHOTO_LABELS.detail6 },
  ];

  const handleFileChange = async (key: string, file: File | null) => {
    if (!file) return;

    setError('');
    setUploadingKey(key);

    try {
      const base64 = await handlePhotoUpload(file);
      
      if (key.startsWith('detail')) {
        // Handle optional detail photos
        const details = photos.details || [];
        const detailIndex = parseInt(key.replace('detail', '')) - 1;
        details[detailIndex] = base64;
        setPhotos((prev) => ({ ...prev, details }));
      } else {
        // Handle required photos
        setPhotos((prev) => ({ ...prev, [key]: base64 }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleRemovePhoto = (key: string) => {
    if (key.startsWith('detail')) {
      const details = photos.details || [];
      const detailIndex = parseInt(key.replace('detail', '')) - 1;
      details.splice(detailIndex, 1);
      setPhotos((prev) => ({ ...prev, details }));
    } else {
      setPhotos((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const getDetailPhoto = (index: number): string | undefined => {
    return photos.details?.[index];
  };

  const isRequiredComplete = requiredPhotos.every((photo) => photos[photo.key]);
  const requiredCount = requiredPhotos.filter((photo) => photos[photo.key]).length;
  const optionalCount = (photos.details || []).length;

  const handleContinue = () => {
    if (!skipPhotos && !isRequiredComplete) {
      setError('Please upload all 6 required photos or check "Skip photos" to continue');
      return;
    }

    // Prepare photos object without detail1, detail2, etc. keys
    const photoData: EstimatePhotos = {
      driverFront: photos.driverFront,
      passengerFront: photos.passengerFront,
      driverRear: photos.driverRear,
      passengerRear: photos.passengerRear,
      vinNumber: photos.vinNumber,
      odometer: photos.odometer,
      details: photos.details || [],
    };

    onNext({ photos: skipPhotos ? undefined : photoData });
  };

  const handleSkipPhotos = () => {
    setSkipPhotos(true);
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-black">Vehicle Photos</h3>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Please take photos of your vehicle to help us prepare an accurate estimate
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg border border-gold/30">
        <div>
          <span className="text-sm font-medium text-black">Required Photos: {requiredCount}/6</span>
          <p className="text-[10px] text-neutral-600 mt-0.5">Optional Photos: {optionalCount}/6</p>
        </div>
        {isRequiredComplete && (
          <Check className="w-5 h-5 text-green-600" />
        )}
      </div>

      {/* Skip Photos Option */}
      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={skipPhotos}
            onChange={(e) => {
              setSkipPhotos(e.target.checked);
              setError('');
            }}
            className="w-4 h-4 mt-0.5 text-gold border-neutral-300 rounded focus:ring-gold"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-amber-900">Skip photos (not recommended)</span>
            <p className="text-xs text-amber-700 mt-1">
              ⚠️ <strong>Important:</strong> Without photos, we cannot provide a pre-estimate. 
              You will need to bring your vehicle to our location for an in-person assessment 
              before receiving a quote.
            </p>
          </div>
        </label>
      </div>

      {/* Required Photos */}
      <div>
        <h4 className="text-sm font-semibold text-black mb-2">Required Photos (6)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {requiredPhotos.map((photo) => (
            <PhotoUploadBox
              key={photo.key}
              label={photo.label}
              photoUrl={photos[photo.key]}
              isUploading={uploadingKey === photo.key}
              required
              onFileChange={(file) => handleFileChange(photo.key, file)}
              onRemove={() => handleRemovePhoto(photo.key)}
            />
          ))}
        </div>
      </div>

      {/* Optional Photos */}
      <div className="pt-3 border-t border-neutral-200">
        <h4 className="text-sm font-semibold text-black mb-2">Optional Detail Photos (Up to 6)</h4>
        <p className="text-[10px] text-neutral-600 mb-2">
          Add additional photos to show specific damage details
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {optionalPhotos.map((photo, index) => (
            <PhotoUploadBox
              key={photo.key}
              label={photo.label}
              photoUrl={getDetailPhoto(index)}
              isUploading={uploadingKey === photo.key}
              required={false}
              onFileChange={(file) => handleFileChange(photo.key, file)}
              onRemove={() => handleRemovePhoto(photo.key)}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:relative md:border-0 md:p-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-black text-black hover:bg-black hover:text-white py-1.5 text-xs"
        >
          ← Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleContinue}
          disabled={!skipPhotos && !isRequiredComplete}
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-1.5 text-xs"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}

// Professional car angle images (AI-generated in gold tone)
const PhotoDiagrams = {
  driverFront: (
    <img 
      src="/images/car-angles/driver-front-gold.jpg" 
      alt="Driver Front" 
      className="w-full h-full object-contain opacity-80"
    />
  ),
  passengerFront: (
    <img 
      src="/images/car-angles/passenger-front-gold.jpg" 
      alt="Passenger Front" 
      className="w-full h-full object-contain opacity-80"
    />
  ),
  driverRear: (
    <img 
      src="/images/car-angles/driver-rear-gold.jpg" 
      alt="Driver Rear" 
      className="w-full h-full object-contain opacity-80"
    />
  ),
  passengerRear: (
    <img 
      src="/images/car-angles/passenger-rear-gold.jpg" 
      alt="Passenger Rear" 
      className="w-full h-full object-contain opacity-80"
    />
  ),
  vinNumber: (
    <svg viewBox="0 0 120 100" className="w-20 h-16 text-gold/30" fill="none">
      {/* VIN Barcode style */}
      <rect x="20" y="35" width="80" height="30" fill="currentColor" opacity="0.1" rx="4"/>
      {/* Barcode lines */}
      <line x1="25" y1="40" x2="25" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="40" x2="30" y2="60" stroke="currentColor" strokeWidth="1"/>
      <line x1="35" y1="40" x2="35" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="40" x2="40" y2="60" stroke="currentColor" strokeWidth="1"/>
      <line x1="45" y1="40" x2="45" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="52" y1="40" x2="52" y2="60" stroke="currentColor" strokeWidth="3"/>
      <line x1="58" y1="40" x2="58" y2="60" stroke="currentColor" strokeWidth="1"/>
      <line x1="63" y1="40" x2="63" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="68" y1="40" x2="68" y2="60" stroke="currentColor" strokeWidth="1"/>
      <line x1="73" y1="40" x2="73" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="80" y1="40" x2="80" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="85" y1="40" x2="85" y2="60" stroke="currentColor" strokeWidth="1"/>
      <line x1="90" y1="40" x2="90" y2="60" stroke="currentColor" strokeWidth="2"/>
      <line x1="95" y1="40" x2="95" y2="60" stroke="currentColor" strokeWidth="1"/>
      {/* Text */}
      <text x="60" y="75" fontSize="8" fill="currentColor" textAnchor="middle" opacity="0.6">VIN NUMBER</text>
    </svg>
  ),
  odometer: (
    <svg viewBox="0 0 120 120" className="w-20 h-20 text-gold/30" fill="none">
      {/* Odometer circle */}
      <circle cx="60" cy="60" r="35" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
      {/* Gauge marks */}
      <path d="M60,30 L60,35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M85,45 L81,47" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M90,60 L85,60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M85,75 L81,73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M35,45 L39,47" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30,60 L35,60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M35,75 L39,73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Digital display */}
      <rect x="42" y="55" width="36" height="14" fill="#D4AF37" opacity="0.2" rx="2"/>
      <text x="60" y="65" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">174368</text>
      {/* Label */}
      <text x="60" y="95" fontSize="7" fill="currentColor" textAnchor="middle" opacity="0.6">MILEAGE</text>
    </svg>
  ),
};

function getPhotoDiagram(label: string) {
  if (label.includes('Driver Front')) return PhotoDiagrams.driverFront;
  if (label.includes('Passenger Front')) return PhotoDiagrams.passengerFront;
  if (label.includes('Driver Rear')) return PhotoDiagrams.driverRear;
  if (label.includes('Passenger Rear')) return PhotoDiagrams.passengerRear;
  if (label.includes('VIN')) return PhotoDiagrams.vinNumber;
  if (label.includes('Odometer')) return PhotoDiagrams.odometer;
  return null;
}

interface PhotoUploadBoxProps {
  label: string;
  photoUrl?: string;
  isUploading: boolean;
  required: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}

function PhotoUploadBox({ label, photoUrl, isUploading, required, onFileChange, onRemove }: PhotoUploadBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const diagram = getPhotoDiagram(label);

  const handleClick = () => {
    if (!photoUrl && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className={`relative w-full aspect-square border-2 border-dashed rounded-lg overflow-hidden transition-all ${
          photoUrl
            ? 'border-green-500 bg-green-50'
            : isUploading
            ? 'border-gold bg-gold/5'
            : 'border-neutral-300 hover:border-gold bg-white'
        }`}
      >
        {photoUrl ? (
          <>
            <img src={photoUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-6 h-6 border-3 border-gold border-t-transparent rounded-full animate-spin mb-1.5" />
            <span className="text-[10px] text-neutral-600">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-2">
            {diagram ? (
              <div className="mb-1">{diagram}</div>
            ) : (
              <Camera className="w-7 h-7 text-neutral-400 mb-1.5" />
            )}
            <span className="text-xs text-center text-neutral-700 font-medium leading-tight">{label}</span>
            {required && <span className="text-xs text-gold mt-1">Required</span>}
          </div>
        )}
      </button>
      
      {photoUrl && (
        <div className="absolute -top-1.5 -right-1.5">
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-md">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
