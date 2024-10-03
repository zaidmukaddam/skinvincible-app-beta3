// app/api/get-diagnoses/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'User email is required' }, { status: 400 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch diagnoses for the found user
        const diagnoses = await prisma.diagnosis.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(diagnoses);
    } catch (error) {
        console.error('Error fetching diagnoses:', error);
        return NextResponse.json({ error: 'Failed to fetch diagnoses' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}