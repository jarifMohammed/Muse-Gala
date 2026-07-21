import UpdateStatus from "./update-status";
import { Box, CalendarClock, Check, Mail, MapPinCheck, MapPinned, Navigation, Package, Shirt, ShoppingBag, Truck, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";
import AcceptStatus from "./accept-status";

const Dress = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2L9 7H15L12 2Z" />
    <path d="M9 7L5 22H19L15 7H9Z" />
    <path d="M9 7L10 12M15 7L14 12" />
  </svg>
);

interface Props {
  deliveryStatus?: string;
  paymentStatus?: string;
  token: string;
  lenderId: string;
}

const PickupStatus = ({ deliveryStatus, paymentStatus, token, lenderId }: Props) => {
  const params = useParams();
  const bookingId = params.id;

  const statusOrder = [
    "Pending",
    "ReadyForPickup",
    "PickedUpByCustomer",
    "Return Due",
    "ReturnLinkSent",
    "INTransit",
    "Dress Returned",
    "Late Return",
  ];

  const getCurrentIndex = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return 0;
    if (s.includes("accept") || s === "confirmed") return 0; // In pickup-status, Pending seems to be the baseline
    if (s === "readyforpickup") return 1;
    if (s === "pickedupbycustomer") return 2;
    if (s === "dress returned") return 6;
    if (s.includes("late")) return 7;
    if (s.includes("receive")) return 6;
    if (s === "intransit" || s === "in transit") return 5;
    if (s === "returnlinksent" || s === "return link sent") return 4;
    if (s === "return due") return 3;

    return 3;
  };

  const normStatus = (deliveryStatus || "").toLowerCase();
  const currentIndex = getCurrentIndex(deliveryStatus as string);

