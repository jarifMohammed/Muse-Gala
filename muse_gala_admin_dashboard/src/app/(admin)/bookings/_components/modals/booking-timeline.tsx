import React, { useState } from "react";
import { Clock, User, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface StatusHistory {
  _id: string;
  status: string;
  timestamp: string;
  updatedBy?: string;
  reason?: string;
}

interface Props {
  statusHistory?: StatusHistory[];
}

const BookingTimeline = ({ statusHistory = [] }: Props) => {
  const [expandedReasons, setExpandedReasons] = useState<Record<string, boolean>>({});

  if (statusHistory.length === 0) {
    return (
      <div className="mt-5 border border-dashed border-gray-300 p-10 rounded-lg text-center bg-gray-50">
        <p className="text-gray-500 font-sans tracking-wide">No timeline found</p>
      </div>
    );
  }

  const toggleReason = (id: string) => {
    setExpandedReasons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sort by timestamp descending (newest first)
  const sortedHistory = [...statusHistory].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="mt-8 relative ml-4 pb-10">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-[11px]" />

      <div className="space-y-8">
        {sortedHistory.map((item, index) => {
          const isExpanded = expandedReasons[item._id] || false;
          return (
            <div key={item._id || index} className="relative pl-10">
              {/* Dot/Icon */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 ${index === 0 ? 'border-primary' : 'border-gray-300'
                }`}>
                {index === 0 ? (
                  <Clock className="w-3 h-3 text-primary" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold tracking-wide ${index === 0 ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                    {item.status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-1">
                  {item.updatedBy && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-[11px] text-gray-500">
                        Updated by: <span className="font-medium text-gray-700">{item.updatedBy}</span>
                      </span>
                    </div>
                  )}

                  {item.reason && (
                    <button
                      onClick={() => toggleReason(item._id)}
                      className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline transition-all"
                    >
                      <MessageSquare className="w-3 h-3" />
                      View Reason
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {item.reason && isExpanded && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="leading-relaxed whitespace-pre-wrap">{item.reason}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;
