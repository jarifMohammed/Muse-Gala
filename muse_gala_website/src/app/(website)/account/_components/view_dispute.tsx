
export default function DisputeDetails() {
 
  return (
    <div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <h2 className="text-[30px] tracking-[0.3rem] leading-[40px] font-medium text-blacek">
            Dispute Details
          </h2>
          <div className="my-[25px] border-t border-gray-300"></div>
        </div>

        <div className="border border-gray-300 rounded p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID : XXXXXX</p>
              <p className="text-sm text-gray-600 mt-4">
                Issue Type : Item hasn&apos;t arrived
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Date Submitted : 20/04/2025
              </p>
              <div className="flex items-center mt-4">
                <p className="text-sm text-gray-600 mr-2">Status :</p>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="lg:text-[30px] font-medium text-gray-700 mb-[25px]">
            Timeline & Communication
          </h2>
          <div className="mt-1 border-t border-gray-300 "></div>
        </div>

        <div className="relative lg:ml-16 mt-[]">
          <TimelineItem
            title="SUBMISSION"
            date="20/04/2025 · 9:45 AM"
            message="Issue reported: 'Item hasn't arrived'"
          />

          <TimelineItem
            title="RESPONSE"
            date="20/04/2025 · 11:00 AM"
            message="Your issue is under review. Our team is checking the delivery status with our logistics partner."
          />

          <TimelineItem
            title="UPDATE"
            date="21/04/2025 · 2:15 PM"
            message="Please provide additional photos of the delivery address to help us locate your package."
          />

          <TimelineItem
            title="RESOLUTION"
            date="22/04/2025 · 10:20 AM"
            message="Issue resolved, refund processed. The refund will appear in your account within 5-7 business days."
          />
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  title: string;
  date: string;
  message: string;
}

function TimelineItem({ title, date, message }: TimelineItemProps) {
  return (
    <div>
      <div className="flex items-center justify-center gap-8 sm:mb-8 mt-4">
        <div className="mr-3 mt-1">
          <div className="lg:w-10 lg:h-10 w-5 h-5 rounded-full bg-black"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-[30px] font-normal uppercase text-[#000000] leading-[36px] tracking-[10%]">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 mb-1">{date}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
