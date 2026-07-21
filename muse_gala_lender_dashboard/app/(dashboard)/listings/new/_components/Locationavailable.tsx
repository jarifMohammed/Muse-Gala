import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ListingFormValues } from "@/types/listings/index";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    form: UseFormReturn<ListingFormValues>;
}

const Locationavailable = ({ form }: Props) => {
    const [locationCount, setLocationCount] = useState(1);

    const addLocation = () => {
        setLocationCount((prev) => prev + 1);
        form.setValue(`locations.${locationCount}`, "");
    };

    const removeLocation = (index: number) => {
        setLocationCount((prev) => prev - 1);

        // remove the location from RHF values
        const current = form.getValues("locations");
        current.splice(index, 1);
        form.setValue("locations", [...current]);
    };

    return (
        <Card className="py-5">
            <CardContent>
                <div>
                    <h1 className="mb-[30px] text-[24px] font-normal">Location available</h1>
                </div>
                <div>
                    <FormLabel className='text-[18px] text-[#891D33] mb-4' >Pickup Address *</FormLabel>

                    {Array.from({ length: locationCount }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <FormField
                                control={form.control}
                                name={`locations.${index}`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., ### Fashion Ln, Sydney NSW ###"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {locationCount > 1 && (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => removeLocation(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            )}

                            {index === locationCount - 1 && (
                                <Button type="button" size="icon" onClick={addLocation}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

    );
};

export default Locationavailable;
