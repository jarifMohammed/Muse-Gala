"use client";

import { useState } from "react";
// No accordion imports needed

export default function FAQSection() {
  const [openCategory, setOpenCategory] = useState<string | null>("about");

  const faqCategories = [
    {
      id: "about",
      title: "ABOUT THE PLATFORM",
      questions: [
        {
          question: "What is your platform about?",
          answer:
            "Our platform allows you to rent high-quality items for specific periods. We handle shipping, returns, and ensure all items are verified for quality.",
        },
        {
          question: "How does the rental process work?",
          answer:
            "Browse our collection, select your rental period, and checkout. We'll ship the item to you and provide a prepaid return label for when your rental period ends.",
        },
      ],
    },
    {
      id: "booking",
      title: "BOOKING & RENTAL PERIODS",
      questions: [
        {
          question: "How far in advance can I book?",
          answer:
            "You can book items up to 3 months in advance, subject to availability.",
        },
        {
          question: "Can I extend my rental period?",
          answer:
            "Yes, you can extend your rental period through your account dashboard, provided the item isn't already booked by someone else.",
        },
      ],
    },
    {
      id: "shipping",
      title: "SHIPPING & RETURNS",
      questions: [
        {
          question: "How much is shipping?",
          answer:
            "Express shipping is $14.95, paid by you at checkout. Return shipping is covered by us and comes with a prepaid label which you must print and attach to the parcel.",
        },
        {
          question: "Do I have to return the item myself?",
          answer:
            "Yes – if you selected shipping you'll return it using the prepaid label. If you chose local pickup, you'll be asked whether you plan to drop the item back off or pay for return shipping ($14.95).",
        },
        {
          question: "What if my item doesn't arrive in time?",
          answer:
            "We do our best to ensure items arrive before your event. If there's an unexpected delay, reach out to our support team and we'll work with the lender to resolve it.",
        },
      ],
    },
    {
      id: "payments",
      title: "PAYMENTS, FEES & INSURANCE",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and Apple Pay.",
        },
        {
          question: "Is insurance included in the rental price?",
          answer:
            "Basic insurance is included, covering minor damages. For valuable items, we recommend purchasing additional protection at checkout.",
        },
      ],
    },
    {
      id: "verification",
      title: "VERIFICATION & TRUST",
      questions: [
        {
          question: "How do you verify users?",
          answer:
            "We verify all users through ID verification, payment method validation, and review history.",
        },
        {
          question: "Are the items quality-checked?",
          answer:
            "Yes, all items are verified by our team or trusted partners before being listed on our platform.",
        },
      ],
    },
    {
      id: "returns",
      title: "RETURNS, SWAPS & REFUNDS",
      questions: [
        {
          question: "What is your refund policy?",
          answer:
            "If you cancel more than 7 days before your rental period, you'll receive a full refund. Cancellations within 7 days receive a partial refund or store credit.",
        },
        {
          question: "Can I swap an item if it doesn't fit?",
          answer:
            "Yes, you can request a swap within 24 hours of receiving the item, subject to availability and a small exchange fee.",
        },
      ],
    },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div id="faq" className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 font-avenir">
      <h1 className="headerClass text-center pb-[30px] md:pb-[45px] lg:pb-[60px]">
        F A Q
      </h1>

      <div className="space-y-4">
        {faqCategories.map((category) => (
          <div
            key={category.id}
            className={`${category.id
              ? "border-b-[1px] border-black"
              : "border-t-[1px] border-black"
              }`}
          >
            <button
              onClick={() => handleCategoryToggle(category.id)}
              className="flex justify-between items-center w-full pb-2 pt-3 text-left text-[16px] font-avenir font-light text-black leading-[24px] focus:outline-none"
            >
              <span>{category.title}</span>
              <svg
                className={`w-4 h-4 transition-transform ${openCategory === category.id ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openCategory === category.id && (
              <div
                className={`${openCategory === category.id
                  ? "border-t-[1px] border-black"
                  : "border-0"
                  } pb-6 animate-fadeIn`}
              >
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className=" pt-4">
                      <h3 className="text-[16px] font-avenir font-light text-black leading-[24px] mb-2 uppercase tracking-wider">
                        {faq.question}
                      </h3>
                      <p className="text-[14px] font-avenir font-light text-black leading-[24px]">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
