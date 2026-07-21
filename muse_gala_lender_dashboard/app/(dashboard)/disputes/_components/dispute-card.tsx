import React from "react";

interface Props {
  title: string;
  value: string;
}

const DisputeCard = ({ title, value }: Props) => {
  return (
    <div className="p-3 md:p-5 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg hover:bg-primary hover:text-white duration-300 transition-all cursor-pointer h-full flex flex-col justify-between">
      <h1 className="text-[10px] md:text-base font-medium">{title}</h1>
      <p className="mt-4 md:mt-8 text-sm md:text-base font-bold">{value}</p>
    </div>
  );
};

export default DisputeCard;
