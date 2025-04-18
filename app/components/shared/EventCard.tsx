"use client";

import { Clock, MapPin } from "lucide-react";
import { Event } from "@/lib/data/events"; // Correct import path
import Image from "next/image";
import { MagicCard } from "@/app/components/magicui/magic-card";

interface EventCardProps {
  event: Event;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string received: ${dateString}`);
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error(`Error formatting date string: ${dateString}`, error);
    return "Error Formatting Date";
  }
};

export default function EventCard({ event }: EventCardProps) {
  // Ensure event object exists before accessing properties
  if (!event) {
    // Optionally return a placeholder or null if event data is missing
    return <div>Loading event...</div>; 
  }

  // Force the placeholder image for all events
  const imageUrl = '/placeholder-image.jpg'; // Changed from event.thumbnail || '/placeholder-image.jpg'

  return (
    <div>
      <MagicCard className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl} // Use the forced placeholder image URL
          alt={event.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
            {/* Safely format date */} 
            {event.startDate ? formatDate(event.startDate).split(',')[0] : 'Date N/A'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
          {event.name || 'Event Name N/A'} 
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {event.description || 'No description available.'}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {/* Safely format date */} 
              {event.startDate ? formatDate(event.startDate) : 'Time N/A'}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{event.location || 'Location N/A'}</span>
          </div>
        </div>
      </div>
      </MagicCard>
  </div>
  );
}