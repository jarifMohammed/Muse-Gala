"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CancelModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CancelOrderModal({
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
}: CancelModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[500px] p-[60px]">
        <div className="w-full flex items-center justify-center mb-[50px]">
            <Image src="/images/order-modal-logo.png" alt="logo" width={70} height={60} className="w-[70px] h-[60px] object-cover"/>
          </div>

        <div className="text-center -mt-4">
          <h2 className="text-2xl text-black leading-[120%] font-avenirNormal font-medium tracking-[0%] mb-[15px]">
            Are you sure you want to cancel this booking?
          </h2>

          <p className="text-center text-sm text-black tracking-[0%] leading-[120%] font-avenirNormal font-normal mb-[60px]">
            Please confirm that the item was not provided to the customer. Once
            cancelled, the customer will be refunded full amount and this
            booking will be closed.
          </p>

          <div className="flex flex-col sm:flex-row gap-[29px] justify-center">
            <Button
              onClick={onConfirm}
              className="text-base font-normal text-white font-avenirNormal tracking-[0%] leading-[120%] bg-[#891D33] rounded-[8px]  py-[10px] px-[16px]"
            >
              Confirm Cancellation
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="text-sm font-normal font-avenirNormal tracking-[0%] leading-[120%] text-[#891D33] border-[#891D33] rounded-[8px] py-[11px] px-[20px]"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
