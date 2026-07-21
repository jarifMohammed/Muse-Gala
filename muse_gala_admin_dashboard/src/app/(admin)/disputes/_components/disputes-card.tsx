import React from "react";

interface Props {
  title: string;
  value: string;
}

const DisputesCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5  rounded-lg flex flex-col justify-center hover:bg-black hover:text-white cursor-pointer delay-100 transition-all">
      <h1>{title}</h1>
      <p className="font-medium text-2xl mt-5">{value}</p>
    </div>
  );
};

export default DisputesCard;
