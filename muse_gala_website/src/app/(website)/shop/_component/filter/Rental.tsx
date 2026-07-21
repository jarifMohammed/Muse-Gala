'use client'

import { useFilterStore } from '@/zustand/filterStore'

const Rental = () => {
  const { fourDayRental, setFourDayRental, eightDayRental, setEightDayRental } = useFilterStore()

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center gap-3">
        <input className="h-4 w-4" type="checkbox" id="XXS" />
        <label
          htmlFor="XXS"
          className="font-avenir tracking-[0.2rem] opacity-75 uppercase"
        >
          Available Near Me
        </label>
      </div> */}

      <div className="flex items-center gap-3">
        <input
          className="h-4 w-4 accent-black cursor-pointer"
          type="checkbox"
          id="four-day-rental"
          checked={fourDayRental}
          onChange={(e) => setFourDayRental(e.target.checked)}
        />
        <label
          htmlFor="four-day-rental"
          className="font-avenir tracking-[0.2rem] opacity-75 uppercase cursor-pointer"
        >
          4-Day Rental
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="h-4 w-4 accent-black cursor-pointer"
          type="checkbox"
          id="eight-day-rental"
          checked={eightDayRental}
          onChange={(e) => setEightDayRental(e.target.checked)}
        />
        <label
          htmlFor="eight-day-rental"
          className="font-avenir tracking-[0.2rem] opacity-75 uppercase cursor-pointer"
        >
          8-DAY RENTAL
        </label>
      </div>
    </div>
  )
}

export default Rental
