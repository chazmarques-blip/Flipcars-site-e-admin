'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Car, Calendar, FileText, Shield } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import { createLeadSchema, CreateLeadFormData } from '@/lib/validation/lead.schemas';
import { leadService } from '@/lib/api/lead.service';
import { Lead } from '@/types/lead';
import toast from 'react-hot-toast';

export interface LeadFormProps {
  lead?: Lead;
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const router = useRouter();
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      accidentDate: '',
      accidentDescription: '',
      hasInsurance: false,
      insuranceCompany: '',
      insurancePolicyNumber: '',
      source: '',
    },
  });

  const hasInsurance = watch('hasInsurance');

  useEffect(() => {
    if (lead) {
      setValue('name', lead.name);
      setValue('email', lead.email);
      setValue('phone', lead.phone);
      setValue('vehicleMake', lead.vehicleMake || '');
      setValue('vehicleModel', lead.vehicleModel || '');
      setValue('vehicleYear', lead.vehicleYear || '');
      setValue('vehiclePlate', lead.vehiclePlate || '');
      setValue('accidentDate', lead.accidentDate || '');
      setValue('accidentDescription', lead.accidentDescription || '');
      setValue('hasInsurance', lead.hasInsurance);
      setValue('insuranceCompany', lead.insuranceCompany || '');
      setValue('insurancePolicyNumber', lead.insurancePolicyNumber || '');
      setValue('source', lead.source || '');
    }
  }, [lead, setValue]);

  const onSubmit = async (data: CreateLeadFormData) => {
    try {
      let result: Lead;
      
      if (isEditMode && lead) {
        result = await leadService.updateLead(lead.id, data);
        toast.success('Lead updated successfully!');
      } else {
        result = await leadService.createLead(data);
        toast.success('Lead created successfully!');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/dashboard/leads/${result.id}`);
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} lead`;
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader
          title="Customer Information"
          subtitle="Contact details of the customer"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register('name')}
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              {...register('email')}
              type="email"
              label="Email Address"
              placeholder="john@example.com"
              error={errors.email?.message}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              {...register('phone')}
              type="tel"
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              leftIcon={<Phone className="w-5 h-5" />}
              required
            />

            <Input
              {...register('source')}
              label="Lead Source"
              placeholder="e.g., Website, Referral, Social Media"
              error={errors.source?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader
          title="Vehicle Information"
          subtitle="Details about the damaged vehicle"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register('vehicleMake')}
              label="Make"
              placeholder="Tesla, BMW, Toyota"
              error={errors.vehicleMake?.message}
              leftIcon={<Car className="w-5 h-5" />}
            />

            <Input
              {...register('vehicleModel')}
              label="Model"
              placeholder="Model 3, X5, Camry"
              error={errors.vehicleModel?.message}
              leftIcon={<Car className="w-5 h-5" />}
            />

            <Input
              {...register('vehicleYear')}
              label="Year"
              placeholder="2023"
              error={errors.vehicleYear?.message}
              leftIcon={<Calendar className="w-5 h-5" />}
              maxLength={4}
            />

            <Input
              {...register('vehiclePlate')}
              label="License Plate"
              placeholder="ABC-1234"
              error={errors.vehiclePlate?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accident Information */}
      <Card>
        <CardHeader
          title="Accident Information"
          subtitle="Details about the incident"
        />
        <CardContent>
          <div className="space-y-6">
            <Input
              {...register('accidentDate')}
              type="date"
              label="Accident Date"
              error={errors.accidentDate?.message}
              leftIcon={<Calendar className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accident Description
              </label>
              <textarea
                {...register('accidentDescription')}
                rows={4}
                placeholder="Describe what happened..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.accidentDescription && (
                <p className="mt-1 text-sm text-danger">
                  {errors.accidentDescription.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader
          title="Insurance Information"
          subtitle="Insurance coverage details"
        />
        <CardContent>
          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('hasInsurance')}
                type="checkbox"
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Customer has insurance coverage
              </span>
            </label>

            {hasInsurance && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <Input
                  {...register('insuranceCompany')}
                  label="Insurance Company"
                  placeholder="State Farm, Geico, etc."
                  error={errors.insuranceCompany?.message}
                  leftIcon={<Shield className="w-5 h-5" />}
                />

                <Input
                  {...register('insurancePolicyNumber')}
                  label="Policy Number"
                  placeholder="Policy #"
                  error={errors.insurancePolicyNumber?.message}
                  leftIcon={<FileText className="w-5 h-5" />}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
