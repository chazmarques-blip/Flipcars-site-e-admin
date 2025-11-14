'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera, X, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VINScannerProps {
  onVINDetected: (vin: string) => void;
  onClose: () => void;
}

export function VINScanner({ onVINDetected, onClose }: VINScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [detectedVIN, setDetectedVIN] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanAttempts, setScanAttempts] = useState(0);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'vin-scanner-region';

  // Validate VIN format
  const validateVIN = (text: string): string | null => {
    // Remove spaces and special characters
    const cleaned = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // VIN must be exactly 17 characters, alphanumeric (no I, O, Q)
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    
    if (vinPattern.test(cleaned)) {
      return cleaned;
    }
    
    // Try to find 17-character sequence within text
    const vinMatch = cleaned.match(/[A-HJ-NPR-Z0-9]{17}/);
    return vinMatch ? vinMatch[0] : null;
  };

  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    console.log('[VIN Scanner] Raw scan result:', decodedText);
    
    const vin = validateVIN(decodedText);
    
    if (vin) {
      console.log('[VIN Scanner] ✅ Valid VIN detected:', vin);
      setDetectedVIN(vin);
      setScanStatus('success');
      
      // Stop scanning
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      
      // Vibrate if supported (mobile haptic feedback)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Wait 1.5 seconds to show success, then callback
      setTimeout(() => {
        onVINDetected(vin);
        onClose();
      }, 1500);
    } else {
      // Invalid VIN format, continue scanning
      setScanAttempts((prev) => prev + 1);
      console.log('[VIN Scanner] Invalid format, attempt:', scanAttempts + 1);
    }
  };

  // Handle scan error (mostly ignorable)
  const handleScanError = (errorMessage: string) => {
    // Ignore common scanning errors (these are normal during continuous scanning)
    if (errorMessage.includes('NotFoundException') || 
        errorMessage.includes('No MultiFormat Readers')) {
      return;
    }
    console.warn('[VIN Scanner] Scan error:', errorMessage);
  };

  // Start scanner
  const startScanner = async () => {
    try {
      setIsScanning(true);
      setScanStatus('processing');
      setErrorMessage('');
      setScanAttempts(0);

      console.log('[VIN Scanner] Starting camera...');

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      console.log('[VIN Scanner] Available cameras:', devices.length);

      if (devices.length === 0) {
        throw new Error('No cameras found on this device');
      }

      // Prefer back camera (environment facing)
      const backCamera = devices.find((device) => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id;
      console.log('[VIN Scanner] Using camera:', backCamera?.label || devices[devices.length - 1].label);

      // Start scanning with optimized config
      await html5QrCode.start(
        cameraId,
        {
          fps: 10, // 10 frames per second (good balance)
          qrbox: { width: 300, height: 100 }, // Wide box for VIN
          aspectRatio: 3.0, // Wide aspect ratio for VIN
          disableFlip: false, // Allow flipping for better recognition
        },
        handleScanSuccess,
        handleScanError
      );

      console.log('[VIN Scanner] ✅ Scanner started successfully');
      
    } catch (error: any) {
      console.error('[VIN Scanner] ❌ Failed to start scanner:', error);
      setScanStatus('error');
      setErrorMessage(
        error.message || 'Failed to access camera. Please check permissions.'
      );
      setIsScanning(false);
    }
  };

  // Stop scanner
  const stopScanner = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        console.log('[VIN Scanner] Scanner stopped');
      }
    } catch (error) {
      console.error('[VIN Scanner] Error stopping scanner:', error);
    }
  };

  // Restart scanner
  const restartScanner = async () => {
    await stopScanner();
    setScanStatus('idle');
    setErrorMessage('');
    setScanAttempts(0);
    await startScanner();
  };

  // Initialize scanner on mount
  useEffect(() => {
    startScanner();

    // Cleanup on unmount
    return () => {
      stopScanner();
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-gold" />
          Scan VIN Number
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {/* Scanner region */}
        <div id={qrCodeRegionId} className="w-full max-w-2xl" />

        {/* Status Overlays */}
        {scanStatus === 'processing' && scanAttempts === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 rounded-xl p-6 min-w-[200px] pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <p className="text-white text-sm font-medium">Starting camera...</p>
            </div>
          </div>
        )}

        {scanStatus === 'success' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600/95 rounded-xl p-6 min-w-[250px] shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-16 h-16 text-white" />
              <p className="text-white text-lg font-bold">VIN Detected!</p>
              <p className="text-white/95 text-sm font-mono bg-white/20 px-4 py-2 rounded-lg tracking-wide">
                {detectedVIN}
              </p>
            </div>
          </div>
        )}

        {scanStatus === 'error' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600/95 rounded-xl p-6 max-w-sm mx-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-white" />
              <div>
                <p className="text-white text-base font-bold mb-2">Camera Error</p>
                <p className="text-white/90 text-sm">{errorMessage}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={restartScanner}
                className="border-white text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Scan attempts indicator */}
        {scanStatus === 'processing' && scanAttempts > 0 && scanAttempts < 20 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gold/90 px-4 py-2 rounded-full">
            <p className="text-black text-xs font-medium">
              Scanning... ({scanAttempts} attempts)
            </p>
          </div>
        )}

        {/* Timeout warning */}
        {scanAttempts >= 20 && scanStatus === 'processing' && (
          <div className="absolute bottom-32 left-4 right-4 bg-amber-600/95 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Having trouble?</p>
                <p className="text-white/90 text-xs mt-1">
                  Try better lighting, hold camera steady, or enter VIN manually
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/95 border-t border-white/10">
        <div className="text-center text-white/80 text-xs mb-4 space-y-1">
          <p className="font-semibold text-gold text-sm mb-2">📸 Scanning Tips:</p>
          <p>• Position VIN clearly within the gold frame</p>
          <p>• Use good lighting (avoid shadows)</p>
          <p>• Hold camera steady and perpendicular to VIN</p>
          <p>• VIN is usually on dashboard or driver door jamb</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            disabled={scanStatus === 'success'}
          >
            {scanStatus === 'error' ? 'Enter Manually' : 'Cancel'}
          </Button>
          {scanStatus === 'processing' && (
            <Button
              type="button"
              variant="outline"
              onClick={restartScanner}
              className="flex-1 border-gold/50 text-gold hover:bg-gold/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
