"use client";

import React from "react";
import DisputesDetailsHeader from "./_components/disputes-details-header";
import DisputesDetails from "./_components/disputes-details";
import TimelineAndCommunication from "./_components/timeline-and-communication";
const Page = () => {

  return (
    <div className="mx-auto container pb-20">
      <DisputesDetailsHeader />

      <div className="mt-8">
        <DisputesDetails />
      </div>

      <div className="mt-8">
        <TimelineAndCommunication />
      </div>
    </div>
  );
};

export default Page;
