import React, { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="bg-white pt-[100px] pb-[40px] md:pb-[100px] lg:pb-[160px]">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPassword;
