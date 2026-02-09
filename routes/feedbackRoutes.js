import express from "express";
const router = express.Router();
import { createFeedback, getAllFeedbacks, deleteFeedback } from "../controllers/feedbackController.js";

router.post("/", createFeedback);
router.get("/", getAllFeedbacks);
router.delete("/:id", deleteFeedback);

export default router;
