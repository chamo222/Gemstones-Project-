import express from "express";
import {
  getFinanceOverview,
  getFinanceTranscripts,
} from "../controllers/financeController.js";

const router = express.Router();

router.get("/overview", getFinanceOverview);
router.get("/transcripts", getFinanceTranscripts);

export default router;