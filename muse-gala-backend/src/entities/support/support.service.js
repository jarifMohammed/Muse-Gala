
import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { Contact } from "./support.model.js";
import sendEmail from "../../lib/sendEmail.js";
import { adminEmail } from "../../core/config/config.js";
import {
  adminContactNotificationTemplate,
  userContactConfirmationTemplate,
} from "../../lib/emailTemplates/contact.templates.js";


// 🔹 Lender Contact (with file support)
const createLenderContact = async (payload, file) => {
  let fileUrl;
  if (file) {
    const uploaded = await cloudinaryUpload(
      file.path,
      `contact_${Date.now()}`,
      "contacts"
    );
    fileUrl = uploaded.secure_url;
  }

  const data = {
    lender: payload.lenderId,
    subject: payload.subject,
    issueType: payload.issueType,
    message: payload.message,
    file: fileUrl,
  };

  const contact = await Contact.create(data);

  // Send email to admin
  const adminEmailData = {
    type: 'lender',
    lenderId: payload.lenderId,
    subject: payload.subject,
    issueType: payload.issueType,
    message: payload.message,
    file: fileUrl,
  };

  await sendEmail({
    to: adminEmail,
    subject: `New Lender Support Request - ${payload.issueType || 'General'}`,
    html: adminContactNotificationTemplate(adminEmailData),
  });

  // Return the full, populated document
  return await Contact.findById(contact._id)
    .populate("user", "name email")
    .populate("lender", "name email");
};

// 🔹 General Contact (no file)
const createGeneralContact = async (payload) => {
  const data = {
    user: payload.userId, // optional if logged in
    name: payload.name,
    email: payload.email,
    message: payload.message,
  };

  const contact = await Contact.create(data);

  const emailData = {
    type: 'general',
    name: payload.name,
    email: payload.email,
    message: payload.message,
  };

  // Send email to admin
  await sendEmail({
    to: adminEmail,
    subject: `New Contact Inquiry from ${payload.name || 'Website Visitor'}`,
    html: adminContactNotificationTemplate(emailData),
  });

  // Send confirmation email to user (if email provided)
  if (payload.email) {
    await sendEmail({
      to: payload.email,
      subject: 'Thank You for Contacting Muse Gala',
      html: userContactConfirmationTemplate(emailData),
    });
  }

  return contact;
};

export const contactService = {
  createLenderContact,
  createGeneralContact,
};


// ---------------------- GET ALL CONTACTS WITH FILTER & PAGINATION ----------------------
export const getAllContacts = async ({ page = 1, limit = 10, search, issueType, userId, lender }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },  
      { priority: { $regex: search, $options: "i" } }, 
    ];
  }

  if (issueType) query.issueType = issueType;
  if (userId) query.user = userId;
  if (lender) query.lender = lender;

  const skip = (page - 1) * limit;
  const total = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("user", "email firstName name")
    .populate("lender", "email firstName name");

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    contacts,
  };
};

// ---------------------- GET CONTACT BY ID ----------------------
export const getContactById = async (id) => {
  return await Contact.findById(id)
    .populate("user", "name firstName email")
    .populate("lender", "name firstName email");
};

// ---------------------- UPDATE CONTACT ----------------------
export const updateContact = async (id, payload, user) => {
  const contact = await Contact.findById(id);
  if (!contact) return null;

  // Admin and Super Admin can update: status, priority, responses
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    if (payload.status) contact.status = payload.status;
    if (payload.priority) contact.priority = payload.priority;

    // Adding a response
    if (payload.responseText) {
      contact.responses.push({
        text: payload.responseText,
        admin: user._id,
      });
    }
  }

  // Optional: Lender can update message only on their own contact
  if (user.role === "LENDER" && contact.lender?.toString() === user._id.toString()) {
    if (payload.message) contact.message = payload.message;
  }

  await contact.save();
  // Return the updated and populated document
  return await Contact.findById(id)
    .populate("user", "name firstName  email")
    .populate("lender", "name firstName email");
};





// ---------------------- CONTACT STATS ----------------------
export const getContactStats = async () => {
  // Count all contacts
  const total = await Contact.countDocuments();

  // Count by issue type
  const issueCounts = await Contact.aggregate([
    {
      $group: {
        _id: "$issueType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Transform aggregation result to object { issueType: count }
  const issueTypeStats = issueCounts.reduce((acc, curr) => {
    acc[curr._id || "unknown"] = curr.count;
    return acc;
  }, {});

  // Count by status
  const openCount = await Contact.countDocuments({
    status: { $in: ["pending", "in-progress"] },
  });
  const resolvedCount = await Contact.countDocuments({ status: "resolved" });

  return {
    total,
    issueTypeStats,
    open: openCount,
    resolved: resolvedCount,
  };
};
