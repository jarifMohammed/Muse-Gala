import React, { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPassword;
