"use client";
import React, { useState } from "react";
import { ReportIssueModal } from "./ReportIssueModal";

const DisputeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center opacity-80 font-avenir tracking-widest border-b-2 border-gray-400 pb-4">
      <h1>Dispute Handling</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="border-b border-gray-400"
      >
        Report An Issue
      </button>
      {isOpen && <ReportIssueModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default DisputeHeader;
