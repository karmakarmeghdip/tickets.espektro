"use client";

import Link from "next/link";
// import Image from "next/image"; // Removed unused import
import { events } from "@/lib/data/events";
import EventCard from "./components/shared/EventCard"; // Changed to default import
import { EventTimeline } from "./components/shared/EventTimeline";
import { Button } from "./components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* Add a background image or pattern here */}
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-900/40 dark:to-purple-900/40" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Espektro 2025
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              The Annual Techfest of Kalyani Government Engineering College
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
              Join us for an incredible journey of technology, innovation, and creativity. 
              Experience workshops, competitions, cultural performances, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/transactions">
                <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Get Espektro Pass
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/events">
                <Button variant="outline" className="px-6 py-6 text-lg rounded-xl border-2">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Featured Events
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Don&apos;t miss out on these exciting events at Espektro 2025
              </p>
            </div>
            
            <Link href="/events">
              <Button variant="ghost" className="mt-4 md:mt-0">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <EventCard 
                key={event.id} 
                event={event} // Pass the whole event object
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Event Schedule
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              Plan your Espektro experience with our event timeline
            </p>
            
            <EventTimeline events={events} />
          </div>
          
          <div className="flex justify-center mt-12">
            <Link href="/transactions">
              <Button className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                Get Your Espektro Pass Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready for an unforgettable experience?</h2>
              <p className="text-white/80">
                Get your Espektro Pass today and gain access to all events during the fest. 
                Be part of the biggest techfest in the region!
              </p>
            </div>
            
            <Link href="/transactions">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                Get Espektro Pass for ₹1700
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
