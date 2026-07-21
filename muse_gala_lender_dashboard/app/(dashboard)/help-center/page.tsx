"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { SupportForm } from "./_components/support-form";

// FAQ sections with questions
const faqSections = [
  {
    title: "BOOKINGS",
    questions: [
      {
        question: "How will I know when someone books one of my dresses?",
        answer:
          "You'll receive an instant notification via email and in the app when someone books one of your dresses. You can also check the Bookings tab in your dashboard for all current and upcoming bookings.",
      },
      {
        question: "Can customers pick up locally?",
        answer:
          "Yes, you can enable local pickup for your listings. Customers will be able to select this option during checkout if you've enabled it.",
      },
      {
        question: "How do I enable local pickup for my listings?",
        answer:
          "Go to your Account Settings, navigate to the Pickup Address section, and add your pickup location. Then ensure the 'Allow Local Pickup' option is enabled for each applicable listing.",
      },
      {
        question:
          "A customer I know wants to book directly through the platform — how do I add that to my dashboard?",
        answer:
          "You can create a manual booking by clicking the 'Manual Booking' button in the Bookings section. Enter the customer's information and select the dress, dates, and other details.",
      },
    ],
  },
  {
    title: "LISTINGS",
    questions: [
      {
        question: "How do I edit or pause a listing?",
        answer: (
          <>
            To edit your dress listing, go to your dashboard {">"} Listings{" "}
            {">"} click &ldquo;Edit&ldquo; next to the item you want to update.
            You can adjust the price, description, photos, or availability.{" "}
            <br /> <br />
            To pause a listing, simply toggle it to &ldquo;inactive&ldquo; — it
            will no longer appear in the customer search but can be reactivated
            at any time.
          </>
        ),
      },
    ],
  },
  {
    title: "SHIPPING & RETURNS",
    questions: [
      {
        question: "Who pays for shipping?",
        answer:
          "Shipping costs can be handled in two ways: either included in your rental price or charged separately to the customer at checkout. You can configure your shipping preferences in your account settings.",
      },
      {
        question: "How do I ship a dress?",
        answer:
          "After a booking is confirmed, you'll receive shipping details. You can use your own packaging or request a shipping kit from us. Print the shipping label from your dashboard and drop the package at your preferred carrier.",
      },
      {
        question: "What happens if a customer doesn't return the dress?",
        answer:
          "If a dress isn't returned by the due date, the system will automatically extend the rental and charge the customer additional fees. After 7 days, you can file a non-return dispute in the Disputes section.",
      },
    ],
  },
  {
    title: "PAYOUTS",
    questions: [
      {
        question: "When do I get paid?",
        answer:
          "Payouts are processed within 24 hours after a rental period has completed and the item has been returned in satisfactory condition. The funds will typically appear in your account within 3-5 business days.",
      },
      {
        question: "Where do I update my bank account?",
        answer:
          "You can update your bank account information in the Account Settings section under Banking Information. Ensure all details are entered correctly to avoid payout delays.",
      },
      {
        question: "Where can I track my payout?",
        answer:
          "All payouts can be tracked in the Payments section of your dashboard. You'll see the status of each payout, including pending, processing, and completed transactions.",
      },
    ],
  },
  {
    title: "DISPUTES & DAMAGES",
    questions: [
      {
        question: "What if a dress is damaged during a rental?",
        answer:
          "If a dress is returned damaged, you should document the damage with photos and submit a dispute within 48 hours of receiving the return. We'll review the case and may charge the customer's security deposit to cover repairs or replacement.",
      },
      {
        question: "How do I submit a dispute?",
        answer:
          "Go to the Disputes section and click on 'Submit New Dispute'. Fill out the form with all relevant details, including booking information, description of the issue, and upload supporting photos.",
      },
      {
        question: "How do I handle a late return?",
        answer:
          "Late returns are automatically flagged in the system. The customer will be charged late fees according to your settings. If a return is significantly delayed, you can submit a dispute for additional compensation.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [openSections] = useState<{ [key: string]: boolean }>({});
  const [openQuestions, setOpenQuestions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="space-y-[20px] md:space-y-[30px]">
        {faqSections.map((section) => (
          <div
            key={section.title}
            className="bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-[15px] p-[20px] md:p-[30px]"
          >
            <div className="flex justify-between items-center mb-[20px] md:mb-[30px]">
              <h3 className="text-lg md:text-xl font-medium text-black font-avenirNormal tracking-[0%] leading-[120%] uppercase">
                {section.title}
              </h3>
            </div>

            {!openSections[section.title] && (
              <div className="">
                {section.questions.map((item, index) => (
                  <div
                    key={index}
                    className="border border-[#E6E6E6] rounded-[15px] p-[12px] md:p-[15px] mb-[15px]"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer gap-2"
                      onClick={() => toggleQuestion(item.question)}
                    >
                      <h4 className="text-[14px] md:text-[16px] font-normal text-[#891D33] leading-[140%] md:leading-[120%] font-avenirNormal tracking-[0%]">
                        {item.question}
                      </h4>
                      <button className="shrink-0">
                        {openQuestions[item.question] ? (
                          <Minus className="h-4 w-4 md:h-5 md:w-5 text-[#891D33]" />
                        ) : (
                          <Plus className="h-4 w-4 md:h-5 md:w-5 text-[#891D33]" />
                        )}
                      </button>
                    </div>

                    {openQuestions[item.question] && (
                      <div className="mt-[15px] md:mt-[20px]">
                        <p className="text-[13px] md:text-[14px] font-normal text-black/60 font-avenirNormal leading-[150%] md:leading-[120%] tracking-[0%]">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Contact Support Section */}
        <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-[15px] p-[20px] md:p-[30px]">
          <h3 className="text-lg md:text-xl font-medium text-black font-avenirNormal tracking-[0%] leading-[120%] mb-[20px] md:mb-[30px] uppercase">
            CONTACT SUPPORT
          </h3>

          <SupportForm />
        </div>
      </div>
    </div>
  );
}
