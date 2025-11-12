'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Check } from 'lucide-react';
import { EstimateRequest } from '@/types/estimate';
import { Button } from '@/components/ui/Button';

// Warranty coverage categories (in English as requested)
const WARRANTY_CATEGORIES = [
  { id: 'engine', label: 'Engine', icon: '🔧' },
  { id: 'transmission', label: 'Transmission', icon: '⚙️' },
  { id: 'electrical', label: 'Electrical System', icon: '⚡' },
  { id: 'cooling', label: 'Cooling System', icon: '❄️' },
  { id: 'fuel', label: 'Fuel System', icon: '⛽' },
  { id: 'steering', label: 'Steering', icon: '🎯' },
  { id: 'suspension', label: 'Suspension', icon: '🛞' },
  { id: 'brakes', label: 'Brakes', icon: '🛑' },
  { id: 'ac', label: 'A/C System', icon: '🌬️' },
  { id: 'other', label: 'Other (describe below)', icon: '📝' },
] as const;

const warrantyDocsSchema = z.object({
  policyDocument: z.any().optional(),
  vinPhoto: z.any().optional(),
  odometerPhoto: z.any().optional(),
  selectedIssues: z.array(z.string()).min(1, 'Please select at least one issue'),
  symptomsDescription: z.string().min(10, 'Please describe the symptoms (min 10 characters)'),
});

type WarrantyDocsFormData = z.infer<typeof warrantyDocsSchema>;

interface Step2bWarrantyDocsProps {
  initialData: Partial<EstimateRequest>;
  onNext: (data: Partial<EstimateRequest>) => void;
  onBack: () => void;
}

