
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface SettingsDialogProps {
    user: User;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ user }) => {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(false);

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
                    emailNotifications,
                    pushNotifications,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user settings');
            }
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error('Error updating user settings:', error);
            toast.error("Failed to update settings");
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[85vh] w-full max-w-md mx-auto overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#C37F38] mb-4 px-4 pt-4 sticky top-0 bg-white">Account Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" className="border-[#C37F38] text-[#C37F38] hover:bg-[#F7C189] hover:text-white transition-colors duration-200">
                        Change Avatar
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full border-gray-300 focus:border-[#C37F38] focus:ring-[#C37F38]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full border-gray-300 focus:border-[#C37F38] focus:ring-[#C37F38]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full border-gray-300 focus:border-[#C37F38] focus:ring-[#C37F38]"
                    />
                    <Button type="button" variant="link" className="text-sm text-[#C37F38] hover:text-[#B36F28] p-0">
                        Change Password
                    </Button>
                </div>
                <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">Notifications</Label>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Receive email notifications</span>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            className="bg-gray-200 data-[state=checked]:bg-[#C37F38]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Receive push notifications</span>
                        <Switch
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                            className="bg-gray-200 data-[state=checked]:bg-[#C37F38]"
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full bg-[#C37F38] hover:bg-[#B36F28] text-white transition-colors duration-200">
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default SettingsDialog;