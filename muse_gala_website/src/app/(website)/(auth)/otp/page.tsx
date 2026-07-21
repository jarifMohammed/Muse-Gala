import React, { Suspense } from "react";
import OtpForm from "./_components/OtpForm";

const Otp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-white pt-[100px] pb-[40px] md:pb-[100px] lg:pb-[160px]">
        <OtpForm />
      </div>
    </Suspense>
  );
};

export default Otp;
