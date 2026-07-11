import express from "express";
import {
  addRecommended,
  getRecommended,
  deleteRecommended,
} from "../controllers/RecommendedController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/", upload.single("image"), addRecommended);
router.get("/", getRecommended);
router.delete("/:id", deleteRecommended);

export default router;