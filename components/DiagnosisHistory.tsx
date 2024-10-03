import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userEmail: string;
}

const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({ open, onOpenChange, userEmail }) => {
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            fetchDiagnoses();
        }
    }, [open, userEmail]);

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#C37F38]">Diagnosis History</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <p className="text-center text-gray-500">Loading diagnoses...</p>
                ) : (
                    <ScrollArea className="h-[400px] w-full pr-4">
                        {diagnoses.length === 0 ? (
                            <p className="text-center text-gray-500">No diagnosis history found.</p>
                        ) : (
                            diagnoses.map((diagnosis) => (
                                <div key={diagnosis.id} className="mb-4 p-4 border border-[#F7C189] rounded-lg bg-orange-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-[#C37F38]">{new Date(diagnosis.createdAt).toLocaleString()}</p>
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
                                    <Markdown>{diagnosis.diagnosis}</Markdown>
                                    {diagnosis.comment && (
                                        <p className="text-sm mt-2 italic text-gray-600">Comment: {diagnosis.comment}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </ScrollArea>
                )}
                <Button onClick={() => onOpenChange(false)} className="w-full bg-[#C37F38] hover:bg-[#D18D46] text-white">Close</Button>
            </DialogContent>
        </Dialog>
    );
};

export default DiagnosisHistory;