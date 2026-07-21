// 📦 Updated Lender Application Services to Use User Model Only

import { adminEmail } from '../../core/config/config.js';
import { generateRandomPassword } from '../../lib/generatePassword.js';
import lenderCredentialsTemplate from '../../lib/lenderCredentialsTemplate.js';
import { sendEmail } from '../../lib/resendEmial.js';
import RoleType from '../../lib/types.js';
import User from '../auth/auth.model.js';
import {
  newApplicationAdminTemplate,
  applicationReceivedTemplate,
  applicationApprovedTemplate,
  applicationApprovedAdminTemplate,
  applicationRejectedTemplate
} from '../../lib/emailTemplates/application.templates.js';

export const createApplication = async (data) => {
  const normalizedEmail = data.email?.trim().toLowerCase();
  if (!normalizedEmail) throw new Error('Email is required');

  // Check if user with email exists (either active user or pending application)
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser && existingUser.status === 'pending') {
    throw new Error('You have already applied. Please wait for review.');
  }
  if (existingUser && existingUser.role === 'LENDER') {
    throw new Error('User with this email is already a lender.');
  }

  let user;
  if (existingUser) {
    // Update existing user record (not lender, maybe role=USER)
    user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        ...data,
        status: 'pending',
        applicationSubmittedAt: new Date(),
        role: 'APPLICANT' // or keep USER, just mark status
      },
      { new: true }
    );
  } else {
    // Create new user with application info
    const tempPassword = generateRandomPassword();
    user = new User({
      ...data,
      email: normalizedEmail,
      password: tempPassword,
      status: 'pending',
      applicationSubmittedAt: new Date(),
      role: 'APPLICANT' // temp role
    });
    await user.save();
  }

  // Email admin with applicant info
  const adminEmailContent = newApplicationAdminTemplate({
    fullName: user.fullName || user.firstName || 'N/A',
    email: user.email,
    phoneNumber: user.phoneNumber || 'N/A',
    businessName: user.businessName || 'N/A'
  });

  // Email applicant confirmation (no password)
  const applicantEmailContent = applicationReceivedTemplate({
    fullName: user.fullName || user.firstName || 'Applicant'
  });

  // Send both emails in parallel to reduce wait time
  await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: 'New Lender Application Received',
      html: adminEmailContent
    }),
    sendEmail({
      to: user.email,
      subject: 'Your Lender Application Has Been Received',
      html: applicantEmailContent
    })
  ]);

  // Return the user data (without password)
  user.password = undefined;
  return user;
};

export const getAllApplicationsService = async ({
  search,
  status,
  totalbookings,
  totalRatting,
  totalListings,
  totalReveneue,
  startDate,
  endDate,
  page = 1,
  limit = 10
}) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const regex = search ? new RegExp(search, 'i') : null;

  const query = {
    status: { $ne: null },
    role: { $in: ['LENDER', 'APPLICANT'] }
  };

  if (status && status !== 'all') {
    query.status = status;
    // Explicitly enforce the target role based on the status
    if (status === 'approved') {
      query.role = 'LENDER';
    } else if (status === 'pending' || status === 'rejected') {
      query.role = 'APPLICANT';
    }
  }
  if (regex) {
    query.$or = [
      { fullName: { $regex: regex } },
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } }
    ];
  }
  if (totalbookings) query.totalbookings = parseInt(totalbookings);
  if (totalRatting) query.totalRatting = parseInt(totalRatting);
  if (totalListings) query.totalListings = parseInt(totalListings);
  if (totalReveneue) query.totalReveneue = parseInt(totalReveneue);
  if (startDate || endDate) {
    query.applicationSubmittedAt = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0); // Start of day
      query.applicationSubmittedAt.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999); // End of day
      query.applicationSubmittedAt.$lte = end;
    }
  }

  const [data, total, approvedLenders, pendingApplications] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(query),
    User.countDocuments({ role: 'LENDER', status: 'approved' }),
    User.countDocuments({ role: 'APPLICANT', status: 'pending' })
  ]);

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    },
    stats: {
      totalApprovedLenders: approvedLenders,
      totalPendingApplications: pendingApplications
    }
  };
};

