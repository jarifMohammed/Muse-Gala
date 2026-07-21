import Image from "next/image";
import React from "react";

interface Props {
  title1: string;
  title2: string;
  desc: string;
}

const AuthHeader = ({ title1, title2, desc }: Props) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-[35px] md:mb-[50px] lg:mb-[69px]">
        <Image src="/images/auth-logo.png" alt="Logo" width={94} height={80} />
      </div>

      {/* Heading */}
      <div className="text-center pb-[12px] md:pb-[15px]">
        <h1 className="font-avenirArabic text-[24px] font-light text-black tracking-header uppercase mb-2">
          {title1} <span className="">{title2}</span>
        </h1>
        <p className="font-avenir text-[16px] font-normal text-black tracking-subheader uppercase leading-[235%]">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
