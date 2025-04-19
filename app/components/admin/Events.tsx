import React, { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { events, Event } from "@/lib/data/events";
import { clubs } from "@/lib/data/clubs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';

const initialEventState = {
    id: '',
    name: '',
    description: '',
    hostedBy: '',
    location: '',
    thumbnail: '',
    startDate: '',
    endDate: '',
    entryFee: 0,
    coordinators: [{ name: '', phone: '' }]
};

const Events = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ ...initialEventState });
    const [editEvent, setEditEvent] = useState<Event | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'entryFee') {
            setNewEvent(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setNewEvent(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSelectChange = (name: string, value: string) => {
        setEditEvent(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleCoordinatorChange = (index: number, field: 'name' | 'phone', value: string) => {
        setNewEvent(prev => {
            const updatedCoordinators = [...prev.coordinators];
            updatedCoordinators[index] = {
                ...updatedCoordinators[index],
                [field]: value
            };
            return {
                ...prev,
                coordinators: updatedCoordinators
            };
        });
    };

    const addCoordinator = () => {
        setNewEvent(prev => ({
            ...prev,
            coordinators: [...prev.coordinators, { name: '', phone: '' }]
        }));
    };

    const removeCoordinator = (index: number) => {
        if (newEvent.coordinators.length > 1) {
            setNewEvent(prev => ({
                ...prev,
                coordinators: prev.coordinators.filter((_, i) => i !== index)
            }));
        }
    };

    // Edit event handlers
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'entryFee') {
            setEditEvent(prev => ({
                ...prev!,
                [name]: Number(value)
            }));
        } else {
            setEditEvent(prev => ({
                ...prev!,
                [name]: value
            }));
        }
    };

    const handleEditCoordinatorChange = (index: number, field: 'name' | 'phone', value: string) => {
        setEditEvent(prev => {
            const updatedCoordinators = [...prev!.coordinators];
            updatedCoordinators[index] = {
                ...updatedCoordinators[index],
                [field]: value
            };
            return {
                ...prev!,
                coordinators: updatedCoordinators
            };
        });
    };

    const addEditCoordinator = () => {
        setEditEvent(prev => ({
            ...prev!,
            coordinators: [...prev!.coordinators, { name: '', phone: '' }]
        }));
    };

    const removeEditCoordinator = (index: number) => {
        if (editEvent!.coordinators.length > 1) {
            setEditEvent(prev => ({
                ...prev!,
                coordinators: prev!.coordinators.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate a unique ID for new event
        const eventWithId = {
            ...newEvent,
            id: Date.now().toString()
        };

        console.log("New event data:", eventWithId);

        // Close the modal and reset form
        setOpenModal(false);
        setNewEvent({ ...initialEventState });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated event data:", editEvent);

        // Close the modal
        setOpenEditModal(false);
        setEditEvent(null);
    };

    const openEventEditModal = (event: Event) => {
        // Format dates for datetime-local input
        const formattedEvent = {
            ...event,
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: new Date(event.endDate).toISOString().slice(0, 16)
        };
        setEditEvent(formattedEvent);
        setOpenEditModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Event Management</h1>
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            Add New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new event below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Event Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Hackathon 2025"
                                        value={newEvent.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="Main Auditorium"
                                        value={newEvent.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hostedBy">Hosted By</Label>
                                    <Select
                                        name="hostedBy"
                                        value={newEvent.hostedBy}
                                        onValueChange={(value) => handleSelectChange('hostedBy', value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a club" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clubs.map(club => (
                                                <SelectItem key={club.id} value={club.name}>
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                                    <Input
                                        id="entryFee"
                                        name="entryFee"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={newEvent.entryFee}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date & Time</Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="datetime-local"
                                        value={newEvent.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date & Time</Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        value={newEvent.endDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                <Input
                                    id="thumbnail"
                                    name="thumbnail"
                                    placeholder="https://example.com/event-image.jpg"
                                    value={newEvent.thumbnail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter event details here..."
                                    className="min-h-[100px]"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Coordinators</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addCoordinator}
                                        className="flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Coordinator
                                    </Button>
                                </div>

                                {newEvent.coordinators.map((coordinator, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                        <div>
                                            <Label htmlFor={`coordinator-name-${index}`}>Name</Label>
                                            <Input
                                                id={`coordinator-name-${index}`}
                                                value={coordinator.name}
                                                onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                                                placeholder="Coordinator Name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`coordinator-phone-${index}`}>Phone</Label>
                                            <Input
                                                id={`coordinator-phone-${index}`}
                                                value={coordinator.phone}
                                                onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value)}
                                                placeholder="Phone Number"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeCoordinator(index)}
                                            disabled={newEvent.coordinators.length <= 1}
                                            className="mb-0.5"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    Create Event
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Event Modal */}
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the event details below.
                        </DialogDescription>
                    </DialogHeader>
                    {editEvent && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Event Name</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        value={editEvent.name}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-location">Location</Label>
                                    <Input
                                        id="edit-location"
                                        name="location"
                                        value={editEvent.location}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-hostedBy">Hosted By</Label>
                                    <Select
                                        name="hostedBy"
                                        value={editEvent.hostedBy}
                                        onValueChange={(value) => handleEditSelectChange('hostedBy', value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a club" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clubs.map(club => (
                                                <SelectItem key={club.id} value={club.name}>
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-entryFee">Entry Fee (₹)</Label>
                                    <Input
                                        id="edit-entryFee"
                                        name="entryFee"
                                        type="number"
                                        min="0"
                                        value={editEvent.entryFee}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-startDate">Start Date & Time</Label>
                                    <Input
                                        id="edit-startDate"
                                        name="startDate"
                                        type="datetime-local"
                                        value={editEvent.startDate}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-endDate">End Date & Time</Label>
                                    <Input
                                        id="edit-endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        value={editEvent.endDate}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                                <Input
                                    id="edit-thumbnail"
                                    name="thumbnail"
                                    value={editEvent.thumbnail}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    className="min-h-[100px]"
                                    value={editEvent.description}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Coordinators</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addEditCoordinator}
                                        className="flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Coordinator
                                    </Button>
                                </div>

                                {editEvent.coordinators.map((coordinator, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                        <div>
                                            <Label htmlFor={`edit-coordinator-name-${index}`}>Name</Label>
                                            <Input
                                                id={`edit-coordinator-name-${index}`}
                                                value={coordinator.name}
                                                onChange={(e) => handleEditCoordinatorChange(index, 'name', e.target.value)}
                                                placeholder="Coordinator Name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`edit-coordinator-phone-${index}`}>Phone</Label>
                                            <Input
                                                id={`edit-coordinator-phone-${index}`}
                                                value={coordinator.phone}
                                                onChange={(e) => handleEditCoordinatorChange(index, 'phone', e.target.value)}
                                                placeholder="Phone Number"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeEditCoordinator(index)}
                                            disabled={editEvent.coordinators.length <= 1}
                                            className="mb-0.5"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenEditModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    Update Event
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800 text-left">
                                <th className="px-6 py-4 whitespace-nowrap">Event Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Hosted By</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date & Time</th>
                                <th className="px-6 py-4 whitespace-nowrap">Location</th>
                                <th className="px-6 py-4 whitespace-nowrap">Entry Fee</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-800">
                            {events.map((event: Event) => {
                                const startDate = new Date(event.startDate);
                                const endDate = new Date(event.endDate);
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

                                return (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.hostedBy}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {startDate.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}, {startDate.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.entryFee === 0 ? 'Free' : `₹${event.entryFee}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEventEditModal(event)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-blue-600 dark:text-blue-400">
                                                    <Link href={`/events/${event.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Events;