const StaticStatus = ({
  Icon,
  label,
  isCompleted,
  isNextCompleted,
  isLastStep,
}: {
  Icon: any;
  label: string;
  isCompleted: boolean;
  isNextCompleted: boolean;
  isLastStep?: boolean;
}) => (
  <div className="flex-1 min-w-[140px] relative flex flex-col items-center group">
    <div className="relative flex justify-center items-center w-full mb-3 h-14">
      {!isLastStep && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-colors duration-500 ${isNextCompleted ? "bg-primary" : "bg-neutral-200"}`}
          style={{ left: "50%", right: "-50%", zIndex: 0 }}
        />
      )}
      <div
        className={`h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2 shadow-sm flex-shrink-0 ${isCompleted
          ? "bg-primary border-primary text-white scale-110 shadow-primary/20"
          : "bg-white border-neutral-200 text-neutral-400"
          }`}
      >
        <Icon className={`h-6 w-6 transition-transform duration-300 ${isCompleted ? "scale-110" : ""}`} />
      </div>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400 opacity-60">
        {label}
      </span>
    </div>
  </div>
);

  const getStep3Label = (status: string) => {
    const s = status.toLowerCase();
    if (s === "return due") return "Return Due";

    const knownStatuses = [
      "pending",
      "accept",
      "confirmed",
      "shippedtocustomer",
      "readyforpickup",
      "pickedupbycustomer",
      "returnlinksent",
      "intransit",
      "receive",
      "late",
      "dress returned",
    ];

    const isKnown = knownStatuses.some((ks) => s.includes(ks));
    if (!isKnown) return "Return Due";

    return "Initiate Return";
  };

  const step3Label = getStep3Label(normStatus);
  const isLate = normStatus.includes("late") || currentIndex >= statusOrder.indexOf("Late Return");

  return (
    <div className="max-w-full overflow-x-auto pb-4 -mb-4">
      <div className="flex w-fit min-w-full items-start py-6">
        {/* accept/reject */}
        <div className="flex-1 min-w-[140px] relative">
          <AcceptStatus
            deliveryStatus={deliveryStatus as string}
            paymentStatus={paymentStatus as string}
            token={token}
            bookingId={bookingId as string}
            lenderId={lenderId}
            isNextCompleted={currentIndex >= statusOrder.indexOf("ReadyForPickup")}
          />
        </div>

        {/* ready for pickup */}
        <div className="flex-1 min-w-[140px] relative">
          <UpdateStatus
            deliveryStatus={deliveryStatus as string}
            statusValue="ReadyForPickup"
            negativeStatusValue="Cannot Fullfill"
            negativeBtnName="Cannot Fulfill"
            completedBtnName="Ready"
            IconName={Check}
            bookingId={bookingId as string}
            btnName="Ready for Pickup"
            token={token}
            isCompleted={currentIndex >= statusOrder.indexOf("ReadyForPickup")}
            isDisabled={currentIndex !== statusOrder.indexOf("Pending")}
            isNextCompleted={currentIndex >= statusOrder.indexOf("PickedUpByCustomer")}
          />
        </div>

        {/* mark as shipped */}
        <div className="flex-1 min-w-[140px] relative">
          <UpdateStatus
            deliveryStatus={deliveryStatus as string}
            statusValue="PickedUpByCustomer"
            completedBtnName="Picked Up"
            IconName={MapPinCheck}
            bookingId={bookingId as string}
            btnName="Picked Up By Customer"
            token={token}
            isCompleted={currentIndex >= statusOrder.indexOf("PickedUpByCustomer")}
            isDisabled={currentIndex !== statusOrder.indexOf("ReadyForPickup")}
            isNextCompleted={currentIndex >= statusOrder.indexOf("Return Due")}
          />
        </div>

        {/* return due / in use */}
        <div className="flex-1 min-w-[140px] relative">
          <UpdateStatus
            deliveryStatus={deliveryStatus as string}
            statusValue="Return Due"
            completedBtnName={step3Label}
            IconName={step3Label === "Return Due" ? CalendarClock : ShoppingBag}
            bookingId={bookingId as string}
            btnName={step3Label}
            token={token}
            isCompleted={currentIndex >= statusOrder.indexOf("Return Due")}
            isDisabled={currentIndex !== statusOrder.indexOf("PickedUpByCustomer")}
            isNextCompleted={currentIndex >= statusOrder.indexOf("ReturnLinkSent")}
          />
        </div>

        {/* Return Steps */}
        <StaticStatus
          Icon={Mail}
          label="Link Sent"
          isCompleted={currentIndex >= statusOrder.indexOf("ReturnLinkSent")}
          isNextCompleted={currentIndex >= statusOrder.indexOf("INTransit")}
        />
        <StaticStatus
          Icon={Navigation}
          label="In Transit"
          isCompleted={currentIndex >= statusOrder.indexOf("INTransit")}
          isNextCompleted={currentIndex >= statusOrder.indexOf("Dress Returned")}
        />

        {/* dress returned */}
        <div className="flex-1 min-w-[140px] relative">
          <UpdateStatus
            deliveryStatus={deliveryStatus as string}
            statusValue="Dress Returned"
            completedBtnName="Returned"
            IconName={Package}
            bookingId={bookingId as string}
            btnName="Dress Returned"
            token={token}
            isCompleted={currentIndex >= statusOrder.indexOf("Dress Returned")}
            isDisabled={currentIndex < statusOrder.indexOf("Return Due")}
            isNextCompleted={isLate}
            isLastStep={!isLate}
          />
        </div>

        {/* late return (only shown if status is late) */}
        {isLate && (
          <div className="flex-1 min-w-[140px] relative">
            <UpdateStatus
              deliveryStatus={deliveryStatus as string}
              statusValue="Late Return"
              completedBtnName="Late Return"
              IconName={Undo2}
              bookingId={bookingId as string}
              btnName="Late Return"
              token={token}
              isCompleted={true}
              isDisabled={false}
              isNextCompleted={false}
              isLastStep={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupStatus;
