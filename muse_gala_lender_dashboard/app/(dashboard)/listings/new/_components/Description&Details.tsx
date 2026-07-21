import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ListingFormValues } from '@/types/listings/index';
import React from 'react'
import { UseFormReturn } from 'react-hook-form';
interface Props {
    form: UseFormReturn<ListingFormValues>;
}
const DescriptionDetails = ({ form }: Props) => {
    return (
        <div>
            <div className='mb-[30px]'>
                <h1 className='font-normal text-2xl mb-2'> Description & Details</h1>
            </div>
            <div className='flex gap-3 flex-col'>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-[18px] text-[#891D33] mb-4'>Description *</FormLabel>
                            <FormControl>
                                <Input placeholder="eg. Classic Tee" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-[18px] text-[#891D33] mb-4'>Materials *</FormLabel>
                            <FormControl>
                                <Input placeholder="eg. Classic Tee" {...field} value={field.value as string} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

        </div>
    )
}

export default DescriptionDetails