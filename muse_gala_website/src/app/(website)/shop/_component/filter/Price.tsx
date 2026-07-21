'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/zustand/filterStore";

const Price = () => {
  const { minPrice, maxPrice, setMinPrice, setMaxPrice } = useFilterStore();

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="uppercase font-avenir tracking-widest opacity-75 border-b border-black pb-2">
          Price
        </AccordionTrigger>
        <AccordionContent className="flex items-center gap-4 text-balance mt-4">
          <Input
            className="focus-visible:ring-0 placeholder:font-avenir placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
            placeholder="min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <div className="w-10 border-b border-gray-300"></div>
          <Input
            className="focus-visible:ring-0 placeholder:font-avenir placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
            placeholder="max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Price;
