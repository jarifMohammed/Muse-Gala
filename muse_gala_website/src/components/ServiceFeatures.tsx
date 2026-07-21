import Image from "next/image";

export default function ServiceFeatures() {
  const features = [
    {
      imageSrc: "/images/check.svg",
      title: "Trusted Lenders",

    },
    {
      imageSrc: "/images/clock.svg",
      title: "Instant Booking",

    },
    {
      imageSrc: "/images/location.svg",
      title: "Find Near You",

    },
    {
      imageSrc: "/images/delivery-box.svg",
      title: "Pick Up Or Express Delivery",

    },

  ];

  return (
    <section className="py-4 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="mb-4 h-12 flex items-center justify-center">
                <Image
                  src={feature.imageSrc || "/placeholder.svg"}
                  alt={feature.title}
                  width={index >= 3 ? 45 : 35}
                  height={index >= 3 ? 45 : 35}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-sm font-avenir uppercase  tracking-wider mb-1">
                {feature.title}
              </h3>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
