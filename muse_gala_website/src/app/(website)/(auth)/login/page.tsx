import Image from 'next/image'
import LoginForm from './_components/LoginForm'

const Page = () => {
  return (
    <div className="bg-white pt-[20px] pb-[40px] md:pb-[100px]">
      <div className="mt-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px] md:gap-[40px] lg:gap-[60px] px-5 md:px-0">
          {/* Left side image */}
          <div className="md:col-span-3 h-[500px] md:h-[794px] w-full">
            <Image
              src="/pages/alreadyPartofMuse.webp"
              alt="sign-up"
              width={1000}
              height={1000}
              quality={100}
              priority
              className="object-cover h-full w-full"
            />
          </div>

          {/* Right side form */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Page
