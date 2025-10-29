'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Building2, FileText, Globe } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import { createCustomerSchema, CreateCustomerFormData } from '@/lib/validation/customer.schemas';
import { customerService } from '@/lib/api/customer.service';
import { Customer, CustomerType } from '@/types/customer';
import toast from 'react-hot-toast';

export interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: (customer: Customer) => void;
  onCancel?: () => void;
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const router = useRouter();
  const isEditMode = !!customer;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: CustomerType.INDIVIDUAL,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      businessName: '',
      taxId: '',
      preferredContactMethod: undefined,
      languagePreference: '',
    },
  });

  const customerType = watch('type');

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('email', customer.email);
      setValue('phone', customer.phone);
      setValue('type', customer.type);
      setValue('address', customer.address || '');
      setValue('city', customer.city || '');
      setValue('state', customer.state || '');
      setValue('zipCode', customer.zipCode || '');
      setValue('businessName', customer.businessName || '');
      setValue('taxId', customer.taxId || '');
      setValue('preferredContactMethod', customer.preferredContactMethod);
      setValue('languagePreference', customer.languagePreference || '');
    }
  }, [customer, setValue]);

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      let result: Customer;
      
      if (isEditMode && customer) {
        result = await customerService.updateCustomer(customer.id, data);
        toast.success('Customer updated successfully!');
      } else {
        result = await customerService.createCustomer(data);
        toast.success('Customer created successfully!');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/dashboard/customers/${result.id}`);
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} customer`;
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
      {/* Basic Information */}
      <Card>
        <CardHeader
          title="Basic Information"
          subtitle="Customer contact and identification details"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Type <span className="text-danger">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={CustomerType.INDIVIDUAL}>Individual</option>
                <option value={CustomerType.BUSINESS}>Business</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-danger">{errors.type.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader
          title="Address Information"
          subtitle="Customer location details"
        />
        <CardContent>
          <div className="space-y-6">
            <Input
              {...register('address')}
              label="Street Address"
              placeholder="123 Main Street"
              error={errors.address?.message}
              leftIcon={<MapPin className="w-5 h-5" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                {...register('city')}
                label="City"
                placeholder="New York"
                error={errors.city?.message}
              />

              <Input
                {...register('state')}
                label="State"
                placeholder="NY"
                error={errors.state?.message}
              />

              <Input
                {...register('zipCode')}
                label="ZIP Code"
                placeholder="10001"
                error={errors.zipCode?.message}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information (conditional) */}
      {customerType === CustomerType.BUSINESS && (
        <Card>
          <CardHeader
            title="Business Information"
            subtitle="Additional details for business customers"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('businessName')}
                label="Business Name"
                placeholder="Acme Corporation"
                error={errors.businessName?.message}
                leftIcon={<Building2 className="w-5 h-5" />}
              />

              <Input
                {...register('taxId')}
                label="Tax ID / EIN"
                placeholder="12-3456789"
                error={errors.taxId?.message}
                leftIcon={<FileText className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      <Card>
        <CardHeader
          title="Preferences"
          subtitle="Communication and language preferences"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                {...register('preferredContactMethod')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select method</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
              </select>
              {errors.preferredContactMethod && (
                <p className="mt-1 text-sm text-danger">
                  {errors.preferredContactMethod.message}
                </p>
              )}
            </div>

            <Input
              {...register('languagePreference')}
              label="Language Preference"
              placeholder="English, Spanish, etc."
              error={errors.languagePreference?.message}
              leftIcon={<Globe className="w-5 h-5" />}
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
          {isEditMode ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}
