import React from "react";

const NotificationPreference = () => {
  return (
    <div className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
      <h1 className="text-xl ">Notification Preferences</h1>

      <div className="mt-5 flex items-center gap-3">
        <input type="checkbox" className="h-5 w-5 accent-black" />
        <h1>Receive email alerts for new orders</h1>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <input type="checkbox" className="h-5 w-5 accent-black" />
        <h1>Send reminders for return deadlines</h1>
      </div>
    </div>
  );
};

export default NotificationPreference;
