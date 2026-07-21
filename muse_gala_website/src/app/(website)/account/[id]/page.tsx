import React from "react";
import DisputeDetails from "../_components/view_dispute";

const page = ({ params }: { params: { id: string } }) => {
  console.log(params);
  return (
    <div className="mt-20">
      <DisputeDetails />
    </div>
  );
};

export default page;
