import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { Camera, FileText, DollarSign, MessageSquare, Zap, Settings, HelpCircle, LogOut, History } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from 'next-auth/react';

interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface MobileMenuProps {
  activePage: string;
  onPageChange: (page: string) => void;
  onNewDiagnosis: () => void;
  user: User;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ activePage, onPageChange, onNewDiagnosis, user }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] rounded-md">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex items-center my-4 space-x-4">
          <Avatar>
            <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <nav className="flex flex-col space-y-4">
          <Button
            variant="secondary"
            className="w-full justify-start bg-[#D18D46] hover:bg-[#E09B54] text-white"
            onClick={() => {
              onNewDiagnosis();
              onPageChange('diagnosis');
            }}
          >
            <Camera className="w-5 h-5 mr-2" />
            New Diagnosis
          </Button>
          <Button
            variant={activePage === 'diagnosis' ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onPageChange('diagnosis')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Diagnosis
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('history')}>
            <History className="w-5 h-5 mr-2" />
            Diagnosis History
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('shop')}>
            <MessageSquare className="w-5 h-5 mr-2" />
            Skinvincible Shop
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('whatsNew')}>
            <Zap className="w-5 h-5 mr-2" />
            What's new
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('earn')}>
            <DollarSign className="w-5 h-5 mr-2" />
            Earn money
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('api')}>
            <Zap className="w-5 h-5 mr-2" />
            API
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('pricing')}>
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('support')}>
            <HelpCircle className="w-5 h-5 mr-2" />
            Support
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('settings')}>
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </nav>
        <Button
          variant="ghost"
          className="w-full justify-start mt-4"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;