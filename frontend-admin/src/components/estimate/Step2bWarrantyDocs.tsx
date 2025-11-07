'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText, Camera, AlertCircle, Check } from 'lucide-react';
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'policy' | 'vin' | 'odometer'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    switch (fileType) {
      case 'policy':
        setPolicyFile(file);
        setValue('policyDocument', file, { shouldValidate: true });
        break;
      case 'vin':
        setVinFile(file);
        setValue('vinPhoto', file, { shouldValidate: true });
        break;
      case 'odometer':
        setOdometerFile(file);
        setValue('odometerPhoto', file, { shouldValidate: true });
        break;
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
    // In a real app, you would upload files to a server here
    // For now, we'll just pass the data forward
    onNext({
      warrantyDocs: {
        policyDocument: policyFile,
        vinPhoto: vinFile,
        odometerPhoto: odometerFile,
        selectedIssues: data.selectedIssues,
        symptomsDescription: data.symptomsDescription,
      },
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Policy Document Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Extended Warranty Policy
        </label>
        <p className="text-xs text-neutral-600">Upload your warranty policy document (PDF or photo)</p>
        
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {policyFile ? (
              <>
                <Check className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-xs text-green-600 font-medium">{policyFile.name}</p>
                <p className="text-[10px] text-neutral-500 mt-1">Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold">Click to upload</span> policy document
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange(e, 'policy')}
          />
        </label>
      </div>

      {/* VIN Photo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          VIN Number Photo
        </label>
        <p className="text-xs text-neutral-600">Photo of your vehicle's VIN plate</p>
        
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
          <div className="flex flex-col items-center justify-center">
            {vinFile ? (
              <>
                <Check className="w-6 h-6 text-green-600 mb-1" />
                <p className="text-xs text-green-600 font-medium">{vinFile.name}</p>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 text-neutral-400 mb-1" />
                <p className="text-xs text-neutral-600">Upload VIN photo</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange(e, 'vin')}
          />
        </label>
      </div>

      {/* Odometer Photo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Odometer Photo
        </label>
        <p className="text-xs text-neutral-600">Photo showing current mileage</p>
        
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
          <div className="flex flex-col items-center justify-center">
            {odometerFile ? (
              <>
                <Check className="w-6 h-6 text-green-600 mb-1" />
                <p className="text-xs text-green-600 font-medium">{odometerFile.name}</p>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 text-neutral-400 mb-1" />
                <p className="text-xs text-neutral-600">Upload odometer photo</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange(e, 'odometer')}
          />
        </label>
      </div>

      {/* Issue Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Select Issue Type <span className="text-gold">*</span>
        </label>
        <p className="text-xs text-neutral-600">Check all that apply</p>
        
        <div className="grid grid-cols-2 gap-2">
          {WARRANTY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleIssue(category.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-all ${
                selectedIssues.includes(category.id)
                  ? 'border-gold bg-gold/10 text-black font-medium'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-gold hover:bg-gold/5'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="flex-1 text-left">{category.label}</span>
              {selectedIssues.includes(category.id) && (
                <Check className="w-4 h-4 text-gold" />
              )}
            </button>
          ))}
        </div>
        
        {errors.selectedIssues && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.selectedIssues.message}
          </p>
        )}
      </div>

      {/* Symptoms Description */}
      <div className="space-y-2">
        <label htmlFor="symptomsDescription" className="block text-sm font-medium text-black">
          Describe the Symptoms <span className="text-gold">*</span>
        </label>
        <p className="text-xs text-neutral-600">
          Provide details about what you're experiencing with your vehicle
        </p>
        <textarea
          id="symptomsDescription"
          {...register('symptomsDescription')}
          rows={4}
          placeholder="Example: The engine makes a knocking sound when accelerating, especially noticeable when cold. The check engine light came on yesterday..."
          className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors resize-none ${
            errors.symptomsDescription ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        <div className="flex justify-between items-center">
          <div>
            {errors.symptomsDescription && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.symptomsDescription.message}
              </p>
            )}
          </div>
          <p className="text-[10px] text-neutral-500">
            {symptomsDescription?.length || 0} characters
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-amber-900 font-medium">Important</p>
          <p className="text-[10px] text-amber-800 mt-1">
            These documents help us verify your warranty coverage and expedite your service. 
            All uploads are optional but recommended for faster processing.
          </p>
        </div>
      </div>

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
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-2 text-xs"
          disabled={!isValid}
        >
          Continue →
        </Button>
      </div>
    </form>
  );
}
