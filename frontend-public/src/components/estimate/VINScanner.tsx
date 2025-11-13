'use client';

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import { Camera, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VINScannerProps {
  onVINDetected: (vin: string) => void;
  onClose: () => void;
}

export function VINScanner({ onVINDetected, onClose }: VINScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [detectedVIN, setDetectedVIN] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate VIN format
  const validateVIN = (text: string): string | null => {
    // VIN must be exactly 17 characters, alphanumeric (no I, O, Q)
    const vinPattern = /[A-HJ-NPR-Z0-9]{17}/gi;
    const matches = text.match(vinPattern);
    
    if (matches && matches.length > 0) {
      return matches[0].toUpperCase();
    }
    
    return null;
  };

  // Capture and process image
  const captureAndScan = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsScanning(true);
    setScanStatus('processing');
    setErrorMessage('');

    try {
      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      console.log('[VIN Scanner] Image captured, starting OCR...');

      // Initialize Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`[VIN Scanner] OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      // Configure for better VIN recognition
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789', // No I, O, Q
        tessedit_pageseg_mode: '6', // Assume a single uniform block of text
      });

      // Perform OCR
      const { data: { text } } = await worker.recognize(imageSrc);
      console.log('[VIN Scanner] OCR Result:', text);

      // Validate and extract VIN
      const vin = validateVIN(text);

      if (vin) {
        console.log('[VIN Scanner] ✅ VIN Detected:', vin);
        setDetectedVIN(vin);
        setScanStatus('success');
        
        // Wait 1 second to show success, then callback
        setTimeout(() => {
          onVINDetected(vin);
          onClose();
        }, 1000);
      } else {
        throw new Error('No valid VIN found in image');
      }

      // Cleanup
      await worker.terminate();
    } catch (error: any) {
      console.error('[VIN Scanner] ❌ Error:', error);
      setScanStatus('error');
      setErrorMessage(error.message || 'Failed to scan VIN. Please try again or enter manually.');
    } finally {
      setIsScanning(false);
    }
  }, [onVINDetected, onClose]);

  // Video constraints for mobile (prefer rear camera)
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: { ideal: 'environment' }, // Use back camera on mobile
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
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
      <div className="flex-1 relative overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          onUserMediaError={(error) => {
            console.error('[VIN Scanner] Camera Error:', error);
            setErrorMessage('Could not access camera. Please check permissions.');
            setScanStatus('error');
          }}
        />

        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Viewfinder frame */}
          <div className="relative w-[90%] max-w-md aspect-[3/1] border-2 border-gold rounded-lg">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm font-medium bg-black/70 px-4 py-2 rounded-lg">
                Position VIN within frame
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {scanStatus === 'processing' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 rounded-xl p-6 min-w-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <p className="text-white text-sm font-medium">Scanning VIN...</p>
              <p className="text-white/60 text-xs">This may take a few seconds</p>
            </div>
          </div>
        )}

        {scanStatus === 'success' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600/90 rounded-xl p-6 min-w-[200px]">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-white" />
              <p className="text-white text-sm font-medium">VIN Detected!</p>
              <p className="text-white/90 text-xs font-mono">{detectedVIN}</p>
            </div>
          </div>
        )}

        {scanStatus === 'error' && (
          <div className="absolute bottom-24 left-4 right-4 bg-red-600/90 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Scan Failed</p>
                <p className="text-white/90 text-xs mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/90 border-t border-white/10">
        <div className="text-center text-white/80 text-xs mb-4 space-y-1">
          <p>• Position the VIN clearly within the frame</p>
          <p>• Ensure good lighting for best results</p>
          <p>• Keep camera steady while scanning</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            disabled={isScanning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={captureAndScan}
            disabled={isScanning || scanStatus === 'success'}
            className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture & Scan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
