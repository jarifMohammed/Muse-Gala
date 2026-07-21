import { auth } from "@/auth";
import PaymentSuccess from "./_components/payment-success";

const page = async () => {
  const cu = await auth();
  const id = cu?.user?.id;
  const token = cu?.user?.accessToken;

  return (
    <div>
      <PaymentSuccess token={token as string} id={id as string} />
    </div>
  );
};

export default page;
