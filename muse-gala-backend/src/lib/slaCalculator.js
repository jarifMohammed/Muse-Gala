/**
 * SLA Calculator Utility for Bookings
 */
import { formatInTimeZone } from 'date-fns-tz';

export const calculateSlaTimestamps = (rentalStartDate) => {
  const now = new Date();
  const eventDate = new Date(rentalStartDate);
  
  // Calculate days to event
  const timeDiff = eventDate.getTime() - now.getTime();
  const daysToEvent = timeDiff / (1000 * 3600 * 24);

  // Determine base SLA duration in hours (Tightened to 12h/6h/3h based on best practice)
  let slaDurationHours = 12;
  if (daysToEvent >= 7) {
    slaDurationHours = 12;
  } else if (daysToEvent >= 3) {
    slaDurationHours = 6;
  } else {
    slaDurationHours = 3;
  }

  // Bypass quiet hours if event is less than 3 days away
  const applyQuietHours = daysToEvent >= 3;

  let currentMs = now.getTime();
  let msToAdd = slaDurationHours * 3600 * 1000;

  if (applyQuietHours) {
    // We will advance time in 5 minute increments to accurately skip quiet hours
    const stepMs = 5 * 60 * 1000; // 5 mins
    
    while (msToAdd > 0) {
      currentMs += stepMs;
      
      const testDate = new Date(currentMs);
      
      // Get the accurate hour in Sydney, perfectly handling AEDT daylight savings
      const aestHourStr = formatInTimeZone(testDate, 'Australia/Sydney', 'H');
      const aestHour = parseInt(aestHourStr, 10);
      
      // Quiet hours are 21:00 (9 PM) to 08:00 (8 AM)
      const isQuietHour = aestHour >= 21 || aestHour < 8;
      
      if (!isQuietHour) {
        msToAdd -= stepMs;
      }
    }
  } else {
    // If no quiet hours, just add the SLA duration directly
    currentMs += msToAdd;
  }

  const slaExpiresAt = new Date(currentMs);
  
  // Calculate reminder time (50% elapsed)
  // The reminder falls exactly halfway between the start time and the calculated expiration time.
  // This naturally accounts for quiet hours pushing the expiration forward.
  const slaReminderAt = new Date(now.getTime() + (slaExpiresAt.getTime() - now.getTime()) / 2);

  return { slaExpiresAt, slaReminderAt };
};
