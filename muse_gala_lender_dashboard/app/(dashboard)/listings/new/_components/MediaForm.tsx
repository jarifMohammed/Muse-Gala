import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ListingFormValues } from '@/types/listings/index';
import Image from 'next/image';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<ListingFormValues>;
}

const MediaForm = ({ form }: Props) => {
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <Card className="py-5">
            <CardContent>
                <div>
                    <h1 className="text-lg mb-[30px] font-normal text-[24px]">Media</h1>
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-[18px] text-[#891D33] mb-4'>Image *</FormLabel>
                                <FormControl>
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-white hover:border-gray-400 transition">
                                        {!field.value && <span className="text-gray-400">Select your file</span>}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                field.onChange(file);

                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    setPreview(url);
                                                } else {
                                                    setPreview(null);
                                                }
                                            }}
                                        />
                                        {preview && (
                                            <Image
                                                src={preview}
                                                alt="Preview"
                                                className="mt-2 max-h-32 object-contain"
                                            />
                                        )}
                                    </label>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default MediaForm;
