import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://musegala.com.au/find-near-you/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
