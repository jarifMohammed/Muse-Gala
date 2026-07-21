import type { MetadataRoute } from "next";

const baseUrl = "https://musegala.com.au";

const publicPages = [
  "/",
  "/about",
  "/become-lender",
  "/become-lender/form",
  "/booking-success",
  "/contact-us",
  "/find-near-you",
  "/find-near-you/map",
  "/how-it-works",
  "/insurance-policy",
  "/lender-faq",
  "/privacy-policy",
  "/refund-policy",
  "/shop",
  "/terms-and-conditions",
  "/dispute-resolution",
  "/dispute-resolution-policy",
  "/lender-terms-and-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}