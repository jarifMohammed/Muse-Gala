import { NotFoundUI } from "@/components/ui/not-found";

export default function BookingsNotFound() {
  return (
    <NotFoundUI
      title="Not Found on Help Center"
      description="We couldn't find the one you're looking for. It may have been canceled or the URL might be incorrect."
      // imageSrc="/woman-green-dress.png"
      // primaryActionLabel="View All Bookings"
      primaryActionHref="/help-center"
    />
  );
}
