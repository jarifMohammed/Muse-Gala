import React from "react";

const DeactivatePage = () => {
  return (
    <div className="bg-[#FEFAF6] min-h-screen p-6 flex flex-col items-center">
      <div className="w-full  rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-normal uppercase tracking-[0.5rem] mb-6">
          Deactivate Your Account
        </h1>
        
        <div className="bg-[#891D33] border border-red-100 rounded-md p-4 mb-8 text-white text-base">
          <p>
            Deactivating your account will pause all listings and prevent new bookings. This action can be undone within 24 hours by contacting support.
          </p>
        </div>
        
        <div className="mb-8 rounded-[15px] p-6 shadow-[0px_4px_10px_0px_#0000001A] bg-[#FFFFFF]">
          <h2 className="text-base font-medium mb-5">Account Status</h2>
          <div className="text-base space-y-3">
            <p >Active Listings: 5</p>
            <p>Pending Bookings: 2</p>
            <p className="text-red-800">Upcoming Payout: $960 scheduled for May 28, 2025 (must be resolved before deactivation)</p>
          </div>
        </div>
        
        <div className="mb-8 p-6 shadow-[0px_4px_10px_0px_#0000001A] rounded-[15px] bg-[#FFFFFF]">
          <h2 className="text-2xl font-medium mb-4">
            Reason for Deactivation <span className="text-[#891D33]">*</span>
          </h2>
          <div className="mb-3">
            <label className="text-base text-[#891D33] mb-3 block">Why are you deactivating?</label>
            <div className="relative">
              <select className="w-full p-2 pr-8 border border-gray-300 rounded text-sm appearance-none focus:outline-none focus:ring-1">
                <option>Select Reason</option>
                <option>Taking a break</option>
                <option>Technical issues</option>
                <option>Found another platform</option>
                <option>Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-base text-[#891D33] mb-3 block">Additional Feedback (Optional)</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              rows={4}
              placeholder="e.g.,"
            />
          </div>
        </div>
        
        <div className="mb-8 rounded-[15px] p-6 shadow-[0px_4px_10px_0px_#0000001A] bg-[#FFFFFF]">
          <h2 className="text-2xl font-medium mb-6">Confirm Deactivation</h2>
          
          <div className="mb-3">
            <label className="text-base text-[#891D33] mb-3 block">
              Enter Email / Phone Number <span className="text-red-800">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              placeholder="e.g., ##"
            />
          </div>
          
          <div className="mb-3">
            <label className="text-base text-[#891D33] mb-3 block">
              Enter Password <span className="text-red-800">*</span>
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              placeholder="e.g., ##"
            />
          </div>
          
          <button className="w-[20%] py-2 mt-3 bg-[#891D33] text-white rounded text-sm font-medium">
            Send Verification Code
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            Receive a code via email/SMS for added security.
          </p>
        </div>
        
        <div className="mb-8 rounded-[15px] p-6 shadow-[0px_4px_10px_0px_#0000001A] bg-[#FFFFFF]">
          <h2 className="text-2xl font-medium mb-6">Verification</h2>
          
          <div className="mb-3">
            <label className="text-base text-gray-600 mb-3 block">
              Enter Verification Code <span className="text-red-800">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              placeholder="e.g., ##"
            />
          </div>
          
          <button className="py-2 px-4 w-[20%] bg-[#891D33] text-white rounded text-base mt-3 font-medium">
            Verify Verification Code
          </button>
        </div>
        
        <div className="mb-8 rounded-[15px] p-6 shadow-[0px_4px_10px_0px_#0000001A] bg-[#FFFFFF]">
          <h2 className="text-2xl font-medium mb-6">Additional Confirmation</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="exportData"
                className="mt-1 h-4 w-4 text-red-800 border-gray-300 rounded focus:ring-red-800"
              />
              <label htmlFor="exportData" className="ml-2 text-base text-gray-700">
                Export my account data (listings, bookings, payouts) before deactivation
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="permanentDeactivation"
                className="mt-1 h-4 w-4 text-red-800 border-gray-300 rounded focus:ring-red-800"
                defaultChecked
              />
              <label htmlFor="permanentDeactivation" className="ml-2 text-sm text-gray-700">
                I understand that deactivation is permanent and will pause all listings and bookings.
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A] p-6">
            <h3 className="font-semibold text-2xl mb-6">Actions</h3>

            <div className="flex justify-between items-center">
              <button
             
                className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md"
               
              >
                Confirm Deactivation
              </button>
              <button
             
                className="px-4 py-2 border border-[#8c1c3a] text-[#8c1c3a] rounded-md"
               
              >
                Cancel 
              </button>

              
            </div>
          </div>
      </div>
    </div>
  );
};

export default DeactivatePage;