import React from "react";
import DisputeHeader from "./dispute-header";
import AllDisputes from "./all-disputes";

const Disputes = ({token} : {token : string}) => {
  return (
    <div>
      <DisputeHeader />
      <AllDisputes token={token as string} />
    </div>
  );
};

export default Disputes;
