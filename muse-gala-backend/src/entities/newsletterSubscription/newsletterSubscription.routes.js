import express from "express";
import { 
    createNewsletterSubscription, 
    getAllNewsletterSubscription, 
    unsubscribeNewsletter,
    sendPromoOffer 
} from "./newsletterSubscription.controller.js";
import { superAdminOrAdminMiddleware, verifyToken } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", createNewsletterSubscription);
router.post("/unsubscribe", unsubscribeNewsletter);
router.post("/promo-offer", sendPromoOffer);
router.get("/get-all-newsletter-subscriptions", verifyToken, superAdminOrAdminMiddleware, getAllNewsletterSubscription);

export default router;