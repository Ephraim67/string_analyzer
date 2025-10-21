import express from "express";
import {
    analyzeString,
    getString,
    getAllString,
    filterByNaturalLanguage,
    deleteString,
} from "../controllers/stringController.js";

const router = express.Router();

router.post("/strings", analyzeString);
router.get("/strings/:string_value", getString);
router.get("/strings", getAllString);
router.get("/strings/filter-by-natural-language", filterByNaturalLanguage);
router.delete("/strings/:string_value", deleteString);

export default router;