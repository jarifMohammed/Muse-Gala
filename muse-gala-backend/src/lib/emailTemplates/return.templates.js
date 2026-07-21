import { baseEmailTemplate, createInfoBox, createStatusBadge } from './baseTemplate.js';

/**
 * Return Reminder Template (Reminders 1-3)
 * Handles: 2 Days Before, 1 Day Before, and Due Date Morning
 */
export const returnReminderTemplate = (
    userName,
    dressName,
    brandName,
    dressSize,
    dressColour,
    bookingId,
    dueDate,
    returnLink,
    reminderType = 'reminder-2-days',
    returnAddress = ''
) => {
    let title = 'Your Return Is Coming Up';
    let subtitle = 'Your rental period is coming to an end.';
    let extraText = "When ready, confirm your return using the secure link below. If posting back, please lodge your parcel in a yellow Express Post box or at the post office counter and keep your tracking number.";

    if (reminderType === 'reminder-1-day') {
        title = 'Friendly Return Reminder';
        subtitle = `Your return is due tomorrow (${dueDate}).`;
        extraText = "Confirm your return using the secure link below. If posting the garment, please enter your tracking number once lodged.";
    } else if (reminderType === 'due-today') {
        title = 'Return Due Today';
        subtitle = 'Your rental is due back today.';
        extraText = "If you’ve already posted it, simply add your tracking number using the link below. Otherwise, confirm your return once completed.";
    } else if (reminderType === 'initial') {
        title = 'Return Link: Confirm Your Return';
        subtitle = 'Please confirm your return method below.';
        extraText = "Please click the button below to select your return method and confirm you've dispatched the item.";
    }

    const content = `
    <p>Hi ${userName},</p>
    <p>${subtitle}</p>
    <h3>Item Details:</h3>
    ${createInfoBox({
        'Brand': brandName || 'N/A',
        'Style': dressName,
        'Size': dressSize || 'N/A',
        'Colour': dressColour || 'N/A',
        'Booking ID': bookingId || 'N/A',
        'Return Due Date': dueDate,
        ...(returnAddress ? { 'Return Address': returnAddress } : {})
    })}
    <p>${extraText}</p>
  `;

    return baseEmailTemplate({
        title,
        subtitle,
        content,
        buttonText: 'CONFIRM RETURN',
        buttonUrl: returnLink
    });
};

/**
 * Overdue Reminder Template (1-5 days)
 * Handles: 1-2 Days Late and 5 Days Late
 */
export const overdueReminderTemplate = (
    userName,
    dressName,
    brandName,
    dressSize,
    dressColour,
    bookingId,
    daysOverdue,
    returnLink,
    returnAddress = ''
) => {
    let title = 'Return Follow-Up';
    let subtitle = `We noticed your rental hasn’t been confirmed as returned yet.`;

    if (daysOverdue >= 5) {
        title = 'Return Follow-Up Required';
        subtitle = 'We’re following up regarding your outstanding rental return.';
    }

    return baseEmailTemplate({
        title,
        subtitle,
        content: `
      <p>Hi ${userName},</p>
      <p>${subtitle}</p>
      <h3>Item Details:</h3>
      ${createInfoBox({
            'Brand': brandName || 'N/A',
            'Style': dressName,
            'Size': dressSize || 'N/A',
            'Colour': dressColour || 'N/A',
            'Booking ID': bookingId || 'N/A',
            'Status': createStatusBadge(daysOverdue >= 5 ? 'Action Required' : 'Late Return', 'error'),
            ...(returnAddress ? { 'Return Address': returnAddress } : {})
        })}
      <p>If already sent back, please add your tracking number below. If you need assistance, let us know.</p>
    `,
        buttonText: 'CONFIRM RETURN NOW',
        buttonUrl: returnLink
    });
};

/**
 * Escalated Overdue Template (10 days)
 */
export const escalatedOverdueTemplate = (
    userName,
    dressName,
    brandName,
    bookingId,
    returnLink,
    returnAddress = ''
) => {
    return baseEmailTemplate({
        title: 'Important Return Update',
        subtitle: 'Your rental return is still outstanding.',
        content: `
      <p>Hi ${userName},</p>
      <p>Your rental return for <strong>${dressName}</strong> is still outstanding.</p>
      <h3>Item Details:</h3>
      ${createInfoBox({
            'Brand': brandName || 'N/A',
            'Style': dressName,
            'Booking ID': bookingId || 'N/A',
            'Status': createStatusBadge('Escalated', 'error'),
            ...(returnAddress ? { 'Return Address': returnAddress } : {})
        })}
      <p>Please confirm your return using the secure link below. As outlined in our terms, late fees may apply.</p>
    `,
        buttonText: 'RESOLVE NOW',
        buttonUrl: returnLink
    });
};

