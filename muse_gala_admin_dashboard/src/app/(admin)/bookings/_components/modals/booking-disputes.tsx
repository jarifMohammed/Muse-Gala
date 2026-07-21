import React, { useState } from "react";
import { Booking } from "../bookings-modal";
import { ChevronDown, ChevronUp, AlertCircle, Clock, FileText, Image as ImageIcon } from "lucide-react";

const BookingDisputes = ({ bookingDetails }: { bookingDetails?: Booking }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!bookingDetails?.disputes || bookingDetails.disputes.length === 0) {
    return (
      <div className="mt-5 border border-dashed border-gray-300 p-10 rounded-lg text-center bg-gray-50">
        <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-500 font-sans tracking-wide">No disputes found for this booking.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4 font-sans">
      <h1 className="text-xl font-medium tracking-wide mb-4">Reported Disputes ({bookingDetails.disputes.length})</h1>

      {bookingDetails.disputes.map((dispute, index) => {
        const isExpanded = expandedId === (dispute._id || String(index));
        const id = dispute._id || String(index);

        return (
          <div key={id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header / Summary */}
            <div
              onClick={() => toggleExpand(id)}
              className="flex items-center justify-between p-5 bg-white cursor-pointer select-none"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${dispute.isEscalated ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{dispute.issueType}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Reported on {new Date(dispute.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${dispute.status === 'Escalated' ? 'bg-red-100 text-red-700' :
                  dispute.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                  {dispute.status}
                </span>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
              <div className="p-6 bg-slate-50/50 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                  {/* General Info */}
                  <div className="space-y-4">
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
                      <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">{dispute.description || "No description provided."}</p>
                    </section>

                    {dispute.isEscalated && (
                      <section className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" /> Escalation Details
                        </h4>
                        <div className="space-y-3">
                          <p className="flex justify-between">
                            <span className="text-slate-500">Priority:</span>
                            <span className="font-semibold text-red-600 uppercase text-xs">{dispute.escalationPriority}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Reason:</span>
                            <span className="text-slate-700 font-medium">{dispute.escalationReason}</span>
                          </p>
                          <p className="text-slate-600 italic text-xs leading-relaxed mt-2 border-l-2 border-red-200 pl-3">
                            &ldquo;{dispute.escalationDescription}&rdquo;
                          </p>
                        </div>
                      </section>
                    )}

                    {(dispute.evidence.length > 0 || (dispute.escalationEvidence && dispute.escalationEvidence.length > 0)) && (
                      <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Evidence</h4>
                        <div className="flex flex-wrap gap-2">
                          {[...(dispute.evidence || []), ...(dispute.escalationEvidence || [])].map((file, i) => (
                            <a
                              key={i}
                              href={typeof file === 'string' ? file : file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors group"
                            >
                              <ImageIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                              <span className="text-xs truncate max-w-[150px]">{typeof file === 'string' ? "evidence.jpg" : file.filename}</span>
                            </a>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Dispute Timeline
                    </h4>
                    <div className="relative pl-6 border-l border-slate-200 space-y-6">
                      {dispute.timeline.map((event, i) => (
                        <div key={i} className="relative">
                          {/* Dot */}
                          <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white" />

                          <div className="space-y-1">
                            <p className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString()}</p>
                            <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                              <p className="text-slate-800 font-medium text-xs mb-1">
                                <span className="text-blue-600">{event.role}</span>: {event.message}
                              </p>
                              {event.attachments.length > 0 && (
                                <div className="mt-2 flex gap-1.5">
                                  {event.attachments.map((at, j) => (
                                    <a key={j} href={at.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                      <FileText className="h-3 w-3" /> {at.filename}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingDisputes;
