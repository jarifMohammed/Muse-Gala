import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UploadCloud, CheckCircle2, Info } from 'lucide-react';

const returnFormSchema = z.object({
    returnMethod: z.string().min(1, 'Please select a return method'),
    trackingNumber: z.string().optional(),
    returnNotes: z.string().optional(),
}).refine(data => {
    if (data.returnMethod === 'ExpressShipping' && !data.trackingNumber) {
        return false;
    }
    return true;
}, {
    message: "Tracking number is required for Express Shipping",
    path: ["trackingNumber"]
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
    readonly token: string;
    readonly onSuccess: () => void;
}

export default function ReturnForm({
    token,
    onSuccess
}: ReturnFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<ReturnFormValues>({
        resolver: zodResolver(returnFormSchema),
        defaultValues: {
            returnMethod: '',
            trackingNumber: '',
            returnNotes: ''
        }
    });

    const returnMethod = watch('returnMethod');

    const onSubmit = async (values: ReturnFormValues) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('returnMethod', values.returnMethod);
            if (values.trackingNumber) {
                formData.append('trackingNumber', values.trackingNumber);
            }
            if (values.returnNotes) {
                formData.append('returnNotes', values.returnNotes);
            }
            if (selectedFile) {
                formData.append('receiptPhoto', selectedFile);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/return/${token}/submit`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit return confirmation');
            }

            toast.success('Return confirmed successfully');
            onSuccess();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'An error occurred. Please try again.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">


            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pt-10 pb-6 px-8 text-center border-b border-gray-50">
                    <CardTitle className="text-xl font-light tracking-tight">Confirm Your Return</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-[0.15em] mt-2 opacity-60">
                        Finalize your rental journey
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="p-8 space-y-8">
                        {/* Return Method Selection */}
                        <div className="space-y-4">
                            <Label className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">Select Return Method</Label>
                            <Controller
                                name="returnMethod"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid gap-4"
                                    >
                                        <div className={`relative group flex items-center space-x-3 border rounded-xl p-5 transition-all duration-300 ${field.value === 'LocalDropOff' ? 'border-primary bg-primary/[0.02] ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'}`}>
                                            <RadioGroupItem value="LocalDropOff" id="LocalDropOff" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${field.value === 'LocalDropOff' ? 'border-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                {field.value === 'LocalDropOff' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <Label htmlFor="LocalDropOff" className="flex-1 font-medium text-sm tracking-tight text-gray-700">Local Drop-Off</Label>
                                        </div>

                                        <div className={`relative group flex items-center space-x-3 border rounded-xl p-5 transition-all duration-300 ${field.value === 'ExpressShipping' ? 'border-primary bg-primary/[0.02] ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'}`}>
                                            <RadioGroupItem value="ExpressShipping" id="ExpressShipping" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${field.value === 'ExpressShipping' ? 'border-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                {field.value === 'ExpressShipping' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <Label htmlFor="ExpressShipping" className="flex-1 font-medium text-sm tracking-tight text-gray-700">Express Shipping</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.returnMethod && <p className="text-[10px] text-destructive uppercase tracking-widest font-semibold">{errors.returnMethod.message}</p>}
                        </div>

                        {/* Tracking Number (Conditional) */}
                        {returnMethod === 'ExpressShipping' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-400">
                                <Label htmlFor="trackingNumber" className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                                    Tracking Number
                                </Label>
                                <Input
                                    id="trackingNumber"
                                    placeholder="Enter your tracking code"
                                    {...register('trackingNumber')}
                                    className={`h-12 bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-sm rounded-xl ${errors.trackingNumber ? 'border-destructive focus:ring-destructive' : ''}`}
                                />
                                {errors.trackingNumber && <p className="text-[10px] text-destructive uppercase tracking-widest font-semibold">{errors.trackingNumber.message}</p>}
                            </div>
                        )}

                        {/* Tracking Notes */}
                        <div className="space-y-3">
                            <Label htmlFor="returnNotes" className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">Tracking Notes</Label>
                            <div className="flex items-start gap-2 text-[10px] text-muted-foreground/70 italic mb-2">
                                <Info size={12} className="text-primary mt-0.5" />
                                <span>Please include the direct tracking link in the field below.</span>
                            </div>
                            <Textarea
                                id="returnNotes"
                                placeholder="Paste tracking link or additional details here..."
                                className="min-h-[100px] bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-sm rounded-xl resize-none"
                                {...register('returnNotes')}
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                            <Label className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">Upload Receipt (Optional)</Label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 text-center ${selectedFile ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50/50 hover:border-gray-200'}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {selectedFile ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-xs text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <UploadCloud className="w-8 h-8 mb-3 text-gray-300" />
                                        <p className="text-xs font-medium text-gray-600">Click to upload receipt or photo</p>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">PNG, JPG or PDF up to 5MB</p>
                                    </div>
                                )}
                            </button>
                            {selectedFile && (
                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] uppercase tracking-widest text-destructive hover:bg-destructive/5"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="px-8 pb-10 pt-2">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-xl text-xs uppercase tracking-[0.25em] font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Confirming...' : 'Submit Confirmation'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <p className="mt-8 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.1em]">
                &copy; {new Date().getFullYear()} Muse Gala. Minimalist Luxury Rental.
            </p>
        </div>
    );
}
