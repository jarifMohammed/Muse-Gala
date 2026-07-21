import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/shop/checkout/",
          "/login",
          "/sign-up",
          "/forgot-password",
          "/reset-password",
          "/otp",
          "/api/",
        ],
      },
    ],
    sitemap: "https://musegala.com.au/sitemap.xml",
  };
}