/**
 * High Risk Return Template (15 days)
 */
export const highRiskReturnTemplate = (
    userName,
    dressName,
    brandName,
    bookingId,
    returnLink,
    returnAddress = ''
) => {
    return baseEmailTemplate({
        title: 'Urgent Return Notice',

        content: `
      <p>Hi ${userName},</p>
      <p>We have not yet received confirmation of your return for <strong>${dressName}</strong>.</p>
      <h3>Item Details:</h3>
      ${createInfoBox({
            'Brand': brandName || 'N/A',
            'Style': dressName,
            'Booking ID': bookingId || 'N/A',
            'Status': createStatusBadge('High Risk', 'error'),
            ...(returnAddress ? { 'Return Address': returnAddress } : {})
        })}
      <p>Please confirm immediately using the secure link below. Replacement charges may apply if the garment is not returned.</p>
    `,
        buttonText: 'CONFIRM RETURN',
        buttonUrl: returnLink
    });
};

/**
 * Non-Returned Template (30+ days)
 */
export const nonReturnedTemplate = (
    userName,
    dressName,
    brandName,
    bookingId,
    returnLink,
    returnAddress = ''
) => {
    return baseEmailTemplate({
        title: 'Outstanding Rental Return',

        content: `
      <p>Hi ${userName},</p>
      <p>Your rental return for <strong>${dressName}</strong> remains outstanding.</p>
      <h3>Item Details:</h3>
      ${createInfoBox({
            'Brand': brandName || 'N/A',
            'Style': dressName,
            'Booking ID': bookingId || 'N/A',
            'Status': createStatusBadge('Non-Returned', 'error'),
            ...(returnAddress ? { 'Return Address': returnAddress } : {})
        })}
      <p>Please confirm immediately using the secure link below. Further action will be taken in accordance with our terms if unresolved, including escalation to our dispute process and potential replacement charges.</p>
    `,
        buttonText: 'RESOLVE IMMEDIATELY',
        buttonUrl: returnLink
    });
};

/**
 * Return Confirmed Template (Confirmation for Customer)
 * Handles both Customer Submission and Lender Receipt
 */
export const returnConfirmedTemplate = (
    userName,
    dressName,
    brandName,
    bookingId,
    status
) => {
    const isReceived = status === 'ReceivedByLender';

    return baseEmailTemplate({
        title: isReceived ? 'Return Completed' : 'Return Confirmed',
        subtitle: isReceived ? 'Your rental has been confirmed as received.' : 'Thank you — your return has been recorded.',
        content: `
      <p>Hi ${userName},</p>
      <p>${isReceived
                ? `Your rental for <strong>${dressName}</strong> has been confirmed as received.`
                : `Thank you — your return for <strong>${dressName}</strong> has been recorded.`}</p>
      <h3>Item Details:</h3>
      ${createInfoBox({
                    'Brand': brandName || 'N/A',
                    'Style': dressName,
                    'Booking ID': bookingId || 'N/A',
                    'Status': createStatusBadge(isReceived ? 'Received ✓' : 'Confirmed ✓', 'success'),
                })}
      <p>${isReceived
                ? 'Thank you for taking care with the garment.'
                : 'If tracking was provided, we’ll monitor delivery. You’ll be notified once the lender confirms receipt.'}</p>
    `
    });
};

/**
 * Lender Return Notification Template
 */
export const lenderReturnNotificationTemplate = (
    lenderName,
    dressName,
    returnMethod,
    trackingNumber,
    notes,
    receiptPhoto
) => {
    return baseEmailTemplate({
        title: 'RETURN INCOMING',

        content: `
      <p>Hi ${lenderName},</p>
      <p>A customer has confirmed they are returning <strong>${dressName}</strong>.</p>
      ${createInfoBox({
            'Method': returnMethod === 'ExpressShipping' ? 'Express Shipping' : 'Local Drop-off',
            ...(trackingNumber ? { 'Tracking Number': trackingNumber } : {}),
            ...(notes ? { 'Customer Notes': notes } : {}),
        })}
      ${receiptPhoto ? `
      <div style="margin-top: 20px;">
        <strong>Return Receipt:</strong><br>
        <img src="${receiptPhoto}" alt="Return Receipt" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
      </div>` : ''}
      <p>Please keep an eye out for the delivery. Once received, please update the status in your dashboard to "Dress Returned".</p>
    `
    });
};
