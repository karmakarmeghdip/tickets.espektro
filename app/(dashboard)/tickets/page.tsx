"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/app/components/ui/button";
import { Download, Share2, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ShineBorder } from "@/app/components/magicui/shine-border";
import Link from 'next/link';

interface Ticket {
  id: string;
  qrCode: string;
  userId: string;
  purchaseDate: string;
  isReferral: boolean;
}

export default function TicketsPage() {
  // Mock ticket data - in a real app, this would come from an API
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "ESP2025-1234567",
      qrCode: "ESP2025-USER123-TICKET1234567",
      userId: "user-123",
      purchaseDate: "2025-03-15T14:30:00",
      isReferral: false
    }
  ]);
  
  const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);
  
  const generateReferralCode = () => {
    setIsGeneratingReferral(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newReferralTicket: Ticket = {
        id: `ESP2025-REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        qrCode: `ESP2025-USER123-REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        userId: "user-123",
        purchaseDate: new Date().toISOString(),
        isReferral: true
      };
      
      setTickets([...tickets, newReferralTicket]);
      setIsGeneratingReferral(false);
    }, 1500);
  };
  
  // Function to handle downloading QR code as an image
  const downloadQRCode = (ticketId: string) => {
    const svgElement = document.getElementById(`qr-canvas-${ticketId}`) as SVGSVGElement | null;
    if (!svgElement) {
      console.error("SVG element not found for ticket:", ticketId);
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create an Image object
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      // Use the explicit size from the SVG element or the component prop as fallback
      const width = svgElement.width.baseVal.value || 200; 
      const height = svgElement.height.baseVal.value || 200;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error("Could not get canvas context");
        URL.revokeObjectURL(url);
        return;
      }

      // Draw the image onto the canvas (with white background)
      ctx.fillStyle = "#FFFFFF"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // Get the data URL from the canvas
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

      // Trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `espektro-ticket-${ticketId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the object URL
      URL.revokeObjectURL(url);
    };

    img.onerror = (error) => {
      console.error('Error loading SVG image:', error);
      URL.revokeObjectURL(url);
    };

    // Set the image source to the SVG Blob URL
    img.src = url;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Tickets
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your Espektro 2025 tickets and generated referral passes
            </p>
          </div>
          
          {tickets.length > 0 ? (
            <div className="space-y-8">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden relative"
                >
                  <ShineBorder
                    className="absolute inset-0"
                    shineColor={["#3b82f6", "#8b5cf6"]} // Blue to Purple gradient
                    borderWidth={2}
                    duration={5}
                  />
                  {/* Content needs to be inside the motion.div but after ShineBorder */}
                  <div className="md:flex relative z-10"> {/* Add relative and z-index to content */}
                    {/* QR code section */}
                    <div className="p-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <QRCodeSVG
                          id={`qr-canvas-${ticket.id}`}
                          value={ticket.qrCode}
                          size={200}
                          level="H"
                          includeMargin
                          imageSettings={{
                            src: "/favicon.ico",
                            excavate: true,
                            height: 24,
                            width: 24
                          }}
                        />
                      </div>
                    </div>

                    {/* Ticket info section */}
                    <div className="p-6 md:flex-1">
                      <div className={`px-3 py-1 rounded-full inline-block text-xs font-medium mb-4 ${
                        ticket.isReferral
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {ticket.isReferral ? "Referral Pass" : "Full Access Pass"}
                      </div>

                      <h3 className="text-xl font-bold mb-2">Espektro 2025</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Ticket ID: {ticket.id}</p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Present this QR code at the entrance for scanning and validation.
                        This ticket grants you access to all events at Espektro 2025.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => downloadQRCode(ticket.id)}
                          variant="outline"
                          className="flex items-center"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>

                        <Button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: "My Espektro 2025 Ticket",
                                text: `Check out my ticket for Espektro 2025! Ticket ID: ${ticket.id}`,
                                url: window.location.href
                              });
                            }
                          }}
                          variant="outline"
                          className="flex items-center"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div> {/* Close the inner content div */}
                </motion.div>
              ))}
              
              {/* Generate referral pass button (only show for non-referral tickets) */}
              {tickets.some(t => !t.isReferral) && !tickets.some(t => t.isReferral) && (
                <div className="mt-8">
                  <Button
                    onClick={generateReferralCode}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    disabled={isGeneratingReferral}
                  >
                    {isGeneratingReferral ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Referral Pass
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    As a student, you can generate one referral pass to be used by a visitor.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // No tickets state
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">No tickets found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                You haven&apos;t purchased any tickets yet. Get your Espektro pass to access all events!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                asChild
              >
                <Link href="/transactions">Get Espektro Pass</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}