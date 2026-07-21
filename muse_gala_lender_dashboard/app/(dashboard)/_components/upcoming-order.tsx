import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MessageCustomerButton from "@/components/message-customer-button";

interface Customer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface MasterDress {
  _id: string;
  thumbnail?: string;
  dressName?: string;
  name?: string;
  brand?: string;
  size?: string;
  colors?: string[];
}

interface UpcomingOrder {
  _id: string;
  masterdressId: MasterDress;
  dressName?: string;
  brand?: string;
  size?: string;
  color?: string;
  paymentStatus?: string;
  rentalStartDate: string;
  rentalEndDate: string;
  customer: Customer;
}

interface UpcomingOrderProps {
  upcomingOrders: UpcomingOrder[];
  isLoading: boolean;
  token: string;
}

const UpcomingOrder = ({ upcomingOrders, isLoading, token }: UpcomingOrderProps) => {
  const OrderSkeleton = () => (
    <div className="flex bg-[#FEFAF6] rounded-[8px] overflow-hidden">
      <Skeleton className="w-24 h-28 rounded-l-[8px]" />

      <div className="flex-1 pt-2 px-4 space-y-3 h-28">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Upcoming Orders</h3>
        <Link
          href="/bookings"
          className="text-xs text-gray-500 hover:underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <OrderSkeleton key={index} />
          ))
        ) : upcomingOrders?.length > 0 ? (
          upcomingOrders.map((order, index) => (
            <div
              key={order._id || index}
              className="flex bg-[#FEFAF6] rounded-[8px] overflow-hidden"
            >
              <div className="w-24 h-28 relative">
                <Image
                  src={order?.masterdressId?.thumbnail || "/placeholder.svg"}
                  alt={`Dress for booking ${order._id}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 py-2 px-4 space-y-1 h-28 min-w-0 overflow-y-auto scrollbar-hide">
                <p className="text-[13px] font-semibold truncate uppercase">
                  {order?.dressName || order?.masterdressId?.dressName || order?.masterdressId?.name || "N/A"}
                </p>
                
                <div className="flex flex-col space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-gray-600">
                      <span className="font-medium">Size:</span> {order?.size || order?.masterdressId?.size || "N/A"}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      <span className="font-medium">Color:</span> {order?.color || (order?.masterdressId?.colors && order?.masterdressId?.colors[0]) || "N/A"}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    <span className="font-medium">Customer:</span> {order?.customer?.firstName} {order?.customer?.lastName ? `${order.customer.lastName.charAt(0)}.` : ""}
                  </p>
                  {order?.paymentStatus && (
                    <p className="text-[11px] text-gray-600">
                      <span className="font-medium">Payment:</span>{" "}
                      <span className={order.paymentStatus === "Paid" ? "text-green-600" : "text-orange-600"}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-[#891D33] flex flex-wrap items-center gap-1 font-medium pt-0.5">
                  <span className="whitespace-nowrap italic">Rental: </span>
                  <span className="whitespace-nowrap">
                    {new Date(order?.rentalStartDate).toLocaleDateString()}
                  </span>
                  <span>-</span>
                  <span className="whitespace-nowrap">
                    {new Date(order?.rentalEndDate).toLocaleDateString()}
                  </span>
                </div>

                <MessageCustomerButton
                  bookingId={order._id}
                  accessToken={token}
                  size="sm"
                  className="h-7 px-2 text-[11px]"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingOrder;
