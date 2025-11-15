'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VINScannerV2Props {
  onVINDetected: (vin: string) => void;
  onClose: () => void;
}

export function VINScannerV2({ onVINDetected, onClose }: VINScannerV2Props) {
  // Lock screen orientation to portrait on mount
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('portrait');
          console.log('[VINScannerV2] Screen locked to portrait');
        }
      } catch (error) {
        console.log('[VINScannerV2] Could not lock orientation:', error);
      }
    };
    
    lockOrientation();
    
    // Unlock on unmount
    return () => {
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
          console.log('[VINScannerV2] Screen orientation unlocked');
        }
      } catch (error) {
        console.log('[VINScannerV2] Could not unlock orientation:', error);
      }
    };
  }, []);
  const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'requesting' | 'scanning' | 'success' | 'error'>('idle');
  const [detectedVIN, setDetectedVIN] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanAttempts, setScanAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Add debug log
  const addDebug = useCallback((message: string) => {
    console.log(`[VIN Scanner V2] ${message}`);
    setDebugInfo(prev => [...prev.slice(-4), message]);
  }, []);

  // Validate VIN format
  const validateVIN = (text: string): string | null => {
    const cleaned = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    
    if (vinPattern.test(cleaned)) {
      return cleaned;
    }
    
    const vinMatch = cleaned.match(/[A-HJ-NPR-Z0-9]{17}/);
    return vinMatch ? vinMatch[0] : null;
  };

  // Extract VIN using Google Vision API
  const extractTextFromImage = async (canvas: HTMLCanvasElement): Promise<string | null> => {
    try {
      // Convert canvas to base64 (JPEG format, higher quality for OCR)
      const base64Image = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      
      addDebug(`Sending image (${Math.round(base64Image.length / 1024)}KB) to Vision API...`);
      
      // Call backend API
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const apiUrl = `${backendUrl}/vision/scan-vin`;
      
      addDebug(`API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      addDebug(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addDebug(`API Error: ${response.status} - ${errorData.message || 'Unknown'}`);
        console.error('[VINScannerV2] API Error:', errorData);
        return null;
      }

      const data = await response.json();
      addDebug(`API Response: ${data.success ? `VIN: ${data.vin}` : 'No VIN detected'}`);
      
      if (data.success && data.vin) {
        addDebug(`✅ Valid VIN detected: ${data.vin}`);
        return data.vin;
      }
      
      addDebug('⚠️ No VIN found in this frame');
      return null;
    } catch (error: any) {
      addDebug(`❌ Vision API error: ${error.message}`);
      console.error('[VINScannerV2] Vision API error:', error);
      return null;
    }
  };

  // Scan frame for VIN
  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || scanStatus !== 'scanning') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    try {
      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Try to extract VIN using Google Vision API
      const detectedVIN = await extractTextFromImage(canvas);

      if (detectedVIN) {
        // Validate the detected VIN
        const validatedVIN = validateVIN(detectedVIN);
        if (validatedVIN) {
          addDebug(`VIN detected: ${validatedVIN}`);
          handleSuccess(validatedVIN);
          return;
        } else {
          addDebug(`Invalid VIN format: ${detectedVIN}`);
        }
      }

      // Increment attempts
      setScanAttempts(prev => prev + 1);
      
    } catch (error) {
      console.error('[VIN Scanner V2] Scan error:', error);
    }
  }, [scanStatus, addDebug]);

  // Handle successful VIN detection
  const handleSuccess = useCallback((vin: string) => {
    if (!mountedRef.current) return;
    
    addDebug(`Success! VIN: ${vin}`);
    setDetectedVIN(vin);
    setScanStatus('success');
    
    // Stop scanning
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Wait and callback
    setTimeout(() => {
      if (mountedRef.current) {
        onVINDetected(vin);
        onClose();
      }
    }, 1500);
  }, [onVINDetected, onClose, addDebug]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setScanStatus('requesting');
      addDebug('Requesting camera permission...');

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Request camera access with better constraints for VIN scanning
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1920, min: 1280 }, // Higher resolution for OCR
          height: { ideal: 1080, min: 720 },
          focusMode: { ideal: 'continuous' }, // Auto-focus
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      addDebug('Attempting to access camera...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      streamRef.current = stream;
      addDebug(`Camera accessed: ${stream.getVideoTracks()[0]?.label || 'Unknown'}`);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current && mountedRef.current) {
            videoRef.current.play().then(() => {
              addDebug('Video playing');
              setScanStatus('scanning');
              
              // Start scanning interval - More frequent for better detection
              scanIntervalRef.current = setInterval(() => {
                scanFrame();
              }, 2000); // Scan every 2 seconds to reduce API calls
              
            }).catch((err) => {
              addDebug(`Play error: ${err.message}`);
              handleError('video-play', err);
            });
          }
        };
      }

    } catch (error: any) {
      addDebug(`Camera error: ${error.name} - ${error.message}`);
      handleError(error.name, error);
    }
  }, [addDebug, scanFrame]);

  // Handle errors
  const handleError = useCallback((errorName: string, error: any) => {
    if (!mountedRef.current) return;

    setScanStatus('error');
    
    let userMessage = 'Failed to access camera. ';
    
    switch (errorName) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        userMessage = 'Camera permission denied. Please:\n1. Tap the ⓘ icon in the address bar\n2. Allow camera access\n3. Try scanning again';
        break;
        
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        userMessage = 'No camera found on this device. Please:\n• Check if your device has a camera\n• Try a different device\n• Or enter VIN manually below';
        break;
        
      case 'NotReadableError':
      case 'TrackStartError':
        userMessage = 'Camera is already in use. Please:\n• Close other apps using the camera\n• Close other browser tabs\n• Restart your browser';
        break;
        
      case 'SecurityError':
        userMessage = 'Security error. Camera requires HTTPS. Please:\n• Make sure you\'re on https:// URL\n• Try refreshing the page\n• Contact support if problem persists';
        break;
        
      case 'video-play':
        userMessage = 'Could not start video. Please:\n• Refresh the page\n• Try again\n• Or enter VIN manually';
        break;
        
      default:
        if (error.message) {
          userMessage = `Camera error: ${error.message}`;
        }
    }
    
    setErrorMessage(userMessage);
    addDebug(`Error handled: ${errorName}`);
  }, [addDebug]);

  // Stop camera
  const stopCamera = useCallback(() => {
    addDebug('Stopping camera...');
    
    // Clear scan interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Stop video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        addDebug(`Track stopped: ${track.kind}`);
      });
      streamRef.current = null;
    }
  }, [addDebug]);

  // Restart scanner
  const restartScanner = useCallback(async () => {
    addDebug('Restarting scanner...');
    stopCamera();
    setScanStatus('idle');
    setErrorMessage('');
    setScanAttempts(0);
    setDebugInfo([]);
    
    setTimeout(() => {
      if (mountedRef.current) {
        startCamera();
      }
    }, 500);
  }, [stopCamera, startCamera, addDebug]);

  // Initialize on mount
  useEffect(() => {
    mountedRef.current = true;
    addDebug('Component mounted');
    setScanStatus('loading');
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (mountedRef.current) {
        startCamera();
      }
    }, 300);

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      addDebug('Component unmounting');
      stopCamera();
    };
  }, []); // Empty deps - only run once on mount

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col" style={{ 'WebkitTransform': 'translate3d(0,0,0)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-gold" />
          Scan VIN Number (V2)
        </h2>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ 
            display: scanStatus === 'scanning' ? 'block' : 'none',
            transform: 'scaleX(-1)' // Mirror video for better UX
          }}
        />

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Scan overlay box - Fixed positioning for mobile */}
        {scanStatus === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Dimmed overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* VIN Frame - Landscape oriented */}
            <div className="relative w-[85%] max-w-[400px]" style={{ height: '120px' }}>
              <div className="absolute inset-0 border-4 border-gold rounded-lg shadow-2xl">
                {/* Corner markers */}
                <div className="absolute -top-1.5 -left-1.5 w-10 h-10 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                <div className="absolute -top-1.5 -right-1.5 w-10 h-10 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                <div className="absolute -bottom-1.5 -left-1.5 w-10 h-10 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                <div className="absolute -bottom-1.5 -right-1.5 w-10 h-10 border-b-4 border-r-4 border-gold rounded-br-lg" />
                
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold animate-pulse" />
              </div>
              
              {/* Instruction text */}
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <p className="text-white text-base font-semibold mb-1">
                  📸 Position VIN within gold frame
                </p>
                <p className="text-white/70 text-xs">
                  VIN: 17 characters on dashboard or door jamb
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Overlays */}
        {(scanStatus === 'loading' || scanStatus === 'requesting') && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 rounded-xl p-6 min-w-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <p className="text-white text-sm font-medium">
                {scanStatus === 'requesting' ? 'Requesting camera...' : 'Loading scanner...'}
              </p>
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
                <p className="text-white/90 text-sm whitespace-pre-line">{errorMessage}</p>
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
        {scanStatus === 'scanning' && scanAttempts > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gold/90 px-4 py-2 rounded-full">
            <p className="text-black text-xs font-medium">
              Scanning... ({scanAttempts} frames)
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/95 border-t border-white/10">
        {/* Debug info - Always show for troubleshooting */}
        {debugInfo.length > 0 && (
          <div className="mb-3 p-3 bg-gray-900 rounded-lg border border-gold/30">
            <p className="text-gold text-xs font-semibold mb-1">📊 Scanner Status:</p>
            <div className="text-xs text-gray-300 font-mono space-y-0.5 max-h-24 overflow-y-auto">
              {debugInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span className="flex-1">{info}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-white/80 text-xs mb-4 space-y-1">
          <p className="font-semibold text-gold text-sm mb-2">📸 Tips for Better Scanning:</p>
          <p>• <strong>Good lighting is essential</strong> (avoid shadows/glare)</p>
          <p>• Hold phone <strong>horizontal/landscape</strong></p>
          <p>• Keep VIN <strong>centered in gold frame</strong></p>
          <p>• Hold camera <strong>steady for 2-3 seconds</strong></p>
          <p>• VIN location: Dashboard or driver door jamb</p>
          <p className="text-amber-400 mt-2 font-semibold">⚠️ Having trouble? Use manual entry below!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            disabled={scanStatus === 'success'}
          >
            {scanStatus === 'error' ? 'Enter Manually' : 'Cancel'}
          </Button>
          {scanStatus === 'scanning' && (
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