export function Step2bWarrantyDocs({ initialData, onNext, onBack }: Step2bWarrantyDocsProps) {
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [vinFile, setVinFile] = useState<File | null>(null);
  const [odometerFile, setOdometerFile] = useState<File | null>(null);
  const [policyUrl, setPolicyUrl] = useState<string | null>(null);
  const [vinUrl, setVinUrl] = useState<string | null>(null);
  const [odometerUrl, setOdometerUrl] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    (initialData.warrantyDocs?.selectedIssues as string[]) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<WarrantyDocsFormData>({
    resolver: zodResolver(warrantyDocsSchema),
    mode: 'onChange',
    defaultValues: {
      selectedIssues: (initialData.warrantyDocs?.selectedIssues as string[]) || [],
      symptomsDescription: initialData.warrantyDocs?.symptomsDescription || '',
    },
  });

  const symptomsDescription = watch('symptomsDescription');

  // Debug logging to help identify validation issues
  React.useEffect(() => {
    console.log('[Step2bWarrantyDocs] Form State:', {
      selectedIssues,
      symptomsDescriptionLength: symptomsDescription?.length || 0,
      errors,
      isValid,
    });
  }, [selectedIssues, symptomsDescription, errors, isValid]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'policy' | 'vin' | 'odometer'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`[Step2bWarrantyDocs] 📄 File selected: ${file.name} (${fileType})`);

    // Validate file type
    const validTypes = fileType === 'policy' 
      ? ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      alert(`Invalid file type. Please upload ${fileType === 'policy' ? 'PDF or image' : 'image'} file.`);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    // Upload file to server
    setUploadingFile(fileType);
    setUploadError('');

    try {
      console.log(`[Step2bWarrantyDocs] ⬆️  Uploading ${fileType}...`);
      
      // Import upload service
      const { uploadService } = await import('@/lib/api/upload.service');
      const response = await uploadService.uploadPhoto(file);
      const photoUrl = response.data.url;
      
      console.log(`[Step2bWarrantyDocs] ✅ Upload successful: ${photoUrl}`);

      // Update state based on file type
      switch (fileType) {
        case 'policy':
          setPolicyFile(file);
          setPolicyUrl(photoUrl);
          setValue('policyDocument', file, { shouldValidate: true });
          break;
        case 'vin':
          setVinFile(file);
          setVinUrl(photoUrl);
          setValue('vinPhoto', file, { shouldValidate: true });
          break;
        case 'odometer':
          setOdometerFile(file);
          setOdometerUrl(photoUrl);
          setValue('odometerPhoto', file, { shouldValidate: true });
          break;
      }
    } catch (error) {
      console.error(`[Step2bWarrantyDocs] ❌ Upload failed:`, error);
      setUploadError(`Failed to upload ${fileType}. Please try again.`);
      
      // Clear file on error
      switch (fileType) {
        case 'policy':
          setPolicyFile(null);
          setPolicyUrl(null);
          break;
        case 'vin':
          setVinFile(null);
          setVinUrl(null);
          break;
        case 'odometer':
          setOdometerFile(null);
          setOdometerUrl(null);
          break;
      }
    } finally {
      setUploadingFile(null);
    }
  };

  const toggleIssue = (issueId: string) => {
    const newSelection = selectedIssues.includes(issueId)
      ? selectedIssues.filter(id => id !== issueId)
      : [...selectedIssues, issueId];
    
    setSelectedIssues(newSelection);
    setValue('selectedIssues', newSelection, { shouldValidate: true });
  };

  const onSubmit = (data: WarrantyDocsFormData) => {
    console.log('[Step2bWarrantyDocs] 📝 Submitting warranty docs:', {
      policyUrl,
      vinUrl,
      odometerUrl,
      selectedIssues: data.selectedIssues,
    });

    // Pass uploaded URLs instead of file objects
    onNext({
      warrantyDocs: {
        policyDocumentUrl: policyUrl,
        vinPhotoUrl: vinUrl,
        odometerPhotoUrl: odometerUrl,
        selectedIssues: data.selectedIssues,
        symptomsDescription: data.symptomsDescription,
      },
    } as any);
  };

  // Photo diagrams matching bodyshop style
  const PhotoDiagrams = {
    policy: (
      <svg viewBox="0 0 120 120" className="w-16 h-16 text-gold/30" fill="none">
        {/* Document icon */}
        <rect x="35" y="20" width="50" height="70" fill="currentColor" opacity="0.1" rx="4"/>
        <path d="M35,20 L70,20 L85,35 L85,90 L35,90 Z" fill="currentColor" opacity="0.15" />
        <path d="M70,20 L70,35 L85,35" stroke="currentColor" strokeWidth="2" fill="none"/>
        {/* Lines representing text */}
        <line x1="45" y1="45" x2="75" y2="45" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        <line x1="45" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        <line x1="45" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        <text x="60" y="105" fontSize="7" fill="currentColor" textAnchor="middle" opacity="0.6">POLICY</text>
      </svg>
    ),
    vinNumber: (
      <svg viewBox="0 0 120 100" className="w-16 h-14 text-gold/30" fill="none">
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
        <text x="60" y="75" fontSize="7" fill="currentColor" textAnchor="middle" opacity="0.6">VIN NUMBER</text>
      </svg>
    ),
    odometer: (
      <svg viewBox="0 0 120 120" className="w-16 h-16 text-gold/30" fill="none">
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
        <text x="60" y="65" fontSize="9" fontWeight="bold" fill="currentColor" textAnchor="middle">174368</text>
        {/* Label */}
        <text x="60" y="95" fontSize="6" fill="currentColor" textAnchor="middle" opacity="0.6">MILEAGE</text>
      </svg>
    ),
  };

  // Upload card component for consistency
  const UploadCard = ({ 
    title, 
    diagram, 
    file, 
    fileType,
    accept 
  }: { 
    title: string; 
    diagram: React.ReactNode; 
    file: File | null;
    fileType: 'policy' | 'vin' | 'odometer';
    accept: string;
  }) => {
    const isUploading = uploadingFile === fileType;
    
    return (
      <div className="space-y-1">
        <label className={`relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors bg-white overflow-hidden ${
          isUploading 
            ? 'border-gold bg-gold/5 cursor-wait' 
            : file 
            ? 'border-green-500 bg-green-50 cursor-default'
            : 'border-neutral-200 cursor-pointer hover:border-gold hover:bg-gold/5'
        }`}>
          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <div className="w-6 h-6 border-3 border-gold border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[10px] text-neutral-600 font-medium">Uploading...</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <Check className="w-6 h-6 text-green-600 mb-1" />
              <p className="text-[10px] text-green-600 font-medium truncate max-w-full px-2">{file.name}</p>
              <p className="text-[9px] text-green-600 mt-0.5">✓ Uploaded</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              {diagram}
              <p className="text-[10px] text-neutral-600 font-medium mt-1">{title}</p>
              <p className="text-gold text-[9px] mt-0.5">Required</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => handleFileChange(e, fileType)}
            disabled={isUploading}
          />
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-black">Warranty Documents</h3>
        <p className="text-[10px] text-neutral-600">
          Upload documents to help us verify your warranty coverage
        </p>
      </div>

      {/* 3 Upload Cards in Grid - Similar to Bodyshop Photos */}
      <div className="grid grid-cols-3 gap-2">
        <UploadCard
          title="Policy Document"
          diagram={PhotoDiagrams.policy}
          file={policyFile}
          fileType="policy"
          accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
        />
        <UploadCard
          title="VIN Number"
          diagram={PhotoDiagrams.vinNumber}
          file={vinFile}
          fileType="vin"
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />
        <UploadCard
          title="Odometer"
          diagram={PhotoDiagrams.odometer}
          file={odometerFile}
          fileType="odometer"
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />
      </div>

      {/* Upload Error Message */}
      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-red-900 font-medium">Upload Error</p>
            <p className="text-[9px] text-red-800 mt-0.5">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Issue Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Select Issue Type <span className="text-gold">*</span>
        </label>
        <p className="text-[10px] text-neutral-600">Check all that apply</p>
        
        <div className="grid grid-cols-2 gap-2">
          {WARRANTY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleIssue(category.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 text-[11px] border rounded-lg transition-all ${
                selectedIssues.includes(category.id)
                  ? 'border-gold bg-gold/10 text-black font-medium'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-gold hover:bg-gold/5'
              }`}
            >
              <span 
                className="text-sm flex-shrink-0"
                style={{ 
                  filter: selectedIssues.includes(category.id) 
                    ? 'drop-shadow(0 0 2px #D4AF37)' 
                    : 'none' 
                }}
              >
                {category.icon}
              </span>
              <span className="flex-1 text-left leading-tight">{category.label}</span>
              {selectedIssues.includes(category.id) && (
                <Check className="w-3 h-3 text-gold flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
        
        {errors.selectedIssues && (
          <p className="text-[10px] text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.selectedIssues.message}
          </p>
        )}
      </div>

      {/* Symptoms Description */}
      <div className="space-y-1.5">
        <label htmlFor="symptomsDescription" className="block text-sm font-medium text-black">
          Describe the Symptoms <span className="text-gold">*</span>
        </label>
        <p className="text-[10px] text-neutral-600">
          What are you experiencing with your vehicle? (Required - minimum 10 characters)
        </p>
        <textarea
          id="symptomsDescription"
          {...register('symptomsDescription')}
          rows={4}
          placeholder="Example: Engine makes knocking sound when accelerating, especially when cold. The sound gets louder as I speed up..."
          className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-600 border-2 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors resize-none ${
            errors.symptomsDescription 
              ? 'border-red-500 bg-red-50' 
              : symptomsDescription && symptomsDescription.length >= 10
              ? 'border-green-500 bg-green-50'
              : 'border-neutral-300'
          }`}
        />
        <div className="flex justify-between items-center">
          <div>
            {errors.symptomsDescription && (
              <p className="text-[10px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.symptomsDescription.message}
              </p>
            )}
            {!errors.symptomsDescription && symptomsDescription && symptomsDescription.length >= 10 && (
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Looks good!
              </p>
            )}
          </div>
          <p className={`text-[9px] font-medium ${
            symptomsDescription && symptomsDescription.length >= 10 
              ? 'text-green-600' 
              : symptomsDescription && symptomsDescription.length > 0
              ? 'text-amber-600'
              : 'text-neutral-500'
          }`}>
            {symptomsDescription?.length || 0}/10 characters
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] text-amber-900 font-medium">Important</p>
          <p className="text-[9px] text-amber-800 mt-0.5 leading-tight">
            These documents help us verify warranty coverage and expedite service. All uploads are optional but recommended.
          </p>
        </div>
      </div>

      {/* Validation Summary - Show when form is not valid */}
      {!isValid && (selectedIssues.length > 0 || symptomsDescription) && (
        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-red-900 font-medium">Please complete all required fields:</p>
            <ul className="text-[9px] text-red-800 mt-1 space-y-0.5 list-disc list-inside">
              {selectedIssues.length === 0 && <li>Select at least one issue type</li>}
              {(!symptomsDescription || symptomsDescription.length < 10) && (
                <li>Describe symptoms (minimum 10 characters{symptomsDescription ? `, ${symptomsDescription.length}/10 so far` : ''})</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:relative md:border-0 md:p-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-black text-black hover:bg-black hover:text-white py-2 text-xs"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid}
          title={!isValid ? 'Please complete all required fields above' : 'Continue to next step'}
        >
          Continue →
        </Button>
      </div>
    </form>
  );
}
