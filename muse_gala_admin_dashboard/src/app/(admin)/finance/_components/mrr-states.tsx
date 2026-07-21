import React, { useState } from "react";
import TotalMrrPopup from "./total-mrr-popup";
import NewSignupPopup from "./new-signup-popup";
import ChurnedUsersPopup from "./churned-users-popup";
import { MrrData } from "./MRR";

const MrrStates = ({ mrrData }: { mrrData: MrrData }) => {
  const [totalMrrOpen, setTotalMrrOpen] = useState(false);
  const [newSignUpOpen, setNewSignUp] = useState(false);
  const [churnedPopOpen, setChurnedPopUpOpen] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg hover:bg-black hover:text-white delay-100 transition-all">
        <button onClick={() => setTotalMrrOpen(true)} className="underline">
          Total MRR
        </button>
        <p className="font-medium text-2xl mt-5 font-serif">
          $ {mrrData?.totalMRR}
        </p>
      </div>

      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg hover:bg-black hover:text-white delay-100 transition-all">
        <button onClick={() => setNewSignUp(true)} className="underline">
          New Sign-ups
        </button>
        <p className="font-medium text-2xl mt-5 font-serif">
          {mrrData?.totalNewSignUps}
        </p>
      </div>

      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg hover:bg-black hover:text-white delay-100 transition-all">
        <button onClick={() => setChurnedPopUpOpen(true)} className="underline">
          Churned Users
        </button>
        <p className="font-medium text-2xl mt-5 font-serif">
          {mrrData?.totalCancelledSubscribers}
        </p>
      </div>

      <div>
        {totalMrrOpen && (
          <TotalMrrPopup
            open={totalMrrOpen}
            onOpenChange={() => setTotalMrrOpen(false)}
            mrrData={mrrData}
          />
        )}

        {newSignUpOpen && (
          <NewSignupPopup
            open={newSignUpOpen}
            onOpenChange={() => setNewSignUp(false)}
            mrrData={mrrData}
          />
        )}

        {churnedPopOpen && (
          <ChurnedUsersPopup
            open={churnedPopOpen}
            onOpenChange={() => setChurnedPopUpOpen(false)}
            mrrData={mrrData}
          />
        )}
      </div>
    </div>
  );
};

export default MrrStates;
