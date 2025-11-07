'use client';

import React, { useState } from 'react';
import { Car, Loader2 } from 'lucide-react';
import { EstimateRequest, VehicleInfo } from '@/types/estimate';
import { Button } from '@/components/ui/Button';

interface Step3aVINProps {
  initialData: Partial<EstimateRequest>;
  onNext: (data: Partial<EstimateRequest>) => void;
  onBack: () => void;
}

export function Step3aVIN({ initialData, onNext, onBack }: Step3aVINProps) {
  const [vin, setVin] = useState(initialData.vehicle?.vin || '');
  const [isDecoding, setIsDecoding] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(initialData.vehicle || null);
  const [error, setError] = useState('');

  const validateVIN = (value: string): boolean => {
    // VIN must be exactly 17 characters, alphanumeric (no I, O, Q)
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
    return vinPattern.test(value);
  };

  const decodeVIN = async (vinNumber: string) => {
    setIsDecoding(true);
    setError('');

    try {
      // Call NHTSA API to decode VIN
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinNumber}?format=json`
      );
      const data = await response.json();

      if (data.Results && data.Results[0]) {
        const result = data.Results[0];
        
        if (result.ErrorCode === '0' || result.Make) {
          const vehicleData: VehicleInfo = {
            vin: vinNumber.toUpperCase(),
            year: result.ModelYear || '',
            make: result.Make || '',
            model: result.Model || '',
          };
          
          setVehicle(vehicleData);
          console.log('[VIN Decode] Success:', vehicleData);
        } else {
          throw new Error('VIN not found or invalid');
        }
      } else {
        throw new Error('Failed to decode VIN');
      }
    } catch (err) {
      console.error('[VIN Decode] Error:', err);
      setError('Could not decode VIN. Please verify and continue manually.');
      
      // Allow manual continue with just VIN
      const vehicleData: VehicleInfo = {
        vin: vinNumber.toUpperCase(),
      };
      setVehicle(vehicleData);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleVINChange = (value: string) => {
    // Remove spaces and convert to uppercase
    const cleanValue = value.replace(/\s/g, '').toUpperCase();
    setVin(cleanValue);
    setError('');
    
    // Auto-decode when VIN is 17 characters
    if (cleanValue.length === 17 && validateVIN(cleanValue)) {
      decodeVIN(cleanValue);
    } else if (cleanValue.length > 17) {
      setError('VIN must be exactly 17 characters');
    }
  };

  const handleManualEntry = () => {
    if (!vin || vin.length !== 17) {
      setError('Please enter a valid 17-character VIN');
      return;
    }

    if (!validateVIN(vin)) {
      setError('Invalid VIN format. VIN cannot contain I, O, or Q');
      return;
    }

    // Allow continue even if decode failed
    if (!vehicle) {
      const vehicleData: VehicleInfo = {
        vin: vin.toUpperCase(),
      };
      setVehicle(vehicleData);
    }

    handleContinue();
  };

  const handleContinue = () => {
    if (!vehicle) {
      setError('Please enter VIN number');
      return;
    }

    onNext({ vehicle });
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-black flex items-center gap-2">
          <Car className="w-5 h-5 text-gold" />
          Vehicle Information
        </h3>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Enter your VIN number to automatically identify your vehicle
        </p>
      </div>

      {/* VIN Input */}
      <div className="space-y-2">
        <label htmlFor="vin" className="block text-sm font-medium text-black">
          VIN Number <span className="text-gold">*</span>
        </label>
        <input
          id="vin"
          type="text"
          value={vin}
          onChange={(e) => handleVINChange(e.target.value)}
          placeholder="Enter 17-character VIN"
          maxLength={17}
          className={`w-full px-3 py-1.5 text-xs font-mono uppercase border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
            error ? 'border-red-500' : 'border-neutral-300'
          }`}
          disabled={isDecoding}
        />
        <p className="text-xs text-neutral-500">
          {vin.length}/17 characters
        </p>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>

      {/* Decoding Status */}
      {isDecoding && (
        <div className="flex items-center gap-2 p-3 bg-gold/10 border border-gold/30 rounded-lg">
          <Loader2 className="w-4 h-4 text-gold animate-spin" />
          <span className="text-sm text-black">Decoding VIN...</span>
        </div>
      )}

      {/* Vehicle Info Display */}
      {vehicle && !isDecoding && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <h4 className="text-sm font-semibold text-green-900 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Vehicle Identified
          </h4>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-neutral-600 font-medium">VIN:</dt>
              <dd className="text-black font-mono">{vehicle.vin}</dd>
            </div>
            {vehicle.year && (
              <div>
                <dt className="text-neutral-600 font-medium">Year:</dt>
                <dd className="text-black">{vehicle.year}</dd>
              </div>
            )}
            {vehicle.make && (
              <div>
                <dt className="text-neutral-600 font-medium">Make:</dt>
                <dd className="text-black">{vehicle.make}</dd>
              </div>
            )}
            {vehicle.model && (
              <div>
                <dt className="text-neutral-600 font-medium">Model:</dt>
                <dd className="text-black">{vehicle.model}</dd>
              </div>
            )}
          </dl>
          {(!vehicle.year || !vehicle.make || !vehicle.model) && (
            <p className="text-xs text-amber-700 mt-2">
              ⚠️ Some vehicle details couldn't be determined. We'll confirm with you later.
            </p>
          )}
        </div>
      )}

      {/* VIN Location Help */}
      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
        <h4 className="text-xs font-semibold text-black mb-1.5">Where to find your VIN:</h4>
        <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
          <li>Dashboard (visible through windshield)</li>
          <li>Driver's side door jamb</li>
          <li>Vehicle registration or insurance card</li>
        </ul>
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
          onClick={vehicle ? handleContinue : handleManualEntry}
          disabled={isDecoding || !vin || vin.length !== 17}
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-1.5 text-xs"
        >
          {vehicle ? 'Continue →' : 'Verify VIN'}
        </Button>
      </div>
    </div>
  );
}
