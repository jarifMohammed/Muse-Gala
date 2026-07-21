import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MrrData } from "./MRR";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mrrData: MrrData;
}

const TotalMrrPopup = ({ open, onOpenChange, mrrData }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-5xl h-[700px] overflow-y-auto scrollbar">
          <div className="border border-gray-200 rounded-lg mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Customer Id</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">
                    Subscription Start
                  </TableHead>
                  <TableHead className="text-center">
                    subscription End
                  </TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {mrrData?.activeSubscribers?.map((item) => (
                  <TableRow key={item?._id} className="text-center">
                    <TableCell>{item?.customerId}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>
                      {new Date(item?.subscriptionStart).toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(item?.subscriptionEnd).toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                    <TableCell>$ {item?.amount || "0"}</TableCell>
                    <TableCell>
                      <button
                        className={`py-1 px-2 font-medium rounded-md text-xs ${
                          item?.status === "Pending" &&
                          "bg-orange-200 text-orange-800"
                        } ${
                          item?.status === "Approved" &&
                          "bg-blue-200 text-blue-800"
                        } ${
                          item?.status === "Cancelled" &&
                          "bg-red-200 text-red-800"
                        } ${
                          item?.status === "Paid" &&
                          "bg-green-200 text-green-800"
                        } `}
                      >
                        {item?.status}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default TotalMrrPopup;
