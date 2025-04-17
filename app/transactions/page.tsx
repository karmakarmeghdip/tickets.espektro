"use client";

import Link from "next/link";
import { events } from "@/lib/data/events";
import { Button } from "@/app/components/ui/button";
import { EventTimeline } from "@/app/components/shared/EventTimeline";
import { CalendarIcon, MapPin, Info, CreditCard, AlertTriangle } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get Your Espektro Pass
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Purchase your pass for full access to all events at Espektro 2025,
              Kalyani Government Engineering College&apos;s annual techfest
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Event details and timeline */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event details */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>April 20-24, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>Kalyani Government Engineering College, Kalyani, West Bengal</span>
                  </div>
                  <p className="mt-6 text-gray-700 dark:text-gray-300">
                    Espektro is the annual techfest of Kalyani Government Engineering College,
                    featuring a wide range of technical and cultural events. The festival attracts
                    participants from colleges across the region and provides a platform for
                    students to showcase their talents and innovations.
                  </p>
                </div>
                
                {/* Event timeline */}
                <div className="p-6 border-t dark:border-gray-800">
                  <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
                  <EventTimeline events={events} />
                </div>
              </div>
              
              {/* Travel guide */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    Travel Guide
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">How to reach Kalyani Government Engineering College</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Kalyani Government Engineering College is located in Kalyani, approximately 50 km from Kolkata.
                        Here are the different ways to reach the college:
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">By Train</h4>
                      <p className="text-gray-700 dark:text-gray-300 pl-4">
                        - From Howrah/Sealdah: Take a local train to Kalyani Main Station<br />
                        - From Kalyani Station: Take an auto or bus to KGEC (15 minutes)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">By Bus</h4>
                      <p className="text-gray-700 dark:text-gray-300 pl-4">
                        - From Kolkata: Take a bus to Kalyani Bus Stand<br />
                        - From Kalyani Bus Stand: Take an auto or bus to KGEC (15 minutes)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">By Car</h4>
                      <p className="text-gray-700 dark:text-gray-300 pl-4">
                        - From Kolkata: Take NH34 towards Kalyani (approximately 1.5 hours)<br />
                        - Use GPS navigation to reach &quot;Kalyani Government Engineering College&quot;
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Accommodation</h4>
                      <p className="text-gray-700 dark:text-gray-300 pl-4">
                        - Limited accommodation is available on campus for outstation participants<br />
                        - Several hotels are available in Kalyani town (3-5 km from the college)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Map view and payment */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="rounded-lg overflow-hidden h-64 border dark:border-gray-700 relative">
                    {/* Embed Google Map using iframe */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.907957005048!2d88.45211499999999!3d22.9904119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f895327fbf3adb%3A0xabd136dfaf4f1628!2sEspektro%20Ground!5e0!3m2!1sen!2sin!4v1744932167563!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Kalyani Government Engineering College Location"
                    ></iframe>
                  </div>
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <a 
                      href="https://maps.app.goo.gl/B2YcBmng8R6N9LVGA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Payment details */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    Pass Details
                  </h2>
                  <div className="mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <h3 className="text-xl font-bold mb-2">Espektro Full Access Pass</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Get access to all events during Espektro 2025
                      </p>
                      <ul className="space-y-1 mb-4 text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Entry to all technical events
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Entry to all cultural events
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Espektro merchandise kit
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Certificate of participation
                        </li>
                      </ul>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ₹1,700
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      // In a real app, this would redirect to the payment gateway
                      alert("This would redirect to Razorpay in a real application");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
              
              {/* Terms and conditions */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    Terms and Conditions
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p>• Pass is non-transferable and non-refundable</p>
                    <p>• Valid ID proof required for entry</p>
                    <p>• Entry subject to security checks</p>
                    <p>• Schedule may change without prior notice</p>
                    <p>• College rules must be followed at all times</p>
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline block mt-4">
                      Read full terms and conditions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}