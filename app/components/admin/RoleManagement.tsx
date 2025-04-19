import React, { useState } from 'react';
import { Button } from "@/app/components/ui/button";
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
import { Eye, EyeOff, Plus } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

// Define role types
type Role = 'admin' | 'club-admin' | 'check-in-staff' | 'viewer';

// Define User type
type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    clubId?: string; // Optional for non-club roles
    createdAt: string;
    lastLogin?: string;
};

// Sample users data
const initialUsers: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@espektro.org',
        password: 'admin123',
        role: 'admin',
        createdAt: '2025-01-01T10:00:00',
        lastLogin: '2025-04-18T08:45:00'
    },
    {
        id: '2',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@espektro.org',
        password: 'rahul123',
        role: 'club-admin',
        clubId: '1', // Robotics Club
        createdAt: '2025-01-15T11:30:00',
        lastLogin: '2025-04-17T14:22:00'
    },
    {
        id: '3',
        name: 'Vikram Rajput',
        email: 'vikram.rajput@espektro.org',
        password: 'vikram123',
        role: 'club-admin',
        clubId: '2', // Coding Club
        createdAt: '2025-01-17T09:15:00',
        lastLogin: '2025-04-18T09:10:00'
    },
    {
        id: '4',
        name: 'Priya Singh',
        email: 'priya.singh@espektro.org',
        password: 'priya123',
        role: 'check-in-staff',
        createdAt: '2025-02-05T13:20:00',
        lastLogin: '2025-04-16T16:30:00'
    },
    {
        id: '5',
        name: 'Check-in Staff 1',
        email: 'checkin1@espektro.org',
        password: 'checkin123',
        role: 'check-in-staff',
        createdAt: '2025-03-10T10:00:00',
        lastLogin: '2025-04-18T08:00:00'
    }
];

const initialUserState = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'viewer' as Role,
    clubId: undefined,
    createdAt: '',
    lastLogin: undefined
};

const RoleManagement = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newUser, setNewUser] = useState({ ...initialUserState });
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name === 'role') {
            setNewUser(prev => ({
                ...prev,
                [name]: value as Role,
                // Clear clubId if the role doesn't need it
                clubId: value === 'club-admin' ? prev.clubId : undefined
            }));
        } else {
            setNewUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleEditSelectChange = (name: string, value: string) => {
        if (name === 'role') {
            setEditUser(prev => ({
                ...prev!,
                [name]: value as Role,
                // Clear clubId if the role doesn't need it
                clubId: value === 'club-admin' ? prev!.clubId : undefined
            }));
        } else {
            setEditUser(prev => ({
                ...prev!,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Generate a unique ID and set creation date
        const userWithId = {
            ...newUser,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        setUsers(prev => [...prev, userWithId]);
        console.log("New user data:", userWithId);

        // Close the modal and reset form
        setOpenModal(false);
        setNewUser({ ...initialUserState });
        setShowPassword(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editUser) {
            setUsers(prev => prev.map(user =>
                user.id === editUser.id ? editUser : user
            ));
            console.log("Updated user data:", editUser);
        }

        // Close the modal
        setOpenEditModal(false);
        setEditUser(null);
        setShowEditPassword(false);
    };

    const openUserEditModal = (user: User) => {
        setEditUser(user);
        setOpenEditModal(true);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get club name by ID
    const getClubName = (clubId?: string) => {
        if (!clubId) return '-';
        const club = clubs.find(c => c.id === clubId);
        return club ? club.name : 'Unknown Club';
    };

    // Role badge styling
    const getRoleBadgeClass = (role: Role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'club-admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'check-in-staff':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'viewer':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    // Format role name for display
    const formatRoleName = (role: Role) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'club-admin': return 'Club Admin';
            case 'check-in-staff': return 'Check-in Staff';
            case 'viewer': return 'Viewer';
            default: return role;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">User & Role Management</h1>
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            <Plus className="h-4 w-4 mr-2" /> Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account with specific role permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={newUser.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john.doe@espektro.org"
                                        value={newUser.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newUser.password}
                                        onChange={handleInputChange}
                                        className="pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        name="role"
                                        value={newUser.role}
                                        onValueChange={(value) => handleSelectChange('role', value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="club-admin">Club Admin</SelectItem>
                                            <SelectItem value="check-in-staff">Check-in Staff</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(newUser.role === 'club-admin') && (
                                    <div className="space-y-2">
                                        <Label htmlFor="clubId">Associated Club</Label>
                                        <Select
                                            name="clubId"
                                            value={newUser.clubId}
                                            onValueChange={(value) => handleSelectChange('clubId', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select club" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clubs.map(club => (
                                                    <SelectItem key={club.id} value={club.id}>
                                                        {club.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
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
                                    Create User
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search box */}
            <div className="mb-6">
                <Input
                    placeholder="Search users by name, email or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {/* Edit User Modal */}
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user account details and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    {editUser && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        value={editUser.name}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        name="email"
                                        type="email"
                                        value={editUser.email}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="edit-password"
                                        name="password"
                                        type={showEditPassword ? "text" : "password"}
                                        value={editUser.password}
                                        onChange={handleEditInputChange}
                                        className="pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                    >
                                        {showEditPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                        name="role"
                                        value={editUser.role}
                                        onValueChange={(value) => handleEditSelectChange('role', value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="club-admin">Club Admin</SelectItem>
                                            <SelectItem value="check-in-staff">Check-in Staff</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(editUser.role === 'club-admin') && (
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-clubId">Associated Club</Label>
                                        <Select
                                            name="clubId"
                                            value={editUser.clubId || ""}
                                            onValueChange={(value) => handleEditSelectChange('clubId', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select club" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clubs.map(club => (
                                                    <SelectItem key={club.id} value={club.id}>
                                                        {club.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
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
                                    Update User
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* User list */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800 text-left">
                                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                                <th className="px-6 py-4 whitespace-nowrap">Email</th>
                                <th className="px-6 py-4 whitespace-nowrap">Role</th>
                                <th className="px-6 py-4 whitespace-nowrap">Associated Club</th>
                                <th className="px-6 py-4 whitespace-nowrap">Last Login</th>
                                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching your search criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                                                {formatRoleName(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.clubId ? getClubName(user.clubId) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.lastLogin ? (
                                                <span title={new Date(user.lastLogin).toLocaleString()}>
                                                    {new Date(user.lastLogin).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">Never</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openUserEditModal(user)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 dark:text-red-400"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role permissions info */}
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Role Permissions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 border dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">Admin</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full system access with the ability to manage all events, users, clubs, and settings.</p>
                    </div>

                    <div className="space-y-2 p-4 border dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 mr-2">Club Admin</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Can manage their specific club, create and edit events hosted by their club, and manage club members.</p>
                    </div>

                    <div className="space-y-2 p-4 border dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-2">Check-in Staff</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Limited access to scan QR codes and check in attendees at events. Cannot modify event or club details.</p>
                    </div>

                    <div className="space-y-2 p-4 border dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 mr-2">Viewer</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Read-only access to view events, clubs, and attendee lists. Cannot modify any data or check in attendees.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;