"use client";

import { Event } from "@/lib/data/events";
import { motion, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import { useRef, useState, useEffect } from "react";

interface EventTimelineProps {
  events: Event[];
}

// Define a type similar to TimelineEntry if needed, or adapt Event
// For simplicity, we'll adapt the existing structure

export function EventTimeline({ events }: EventTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      // Calculate the height of the timeline content area
      // Adjust height calculation if needed based on actual rendered content
      setHeight(ref.current.scrollHeight);
    }
  }, [ref, events]); // Re-calculate height if events change

  const { scrollYProgress } = useScroll({
    target: ref, // Keep target as the content div
    offset: ["start start", "end end"], // Standard offset
  });

  // Transform scroll progress to beam height and opacity
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]); // Fade in the beam

  // Sort events by start date/time
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // Group events by day (similar logic as before)
  const eventsByDay = sortedEvents.reduce<Record<string, Event[]>>((acc, event) => {
    const day = format(new Date(event.startDate), "yyyy-MM-dd");
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(event);
    return acc;
  }, {});

  return (
    <div className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg rounded-xl shadow-xl font-sans md:px-10 py-10">
       <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
         <h2 className="text-2xl md:text-4xl mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
           Event Timeline
         </h2>
         {/* Optional: Add a description if needed */}
         {/* <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm mx-auto text-center">
           A chronological view of upcoming events.
         </p> */}
       </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {Object.entries(eventsByDay).map(([day, dayEvents], dayIndex) => (
          <div key={day} className="flex justify-start pt-10 md:pt-20 md:gap-10">
            {/* Sticky Date Header */}
            <div className="sticky flex flex-col md:flex-row z-10 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
               <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-md">
                 {/* Date Circle */}
                 <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                   <span className="text-white font-bold text-xs">
                     {format(new Date(day), "dd")}
                   </span>
                 </div>
               </div>
               {/* Date Label (Desktop) */}
               <h3 className="hidden md:block text-xl md:text-3xl font-bold text-neutral-500 dark:text-neutral-400 md:pl-20">
                 {format(new Date(day), "MMM dd, yyyy")}
               </h3>
            </div>

            {/* Event Content Area */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
               {/* Date Label (Mobile) */}
               <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-neutral-600 dark:text-neutral-300">
                 {format(new Date(day), "EEEE, MMMM dd, yyyy")}
               </h3>
               {/* Event Cards */}
               <div className="space-y-4">
                 {dayEvents.map((event, eventIndex) => (
                   <motion.div
                     key={event.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: (dayIndex * 0.1) + (eventIndex * 0.05) }}
                     className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300"
                   >
                     <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                       {format(new Date(event.startDate), "h:mm a")} - {format(new Date(event.endDate), "h:mm a")}
                     </p>
                     <h4 className="text-md font-semibold mt-1 text-gray-900 dark:text-gray-100">{event.name}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                       {event.location} • {event.hostedBy}
                     </p>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>
        ))}

        {/* Animated Vertical Line/Beam */}
        <div
          style={{ height: height + "px" }} // Ensure this container spans the full height of the content
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-300 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform, // Animated height
              opacity: opacityTransform, // Animated opacity
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full" // Beam gradient
          />
        </div>
      </div>
    </div>
  );
}