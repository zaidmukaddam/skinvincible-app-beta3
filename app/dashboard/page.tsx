// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import Image from 'next/image';

const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 bg-orange-100 flex items-center justify-center">
      <div className="text-center">
        <Image src="/logo.svg" alt="Skinvincible Logo" width={100} height={100} className="mx-auto animate-pulse" />
        <p className="mt-4 text-lg font-semibold text-orange-800">Loading...</p>
      </div>
    </div>
  );

export default function DashboardPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    if (status === "loading") {
        return <LoadingScreen />;
    }

    return <Dashboard user={session.user!} />;
}