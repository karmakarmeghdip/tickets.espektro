"use client";

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onError: (errorMessage: string) => void;
  constraints?: {
    video?: {
      facingMode?: string;
    };
  };
  className?: string;
  style?: React.CSSProperties;
}

export const QrScanner: React.FC<QrScannerProps> = ({ 
  onScan, 
  onError, 
  constraints = { video: { facingMode: "environment" } },
  className,
  style
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Initialize the scanner
    if (qrRef.current && !scannerRef.current) {
      const qrScannerId = `qr-scanner-${Math.random().toString(36).substring(2, 15)}`;
      
      // Create a container element for the scanner
      const container = document.createElement('div');
      container.id = qrScannerId;
      qrRef.current.appendChild(container);
      
      // Create a new instance of Html5Qrcode
      scannerRef.current = new Html5Qrcode(qrScannerId);
      
      // Start scanning
      startScanning();
    }

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current
            .stop()
            .catch(error => console.error("Error stopping scanner:", error));
        }
        scannerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.start(
        { facingMode: constraints.video?.facingMode || "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScan(decodedText);
        },
        (errorMessage) => {
          // Handle non-fatal errors - usually just keep scanning
          if (errorMessage.includes("NotReadableError")) {
            onError("Camera access error. Please check your permissions.");
          }
        }
      );
    } catch (error) {
      onError(`QR Scanner initialization error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div 
      ref={qrRef} 
      className={className}
      style={{ 
        minHeight: "300px", 
        position: "relative", 
        overflow: "hidden",
        ...style 
      }}
    >
      {/* Scanner will be injected here */}
    </div>
  );
};