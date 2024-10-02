import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useChat } from 'ai/react';
import { signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from '@/components/Markdown';
import { Camera, FileText, DollarSign, MessageSquare, Zap, Settings, HelpCircle, LogOut, CloudUpload, Info } from 'lucide-react';
import { MagicIcon, XIcon } from './icons';
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<'face' | 'body' | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [activePage, setActivePage] = useState('diagnosis');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: "/api/diagnosis",
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDiagnosisSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedDiagnosis && image) {
            handleSubmit(event, {
                experimental_attachments: fileInputRef.current?.files || undefined,
            });
            setIsSubmitted(true);
        } else {
            toast.error("Please select a diagnosis type and upload an image before submitting.");
        }
    };

    const handleNewDiagnosis = () => {
        setSelectedDiagnosis(null);
        setImage(null);
        setActivePage('diagnosis');
        setIsSubmitted(false);
        setMessages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePageChange = (page: string) => {
        if (page === 'diagnosis') {
            setActivePage(page);
        } else {
            setDialogOpen(true);
        }
    };

    const InfoSteps = () => (
        <div className="w-64 p-4 border rounded-2xl h-fit">
            <p className='text-sm text-gray-600 pb-2'>
                Skinvincible provides you with the best care and diagnosis for your skin problems. Follow below steps 👇
            </p>
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Steps to Use Skinvincible</h2>
            <ol className="list-decimal list-inside text-sm text-gray-600">
                <li>Upload an image of your skin</li>
                <li>Write what you have to say in the input box</li>
                <li>Select the type of request you want to make</li>
                <li>Hover over to the result and copy the result</li>
            </ol>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen md:justify-center">
            <div className="md:hidden flex justify-between items-center p-4 bg-white">
                <div className="flex items-center">
                    <Image src="/logo.svg" alt="Skinvincible Logo" width={32} height={32} />
                    <span className="text-xl font-semibold ml-2">Skinvincible</span>
                </div>
                <MobileMenu
                    activePage={activePage}
                    onPageChange={handlePageChange}
                    onNewDiagnosis={handleNewDiagnosis}
                    user={user}
                />
            </div>

            {/* Sidebar */}
            <div className={cn(
                "hidden md:flex w-[300px] bg-white p-4 flex-col my-3 mx-3 rounded-2xl",
                isSubmitted ? "h-[100vh]" : ""
            )}>
                <div className="flex items-center space-x-2 mb-8">
                    <Image src="/logo.svg" alt="Skinvincible Logo" width={32} height={32} />
                    <span className="text-xl font-semibold">Skinvincible</span>
                </div>
                <Button
                    variant="secondary"
                    className="w-full justify-start mb-4 bg-[#D18D46] hover:bg-[#E09B54] text-white"
                    onClick={handleNewDiagnosis}
                >
                    <Camera className="w-5 h-5 mr-2" />
                    New Diagnosis
                </Button>
                <Button
                    variant={activePage === 'diagnosis' ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => handlePageChange('diagnosis')}
                >
                    <FileText className="w-5 h-5 mr-2" />
                    Diagnosis
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('shop')}>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Skinvincible Store
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('whatsNew')}>
                    <Zap className="w-5 h-5 mr-2" />
                    What's new
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('earn')}>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Earn money
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('api')}>
                    <Zap className="w-5 h-5 mr-2" />
                    API
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('pricing')}>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('support')}>
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Support
                </Button>
                <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => handlePageChange('settings')}>
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                </Button>
                <div className="mt-auto">
                    <div className="mb-4 bg-gradient-to-r from-[#C37F38] to-[#F7C189] rounded-lg p-4 text-white">
                        <p className="text-sm font-semibold mb-1">4 credit left!</p>
                        <p className="text-xs mb-2">Check out the new dashboard view. Pages now load faster.</p>
                        <Button variant="outline" className="w-full text-black border-white">Buy Credits</Button>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center">
                            <Avatar>
                                <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                                <p className="text-xs">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => signOut()}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 my-3 mx-3 rounded-2xl bg-white max-w-3xl">
                {activePage === 'diagnosis' && (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="text-lg font-semibold text-[#525252]">
                                {isSubmitted ? "Diagnosis" : "Choose your Diagnosis"}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setInfoDialogOpen(true)}
                                className="md:hidden"
                            >
                                <Info className="h-5 w-5" />
                            </Button>
                        </div>
                        {!isSubmitted ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card
                                    className={`cursor-pointer hover:border-orange-300 ${selectedDiagnosis === 'face' ? 'border-orange-500' : 'border-orange-200'} overflow-hidden`}
                                    onClick={() => setSelectedDiagnosis('face')}
                                >
                                    <div className="relative p-6 h-[150px]">
                                        <div className="flex items-center mb-2 text-[#C37F38]">
                                            <MagicIcon className="w-5 h-5 mr-2" />
                                            <h3 className="text-lg font-semibold">Start Face Diagnosis</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 pr-20">
                                            Skinvincible provides you with the best care and diagnosis for your skin problems.
                                        </p>
                                        <div className="absolute bottom-3 right-3 w-20 h-20">
                                            <Image
                                                src="/face-icon.svg"
                                                alt="Face Icon"
                                                width={80}
                                                height={80}
                                                objectFit="contain"
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card
                                    className={`cursor-pointer hover:border-orange-300 ${selectedDiagnosis === 'body' ? 'border-orange-500' : 'border-orange-200'} overflow-hidden`}
                                    onClick={() => setSelectedDiagnosis('body')}
                                >
                                    <div className="relative p-6 h-[150px]">
                                        <div className="flex items-center mb-2 text-[#C37F38]">
                                            <MagicIcon className="w-5 h-5 mr-2" />
                                            <h3 className="text-lg font-semibold">Start Body Diagnosis</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 pr-20">
                                            Skinvincible provides you with the best care and diagnosis for your skin problems.
                                        </p>
                                        <div className="absolute bottom-3 right-3 w-20 h-20">
                                            <Image
                                                src="/body-icon.svg"
                                                alt="Body Icon"
                                                width={80}
                                                height={80}
                                                objectFit="contain"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-[#F7C189] text-white text-xs font-bold px-2 py-1 rounded">
                                            Beta
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-orange-100 rounded-lg">
                                <p className="font-semibold text-[#C37F38]">
                                    Selected Diagnosis: {selectedDiagnosis === 'face' ? 'Face' : 'Body'}
                                </p>
                            </div>
                        )}
                        {!isSubmitted && (
                            <form onSubmit={handleDiagnosisSubmit}>
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2 text-[#525252]">Upload the image of your skin</h2>
                                    <div className="border border-gray-300 rounded-lg p-32 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            ref={fileInputRef}
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            {image ? (
                                                <img src={image} alt="Uploaded skin" className="max-w-full max-h-64 mx-auto" />
                                            ) : (
                                                <>
                                                    <CloudUpload className="mx-auto h-12 w-12 text-[#C37F38]" />
                                                    <p className="mt-1 text-sm text-[#C37F38]">Upload picture</p>
                                                    <p className="mt-1 text-xs text-gray-500">PNG, JPG or JPEG (min. 800x400px)</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2 text-[#525252]">Your comments</h2>
                                    <Textarea
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="I want a skin care routine for my skin type."
                                        className="w-full h-32"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-[#C37F38] hover:bg-[#D18D46] text-white" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : `Start ${selectedDiagnosis === 'face' ? 'Face' : 'Body'} Diagnosis`}
                                </Button>
                            </form>
                        )}
                        {messages.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <h2 className="text-lg font-semibold mb-2 text-[#C37F38]">Diagnosis Results</h2>
                                {messages.map((message, index) => (
                                    <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-orange-50 border' : 'bg-white border'}`}>
                                        <div className="flex items-center mb-2">
                                            <Avatar className="mr-2">
                                                <AvatarImage
                                                    src={message.role === 'user' ? (user?.image || '') : '/logo.svg'}
                                                    alt={message.role === 'user' ? (user?.name || 'User') : 'Skinvincible'}
                                                />
                                                <AvatarFallback>{message.role === 'user' ? (user?.name?.charAt(0) || 'U') : 'S'}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold">{message.role === 'user' ? (user?.name || 'User') : 'Skinvincible AI'}</span>
                                        </div>
                                        <Markdown>{message.content}</Markdown>
                                        {message.experimental_attachments?.map((attachment, attachmentIndex) => (
                                            attachment.contentType?.startsWith('image/') && (
                                                <img
                                                    key={`${message.id}-${attachmentIndex}`}
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    className="mt-2 max-w-full h-auto rounded-lg"
                                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            )
                                        ))}
                                    </div>
                                ))}
                                {/* check if assistant message content is there "" or not */}
                                {messages[messages.length - 1].content === "" && isLoading && (
                                    <div className="p-4 rounded-lg bg-white shadow-md animate-pulse">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Info Steps for desktop */}
            <div className="hidden md:block w-64 mt-3 mx-3">
                <InfoSteps />
            </div>

            {/* Dialog for unavailable pages */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#C37F38]">Feature Coming Soon</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-base text-gray-600">
                        This feature is not yet available. We're working hard to bring it to you soon!
                    </DialogDescription>
                    <div className="flex items-center justify-between mt-4">
                        <Link
                            href="https://x.com/skinvincible_ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-[#F7C189] text-white rounded-full hover:bg-[#E09B54] transition-colors"
                        >
                            <XIcon className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Follow @skinvincible_ai</span>
                        </Link>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            variant="outline"
                            className="border-[#C37F38] text-[#C37F38] hover:bg-[#F7C189] hover:text-white"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Info Dialog for mobile */}
            <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>How to Use Skinvincible</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className='justify-center flex items-center'>
                        <InfoSteps />
                    </DialogDescription>
                    <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;