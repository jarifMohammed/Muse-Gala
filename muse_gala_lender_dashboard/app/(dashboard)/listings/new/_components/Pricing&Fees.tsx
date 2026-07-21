import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ListingFormValues } from '@/types/listings/index';
import React from 'react'
import { UseFormReturn } from 'react-hook-form';
interface Props {
    form: UseFormReturn<ListingFormValues>;
}
const PricingFees = ({ form }: Props) => {
    return (
        <Card className="py-5">
            <CardContent>
                <div>
                    <div className='mb-8'>
                        <h1 className='font-normal text-2xl mb-2'> Pricing & Fees</h1>
                        <p className='text-[10px]'>Note: This listing price is inclusive of dry-cleaning fees.</p>
                    </div>
                    <div className='flex gap-[30px] flex-col'>
                        <FormField
                            control={form.control}
                            name="rentalPrice4days"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-[18px] text-[#891D33] mb-4'>Rental Price ($ / 4 days) *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="eg. Classic Tee" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rentalPrice8days"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-[18px] text-[#891D33] mb-4'>Rental Price ($ / 8 days) *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="eg. Classic Tee" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>
            </CardContent>
        </Card>

    )
}

export default PricingFees