import HowItWork from "@/components/HowItWork";
import ServiceFeatures from "@/components/ServiceFeatures";
import GiveAndTake from "@/components/section/GiveAndTake";
import Link from "next/link";
import FindNearDressSection from "../_components/find-near-dress-section";
import DynamicBanner from "@/components/DynamicBanner";
import TrendingNow from "@/components/landing-products-page/trending-products-section";
import TheMuseEdit from "@/components/landing-products-page/muse-edit-page";
import StyledByYou from "@/components/section/style-by-you";

export default function Home() {
  return (
    <div className="space-y-8 md:space-y-12">
      <DynamicBanner />

      <div className=" bg-white space-y-12">
        <div>
          <TrendingNow />
        </div>

        <div>
          <FindNearDressSection />
        </div>

        <HowItWork />
        <div>
          <TheMuseEdit />
        </div>

        <ServiceFeatures />

        <div>
          <StyledByYou />
        </div>

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 py-4 md:py-6 space-y-12 md:space-y-24">
          {/* Header */}
          <header className="text-center mb-12 md:mb-16">
            <h1 className="headerClass uppercase">Muse Gals Say</h1>
            <div className="flex justify-center">
              <Link href="/shop" className="inline-block border-b border-black py-2 text-[14px] uppercase tracking-widest hover:bg-black hover:text-white font-avenir font-light">
                Browse The Edit
              </Link>
            </div>
          </header>

          {/* MUSE GALS SAY */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 md:mb-24">
            <div className="flex flex-col space-y-2">
              <p className="text-[12px] font-light font-avenir ">
                “Found a dress in minutes. Booking was straightforward.”
              </p>
              <span className="text-[13px] text-gray-600 uppercase font-avenir font-light">
                Sophie B.
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-[12px] font-light font-avenir ">
                “Loved being able to see what was available near me.”
              </p>
              <span className="text-[13px] text-gray-600 uppercase font-avenir font-light">Amelia R.</span>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-[12px] font-light font-avenir ">
                “Everything arrived on time and exactly as described.”
              </p>
              <span className="text-[13px] text-gray-600 uppercase font-avenir font-light">Isabella M.</span>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-[12px] font-light font-avenir ">
                “Easy to book. Easy to return. I always use this platform when I don’t know what to wear.”
              </p>
              <span className="text-[13px] text-gray-600 uppercase font-avenir font-light">Chloe T.</span>
            </div>
          </section>

          {/* List With Us */}
          <section className="text-center mb-16">
            <h2 className="headerClass uppercase">List With Us</h2>
            <p className="text-[12px] max-w-3xl !normal-case mx-auto mb-8 font-avenir font-light">
              No listing fees. No lock-ins. Just more exposure, more rentals,
              and a seamless dashboard.
            </p>
            <div className="flex justify-center">
              <Link
                href="/become-lender"
                className="inline-block border-b border-black py-2 text-[14px] uppercase tracking-widest hover:bg-black hover:text-white font-avenir font-light"
              >
                Become A Lender
              </Link>
            </div>
          </section>

          <GiveAndTake />
        </div>
      </div>
    </div>
  );
}
