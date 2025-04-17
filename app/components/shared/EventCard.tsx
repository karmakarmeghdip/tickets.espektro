"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react"; // Removed unused Users import
import { Event } from "@/lib/data/events"; // Import the Event type
import { BackgroundGradient } from "@/app/components/ui/background-gradient"; // Import BackgroundGradient
import Image from "next/image"; // Import next/image

// Update props to accept the whole event object
interface EventCardProps {
  event: Event;
}

// Function to format date (remains the same)
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
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

// Destructure the event object directly
export default function EventCard({ event }: EventCardProps) {
  // Force the placeholder image for all events
  const imageUrl = '/placeholder-image.jpg'; // Changed from event.thumbnail || '/placeholder-image.jpg'

  return (
    // Wrap the card content with BackgroundGradient
    <BackgroundGradient 
      containerClassName="rounded-xl" // Apply rounded corners to the gradient container
      className="rounded-xl bg-card overflow-hidden" // Apply styles to the inner content container
    >
      {/* Original motion.div, remove background/shadow as it's handled by gradient */}
      <motion.div
        whileHover={{ y: -5 }} // Keep hover effect if desired, or remove if redundant with gradient
        className="group transition-all duration-300" // Removed bg-card, rounded-xl, overflow-hidden, shadow-lg, hover:shadow-xl
      >
        <div className="relative h-48 overflow-hidden">
          {/* Use next/image */}
          <Image
            src={imageUrl} // Use the placeholder image URL
            alt={event.name}
            layout="fill" // Use layout fill for responsive images within a sized container
            objectFit="cover" // Equivalent to object-cover
            className="transition-transform duration-500 group-hover:scale-110"
            // Add error handling for the image itself
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop if fallback also fails
              target.src = '/placeholder-image.jpg'; // Set to fallback on error
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
              {/* Format the start date for the badge */}
              {formatDate(event.startDate).split(',')[0]} {/* Show only Month Day */}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
            {event.name} {/* Use event.name */}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {event.description} {/* Use event.description */}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {/* Format the start date using the utility */}
                {formatDate(event.startDate)}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span> {/* Use event.location */}
            </div>
            {/* Placeholder for attendees - remove or replace if data becomes available */}
            {/* <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{0} attendees</span> 
            </div> */}
          </div>
        </div>
      </motion.div>
    </BackgroundGradient>
  );
}