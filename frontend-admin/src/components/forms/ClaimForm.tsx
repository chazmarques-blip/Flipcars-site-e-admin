'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Car,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  Shield,
  DollarSign,
} from 'lucide-react';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import { createClaimSchema, CreateClaimFormData } from '@/lib/validation/claim.schemas';
import { claimService } from '@/lib/api/claim.service';
import { Claim, DamageType } from '@/types/claim';
import toast from 'react-hot-toast';

export interface ClaimFormProps {
  claim?: Claim;
  onSuccess?: (claim: Claim) => void;
  onCancel?: () => void;
}

export function ClaimForm({ claim, onSuccess, onCancel }: ClaimFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!claim;
  const customerId = searchParams?.get('customerId') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateClaimFormData>({
    resolver: zodResolver(createClaimSchema),
    defaultValues: {
      customerId: customerId || '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      vehicleVin: '',
      incidentDate: '',
      incidentLocation: '',
      incidentDescription: '',
      damageType: DamageType.COLLISION,
      damageDescription: '',
      policeReportNumber: '',
      estimatedAmount: undefined,
      insuranceCompany: '',
      insurancePolicyNumber: '',
      insuranceClaimNumber: '',
    },
  });

  useEffect(() => {
    if (claim) {
      setValue('customerId', claim.customerId);
      setValue('vehicleMake', claim.vehicleMake || '');
      setValue('vehicleModel', claim.vehicleModel || '');
      setValue('vehicleYear', claim.vehicleYear || '');
      setValue('vehiclePlate', claim.vehiclePlate || '');
      setValue('vehicleVin', claim.vehicleVin || '');
      setValue('incidentDate', claim.incidentDate.split('T')[0]);
      setValue('incidentLocation', claim.incidentLocation || '');
      setValue('incidentDescription', claim.incidentDescription);
      setValue('damageType', claim.damageType);
      setValue('damageDescription', claim.damageDescription || '');
      setValue('policeReportNumber', claim.policeReportNumber || '');
      setValue('estimatedAmount', claim.estimatedAmount);
      setValue('insuranceCompany', claim.insuranceCompany || '');
      setValue('insurancePolicyNumber', claim.insurancePolicyNumber || '');
      setValue('insuranceClaimNumber', claim.insuranceClaimNumber || '');
    }
  }, [claim, setValue]);

  const onSubmit = async (data: CreateClaimFormData) => {
    try {
      let result: Claim;
      
      if (isEditMode && claim) {
        result = await claimService.updateClaim(claim.id, data);
        toast.success('Claim updated successfully!');
      } else {
        result = await claimService.createClaim(data);
        toast.success('Claim created successfully!');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/dashboard/claims/${result.id}`);
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} claim`;
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
          subtitle="Link this claim to a customer"
        />
        <CardContent>
          <Input
            {...register('customerId')}
            label="Customer ID"
            placeholder="Enter customer UUID"
            error={errors.customerId?.message}
            leftIcon={<User className="w-5 h-5" />}
            required
            helperText={customerId ? 'Customer pre-selected from URL' : 'You can find customer IDs in the Customers page'}
          />
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

            <Input
              {...register('vehicleVin')}
              label="VIN (Optional)"
              placeholder="17-character VIN"
              error={errors.vehicleVin?.message}
              maxLength={17}
            />
          </div>
        </CardContent>
      </Card>

      {/* Incident Information */}
      <Card>
        <CardHeader
          title="Incident Information"
          subtitle="Details about the accident or damage"
        />
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('incidentDate')}
                type="date"
                label="Incident Date"
                error={errors.incidentDate?.message}
                leftIcon={<Calendar className="w-5 h-5" />}
                required
              />

              <Input
                {...register('incidentLocation')}
                label="Incident Location"
                placeholder="City, State or Address"
                error={errors.incidentLocation?.message}
                leftIcon={<MapPin className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Damage Type <span className="text-danger">*</span>
              </label>
              <select
                {...register('damageType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={DamageType.COLLISION}>Collision</option>
                <option value={DamageType.THEFT}>Theft</option>
                <option value={DamageType.VANDALISM}>Vandalism</option>
                <option value={DamageType.NATURAL_DISASTER}>Natural Disaster</option>
                <option value={DamageType.FIRE}>Fire</option>
                <option value={DamageType.GLASS_DAMAGE}>Glass Damage</option>
                <option value={DamageType.MECHANICAL}>Mechanical</option>
                <option value={DamageType.OTHER}>Other</option>
              </select>
              {errors.damageType && (
                <p className="mt-1 text-sm text-danger">{errors.damageType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Description <span className="text-danger">*</span>
              </label>
              <textarea
                {...register('incidentDescription')}
                rows={4}
                placeholder="Describe what happened in detail..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.incidentDescription && (
                <p className="mt-1 text-sm text-danger">
                  {errors.incidentDescription.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Damage Description
              </label>
              <textarea
                {...register('damageDescription')}
                rows={3}
                placeholder="Describe the damage to the vehicle..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.damageDescription && (
                <p className="mt-1 text-sm text-danger">
                  {errors.damageDescription.message}
                </p>
              )}
            </div>

            <Input
              {...register('policeReportNumber')}
              label="Police Report Number (if applicable)"
              placeholder="Report #"
              error={errors.policeReportNumber?.message}
              leftIcon={<AlertCircle className="w-5 h-5" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader
          title="Financial Information"
          subtitle="Estimated repair costs"
        />
        <CardContent>
          <Input
            {...register('estimatedAmount', {
              setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
            })}
            type="number"
            step="0.01"
            label="Estimated Repair Amount"
            placeholder="0.00"
            error={errors.estimatedAmount?.message}
            leftIcon={<DollarSign className="w-5 h-5" />}
            helperText="Enter the estimated cost of repairs (optional)"
          />
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader
          title="Insurance Information"
          subtitle="Insurance coverage details (if applicable)"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Input
              {...register('insuranceClaimNumber')}
              label="Insurance Claim Number"
              placeholder="Claim # from insurance company"
              error={errors.insuranceClaimNumber?.message}
              leftIcon={<FileText className="w-5 h-5" />}
            />
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
          {isEditMode ? 'Update Claim' : 'Create Claim'}
        </Button>
      </div>
    </form>
  );
}
