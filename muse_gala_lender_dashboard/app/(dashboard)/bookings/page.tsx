import React from "react";
import BookingsHeader from "./_components/bookings-header";
import BookingsTable from "./_components/bookings-table";
import ManualBookingsTable from "./_components/manual-bookings-table";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;
  const id = cu?.user?.id;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      <BookingsHeader token={token as string} id={id as string} />
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-6 space-x-8">
          <TabsTrigger 
            value="bookings" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0 text-base font-medium"
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger 
            value="manual-bookings" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-2 px-0 text-base font-medium"
          >
            Manual Bookings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <BookingsTable token={token as string} userID={id as string} />
        </TabsContent>
        <TabsContent value="manual-bookings">
          <ManualBookingsTable token={token as string} userID={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;