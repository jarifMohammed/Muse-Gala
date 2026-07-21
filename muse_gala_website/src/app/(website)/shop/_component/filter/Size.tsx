'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useFilterStore } from '@/zustand/filterStore'

const Size = () => {
  const { size, setSize } = useFilterStore()

  const labels = [
    {
      id: 1,
      label: 'XXS',
    },
    {
      id: 2,
      label: 'XS',
    },
    {
      id: 3,
      label: 'S',
    },
    {
      id: 4,
      label: 'M',
    },
    {
      id: 5,
      label: 'L',
    },
    {
      id: 6,
      label: 'XL',
    },
    {
      id: 7,
      label: 'XXL',
    },
    // {
    //   id: 8,
    //   label: 'XXXL',
    // },
  ]

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="uppercase font-avenir tracking-widest opacity-75 border-b border-black pb-2">
          Size
        </AccordionTrigger>
        <AccordionContent className="text-balance mt-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            {labels.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`size-${item.label}`}
                  value={item.label}
                  checked={size === item.label}
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    setSize(isChecked ? item.label : '')
                  }}
                  className="h-4 w-4 accent-black"
                />
                <label
                  htmlFor={`size-${item.label}`}
                  className="font-avenir tracking-[0.2rem] opacity-75 uppercase cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Size