export const getApplicationById = async (id) => {
  const user = await User.findById(id);
  if (!user || !user.status) throw new Error('Application not found');
  return user;
};

export const updateApplication = async (id, data) => {
  const user = await User.findById(id).select(
    '-password -accessToken -refreshToken'
  );

  if (!user || !user.status) throw new Error('Application not found');

  const isAlreadyApproved =
    user.status === 'approved' && data.status === 'approved';
  const isNowRejected = data.status === 'rejected';
  if (isAlreadyApproved)
    throw new Error('This lender application has already been approved.');

  const isNowApproved =
    ['pending', 'rejected'].includes(user.status) && data.status === 'approved';

  if (isNowApproved) {
    const tempPassword = generateRandomPassword();
    user.role = 'LENDER';
    user.applicationReviewedAt = new Date();
    user.status = 'approved';
    user.password = tempPassword; // Will be hashed by pre-save hook if it hashes on save too, or need to hash manually?

    await user.save();

    const adminEmailContent = applicationApprovedAdminTemplate({
      fullName: user.fullName || user.firstName || 'N/A',
      email: user.email,
      phoneNumber: user.phoneNumber || 'N/A',
      tempPassword
    });

    const userEmailContent = applicationApprovedTemplate({
      fullName: user.fullName || user.firstName || 'Applicant',
      email: user.email,
      tempPassword
    });

    await Promise.all([
      sendEmail({
        to: user.email,
        subject: 'Welcome to Muse Gala',
        html: userEmailContent
      }),
      sendEmail({
        to: adminEmail,
        subject: 'A Lender Application Has Been Approved',
        html: adminEmailContent
      })
    ]);
  } else if (isNowRejected) {
    user.status = 'rejected';
    user.role = 'APPLICANT';
    user.applicationReviewedAt = new Date();

    if (data.rejectionNote) {
      user.rejectionNote = data.rejectionNote;
    }

    await user.save();

    const userEmailContent = applicationRejectedTemplate({
      fullName: user.fullName || 'Applicant',
      rejectionNote: data.rejectionNote || null
    });

    await sendEmail({
      to: user.email,
      subject: 'Your Lender Application Rejected',
      html: userEmailContent
    });
  } else {
    await User.findByIdAndUpdate(id, data, { new: true });
  }

  return await User.findById(id).select('-password -accessToken -refreshToken');
};

export const deleteApplication = async (id) => {
  const user = await User.findById(id);
  if (!user || !user.status) throw new Error('Application not found');

  user.status = null;
  user.applicationSubmittedAt = null;
  user.applicationReviewedAt = null;

  await user.save();
  return user;
};

export const resendLenderPassword = async (id) => {
  const user = await User.findById(id).select('-password -accessToken -refreshToken');

  if (!user || user.role !== 'LENDER' || user.status !== 'approved') {
    throw new Error('User is not an approved lender. Cannot resend password.');
  }

  const tempPassword = generateRandomPassword();
  user.password = tempPassword;
  
  await user.save();

  const userEmailContent = applicationApprovedTemplate({
    fullName: user.fullName || user.firstName || 'Lender',
    email: user.email,
    tempPassword
  });

  const adminEmailContent = applicationApprovedAdminTemplate({
    fullName: user.fullName || user.firstName || 'N/A',
    email: user.email,
    phoneNumber: user.phoneNumber || 'N/A',
    tempPassword
  });

  await Promise.all([
    sendEmail({
      to: user.email,
      subject: 'Your New Temporary Password - Muse Gala',
      html: userEmailContent
    }),
    sendEmail({
      to: adminEmail,
      subject: 'Resent: A Lender Application Password',
      html: adminEmailContent
    })
  ]);

  return user;
};
