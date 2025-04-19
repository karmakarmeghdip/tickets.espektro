"use client";

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, MapPin, Users, Clock, ArrowLeft, User, Phone, Share2 } from "lucide-react";
import { events, Event } from "@/lib/data/events";
import { clubs, Club } from "@/lib/data/clubs";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export default function EventDetailPage({
    params,
}: {
    params: { eventId: string } | Promise<{ eventId: string }>;
}) {
    // Handle params as a Promise using React.use()
    // Cast params to any first to avoid TypeScript errors with Usable type
    const unwrappedParams: any = React.use(params as any);
    const eventId = unwrappedParams.eventId;

    // Find the event with the matching ID
    const event = events.find((e) => e.id === eventId);

    // If event not found, return 404
    if (!event) {
        notFound();
    }

    // Find the club hosting the event
    const hostingClub = clubs.find((club) => club.name === event.hostedBy);

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Check event status
    const isOngoing = startDate <= new Date() && endDate >= new Date();
    const isPast = endDate < new Date();
    let status = "Upcoming";
    let statusClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";

    if (isOngoing) {
        status = "Ongoing";
        statusClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (isPast) {
        status = "Completed";
        statusClass = "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }

    // Calculate event duration
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationDays = Math.floor(durationHours / 24);

    // Format duration string
    let durationStr = "";
    if (durationDays > 0) {
        durationStr = `${durationDays} day${durationDays > 1 ? "s" : ""}`;
        if (durationHours % 24 > 0) {
            durationStr += ` ${durationHours % 24} hour${durationHours % 24 > 1 ? "s" : ""}`;
        }
    } else {
        durationStr = `${durationHours} hour${durationHours > 1 ? "s" : ""}`;
    }

    // Handle sharing
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.name,
                text: `Check out this event: ${event.name}`,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-16">
            <div className="container mx-auto px-4 py-8">
                {/* Back button */}
                <Link
                    href="/events"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Event image and basic details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                            <div className="relative w-full h-64 md:h-96">
                                <Image
                                    src={event.thumbnail}
                                    alt={event.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute top-4 right-4">
                                    <Badge className={statusClass}>{status}</Badge>
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-start">
                                        <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Date & Time</p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {startDate.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {startDate.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} - {endDate.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Location</p>
                                            <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Duration</p>
                                            <p className="text-gray-600 dark:text-gray-400">{durationStr}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Hosted By</p>
                                            <p className="text-gray-600 dark:text-gray-400">{event.hostedBy}</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-800 my-6" />

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-3">About the Event</h2>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Registration, coordinators, etc. */}
                    <div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-2">Registration</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {event.entryFee === 0 ? 'Free entry' : `Entry fee: ₹${event.entryFee}`}
                                </p>
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    disabled={isPast}
                                >
                                    {isPast ? 'Event Completed' : 'Register Now'}
                                </Button>
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 mr-2"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Coordinators section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-3">Event Coordinators</h2>
                            <div className="space-y-4">
                                {event.coordinators.map((coordinator, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{coordinator.name}</p>
                                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                                <Phone className="h-3 w-3 mr-1" />
                                                <span>{coordinator.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hosting club section - if available */}
                        {hostingClub && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold mb-3">Hosting Club</h2>
                                <div className="flex items-center mb-3">
                                    <div className="h-12 w-12 relative mr-3 rounded-full overflow-hidden">
                                        <Image
                                            src={hostingClub.logo}
                                            alt={hostingClub.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{hostingClub.name}</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {hostingClub.department}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                                    {hostingClub.description}
                                </p>
                                {/* <Link href={`/clubs/${hostingClub.id}`} passHref>
                                    <Button variant="outline" className="w-full">
                                        View Club Profile
                                    </Button>
                                </Link> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}