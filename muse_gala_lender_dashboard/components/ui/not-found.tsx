"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

export function NotFoundUI({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  imageSrc = "/elegant-dress.png",
  primaryActionLabel = "Return Home",
  primaryActionHref = "/",
  secondaryActionLabel = "Go Back",
  secondaryActionHref = "",
}: NotFoundProps) {
  const router = useRouter();

  const handlePrimaryAction = () => {
    router.push(primaryActionHref);
  };

  const handleSecondaryAction = () => {
    if (secondaryActionHref) {
      router.push(secondaryActionHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#fefaf6] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt="Not found illustration"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-[#891d33]/10">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#891d33] mb-4">{title}</h1>

        <p className="text-gray-600 mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSecondaryAction}
            variant="outline"
            className="border-[#891d33] text-[#891d33] hover:bg-[#891d33]/10"
          >
            {secondaryActionLabel}
          </Button>

          <Button
            onClick={handlePrimaryAction}
            className="bg-[#891d33] hover:bg-[#691526] text-white"
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
