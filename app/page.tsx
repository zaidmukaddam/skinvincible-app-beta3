// app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-orange-100 flex items-center justify-center">
    <div className="text-center">
      <Image src="/logo.svg" alt="Skinvincible Logo" width={100} height={100} className="mx-auto animate-pulse" />
      <p className="mt-4 text-lg font-semibold text-orange-800">Loading...</p>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' || session !== null) {
      console.log('User is already authenticated, redirecting to dashboard...');
      setIsLoading(true);
      redirect('/dashboard');
    }

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [status, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const images = [
    '/woman-with-phone.svg',
    '/woman-with-coffee.svg',
    '/woman-in-diagnosis.svg',
    '/skinvincible-products.svg'
  ];

  const handleSignIn = async (provider: 'apple' | 'google') => {
    setIsLoading(true);
    await signIn(provider);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-orange-100 relative">
        <div className="absolute top-4 left-4 z-10">
          <Image src="/logo.svg" alt="Skinvincible Logo" width={50} height={50} />
        </div>
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <Image
                src={src}
                alt={`Illustration ${index + 1}`}
                width={400}
                height={400}
                objectFit="contain"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-16 h-1 rounded-full ${index === currentImage ? 'bg-orange-500' : 'bg-orange-300'
                }`}
            />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/logo.svg" alt="Skinvincible Logo" width={80} height={80} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Welcome to Skinvincible</h1>
            <p className="text-gray-600 mt-2">Your personal AI-powered skin care assistant</p>
          </div>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => handleSignIn('apple')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.09.41-1.09-.47-2.09-.48-3.23 0-1.44.62-2.2.44-3.05-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.17-.24 2.28-.93 3.57-.84 1.5.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign in with Apple
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => handleSignIn('google')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-8">
            By registering you agree to our Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;