import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange, user }) => {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/update-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    email,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user settings');
            }
            toast.success("Settings updated successfully");
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating user settings:', error);
            toast.error("Failed to update settings");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <Button type="button">Change Avatar</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                        />
                        <Button type="button" variant="link" className="text-sm">
                            Change Password
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Notifications</Label>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="emailNotifications" />
                            <Label htmlFor="emailNotifications">Receive email notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="pushNotifications" />
                            <Label htmlFor="pushNotifications">Receive push notifications</Label>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;