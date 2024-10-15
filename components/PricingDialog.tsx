import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const PricingDialog: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<'face' | 'body'>('face');

    return (
        <div className="p-4 mt-4">
            <Image
                src="/pricing-image.png"
                alt="Pricing Image"
                width={500}
                height={180}
                className="rounded-lg mb-4 w-full"
            />
            <h2 className="text-2xl font-bold pb-2">Choose your plan</h2>
            <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <div
                    className={`border rounded-lg p-3 w-full sm:w-[48%] cursor-pointer ${selectedPlan === 'face' ? 'border-[#C37F38] bg-white' : 'border-gray-200 bg-gray-50'}`}
                    onClick={() => setSelectedPlan('face')}
                >
                    <p className="text-[#C37F38] text-xs font-semibold mb-1 float-right">Face</p>
                    <h3 className="text-6xl font-medium">₹9<span className="text-sm font-normal">/month</span></h3>
                    <p className="text-xs mt-1 font-medium">Weekly Scan + Daily Skin Care</p>
                </div>
                <div
                    className={`border rounded-lg p-3 w-full sm:w-[48%] cursor-pointer ${selectedPlan === 'body' ? 'border-[#C37F38] bg-white' : 'border-gray-200 bg-gray-50'}`}
                    onClick={() => setSelectedPlan('body')}
                >
                    <p className="text-[#C37F38] text-xs mb-1 font-semibold float-right">Full Body Diagnosis</p>
                    <h3 className="text-6xl font-medium">₹3</h3>
                    <p className="text-xs mt-1 font-medium">One-Time</p>
                </div>
            </div>
            <h4 className="font-semibold text-sm mb-2">Face Scan Features:</h4>
            <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-start">
                    <span className="inline-block bg-[#F7C189] rounded-md p-0 mr-2 mt-0.5">
                        <Image src="/icon-face.svg" alt="Face icon" width={20} height={20} />
                    </span>
                    <span>
                        <strong>Comprehensive Skin Diagnosis and Personalized Routine for Your Face:</strong>
                        <p className='text-xs'>
                            Receive in-depth insights and a customized skincare regimen tailored to your skin's needs.
                        </p>
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="inline-block bg-[#F7C189] rounded-md p-0 mr-2 mt-0.5">
                        <Image src="/icon-calendar.svg" alt="Calendar icon" width={20} height={20} />
                    </span>
                    <span>
                        <strong>Bi-weekly Face Scans:</strong>
                        <p className='text-xs'>
                            Get detailed skin analysis every 15 days to track your skin's progress.
                        </p>
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="inline-block bg-[#F7C189] rounded-md p-0 mr-2 mt-0.5">
                        <Image src="/icon-bell.svg" alt="Bell icon" width={20} height={20} />
                    </span>
                    <span>
                        <strong>Routine Schedule with Reminders:</strong>
                        <p className='text-xs'>
                            Daily notifications to guide you through your morning and evening skincare steps.
                        </p>
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="inline-block bg-[#F7C189] rounded-md p-0 mr-2 mt-0.5">
                        <Image src="/icon-store.svg" alt="Store icon" width={20} height={20} />
                    </span>
                    <span>
                        <strong>Skinvincible Store:</strong>
                        <p className='text-xs'>
                            Buy the best products at cheaper prices.
                        </p>
                    </span>
                </li>
            </ul>
            <Button
                className="w-full bg-[#C37F38] hover:bg-[#B36F28] text-white font-semibold py-2.5 rounded-lg text-sm"
                onClick={() => {
                    console.log(`Selected plan: ${selectedPlan}`);
                    // Implement subscription logic here
                }}
            >
                Subscribe
            </Button>
        </div>
    );
};

export default PricingDialog;