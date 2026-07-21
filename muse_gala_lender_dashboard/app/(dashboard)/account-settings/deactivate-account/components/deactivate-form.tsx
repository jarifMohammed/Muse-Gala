"use client";

import ConfirmDeactivation from "./confirm-deactivation";
import DeactivateReason from "./deactivate-reason";
import Verification from "./verification";

const DeactivateForm = ({ token }: { token: string }) => {
  return (
    <div className="mt-8 space-y-8">
      <DeactivateReason token={token} />
      <ConfirmDeactivation token={token} />
      <Verification token={token} />
    </div>
  );
};

export default DeactivateForm;
