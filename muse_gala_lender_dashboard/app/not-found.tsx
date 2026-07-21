"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/elegant-dress.png"
            alt="Elegant dress illustration"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl font-bold text-[#891d33]/10">404</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#891d33] mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          The dress you&apoch;re looking for seems to have walked off the runway. It
          might be getting fitted or simply doesn&apoch;t exist in our collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-[#891d33] text-[#891d33] hover:bg-[#891d33]/10"
          >
            Go Back
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="bg-[#891d33] hover:bg-[#691526] text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        <p>Need assistance? Contact our support team.</p>
      </div>
    </div>
  );
}
