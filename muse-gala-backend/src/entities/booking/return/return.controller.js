import { generateResponse } from '../../../lib/responseFormate.js';
import { cloudinaryUpload } from '../../../lib/cloudinaryUpload.js';
import {
    getReturnPageData,
    submitReturn,
    generateReturnLink,
    getReturnsRequiringAttention,
    getOverdueSummary,
    adminApproveCharge,
    lenderReportIssue
} from './return.service.js';


// ─────────────────────────────────────────────────────
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ─────────────────────────────────────────────────────

/**
 * GET /return/:token
 * Get return page data (customer, no login required)
 */
export const getReturnPageController = async (req, res) => {
    try {
        const { token } = req.params;
        const data = await getReturnPageData(token);
        generateResponse(res, 200, true, 'Return page data fetched', data);
    } catch (err) {
        const status = err.message.includes('expired') ? 410 : 404;
        generateResponse(res, status, false, err.message);
    }
};

/**
 * POST /return/:token/submit
 * Submit return (customer, no login required)
 */
export const submitReturnController = async (req, res) => {
    try {
        const { token } = req.params;
        const { returnMethod, trackingNumber, returnNotes } = req.body;

        // Handle receipt photo upload if file is provided
        let receiptPhotoUrl = null;
        const receiptFile = req.files?.receiptPhoto?.[0];
        if (receiptFile) {
            const uploadResult = await cloudinaryUpload(
                receiptFile.path,
                `return-receipt-${Date.now()}`,
                'return-receipts'
            );
            if (uploadResult && uploadResult.secure_url) {
                receiptPhotoUrl = uploadResult.secure_url;
            }
        }

        const result = await submitReturn(token, {
            returnMethod,
            trackingNumber,
            returnNotes,
            receiptPhoto: receiptPhotoUrl
        });

        generateResponse(res, 200, true, result.message, result);
    } catch (err) {
        generateResponse(res, 400, false, err.message);
    }
};


// ─────────────────────────────────────────────────────
// ADMIN ROUTES (AUTH REQUIRED)
// ─────────────────────────────────────────────────────

/**
 * POST /return/generate-link/:bookingId
 * Admin generates a return link manually
 */
export const generateReturnLinkController = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const result = await generateReturnLink(bookingId);
        generateResponse(res, 200, true, 'Return link generated', result);
    } catch (err) {
        generateResponse(res, 400, false, err.message);
    }
};

/**
 * GET /return/admin/attention
 * Returns requiring attention (admin dashboard)
 */
export const getReturnsAttentionController = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await getReturnsRequiringAttention({
            page: Number(page),
            limit: Number(limit)
        });
        generateResponse(res, 200, true, 'Returns requiring attention fetched', result);
    } catch (err) {
        generateResponse(res, 500, false, err.message);
    }
};

/**
 * GET /return/admin/overdue-summary
 * Overdue stats/counts
 */
export const getOverdueSummaryController = async (req, res) => {
    try {
        const result = await getOverdueSummary();
        generateResponse(res, 200, true, 'Overdue summary fetched', result);
    } catch (err) {
        generateResponse(res, 500, false, err.message);
    }
};

/**
 * POST /return/admin/approve-charge/:bookingId
 * Admin approves a charge (manual, not auto-charge)
 */
export const approveChargeController = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { feeType, amount, adminNotes } = req.body;
        const adminId = req.user._id;

        if (!feeType || !amount) {
            return generateResponse(res, 400, false, 'Fee type and amount are required');
        }

        const result = await adminApproveCharge(bookingId, { feeType, amount, adminNotes }, adminId);
        generateResponse(res, 200, true, result.message, result);
    } catch (err) {
        generateResponse(res, 400, false, err.message);
    }
};


// ─────────────────────────────────────────────────────
// LENDER ROUTES (AUTH REQUIRED)
// ─────────────────────────────────────────────────────

/**
 * POST /return/lender/report-issue/:bookingId
 * Lender reports an issue (damage, missing, late)
 */
export const reportIssueController = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const lenderId = req.user._id;
        const { issueType, issueNotes } = req.body;

        const result = await lenderReportIssue(bookingId, lenderId, { issueType, issueNotes });
        generateResponse(res, 200, true, 'Issue reported successfully', result);
    } catch (err) {
        generateResponse(res, 400, false, err.message);
    }
};
