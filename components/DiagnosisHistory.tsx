import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Markdown } from './Markdown';
import { ClipboardCopyIcon } from '@radix-ui/react-icons';
import { toast } from "sonner";

interface Diagnosis {
    id: string;
    diagnosis: string;
    comment: string | null;
    createdAt: string;
}

interface DiagnosisHistoryProps {
    userEmail: string;
}

const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({ userEmail }) => {
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiagnoses();
    }, [userEmail]);

    const fetchDiagnoses = async () => {
        try {
            const response = await fetch('/api/get-diagnoses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch diagnoses');
            }
            const data = await response.json();
            setDiagnoses(data);
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
            toast.error("Failed to fetch diagnosis history");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard");
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            toast.error("Failed to copy to clipboard");
        });
    };

    return (
        <div className="flex flex-col h-full max-h-[85vh] w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-[#C37F38] mb-4 px-4 pt-4">Diagnosis History</h2>
            <ScrollArea className="flex-grow px-4 pb-12">
                {loading ? (
                    <p className="text-center text-gray-500 py-4">Loading diagnoses...</p>
                ) : diagnoses.length === 0 ? (
                    <p className="text-center text-gray-500">No diagnosis history found.</p>
                ) : (
                    <div className="space-y-4 h-[85vh]">
                        {diagnoses.map((diagnosis) => (
                            <div key={diagnosis.id} className="p-4 border border-[#F7C189] rounded-lg bg-orange-50">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-[#C37F38] text-sm">
                                        {new Date(diagnosis.createdAt).toLocaleString()}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(diagnosis.diagnosis)}
                                        className="text-[#C37F38] hover:bg-orange-100"
                                    >
                                        <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                </div>
                                <div className="prose prose-sm max-w-none">
                                    <Markdown>{diagnosis.diagnosis}</Markdown>
                                </div>
                                {diagnosis.comment && (
                                    <p className="text-sm mt-2 italic text-gray-600">Comment: {diagnosis.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default DiagnosisHistory;