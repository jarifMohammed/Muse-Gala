import Image from "next/image";

const AuthHeader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-[35px] md:mb-[50px] lg:mb-[69px]">
  <Image
    src="/logo.svg"
    alt="Logo"
    width={200} 
    height={200} 
    unoptimized
  />
</div>

      {/* Heading */}
      <div className="text-center pb-[12px] md:pb-[15px]">
        <h1 className="font-light text-[24px] uppercase text-black leading-none tracking-20 mb-[23.5px]">
          MUSE GALA
        </h1>
        <p className="font-normal text-[16px] uppercase text-black leading-none tracking-10">
          THE ADMIN SUITE
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
