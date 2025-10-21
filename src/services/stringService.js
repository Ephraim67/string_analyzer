import stringModel from "../models/stringModel.js";
import { analyzeString } from "../controllers/stringController.js";

/**
 * create a new stringrecord after analyzinfg it
 * if it already exist, return the existing one
 */

export const createStringService = async (req, res) => {
    const analysis = analyzeString(value);

    let existing = await stringModel.findOne({ sha256_hash: analysis.sha256_hash });

    if (existing) {
        return { record: existing, isNew: false };
    };

    const newRecord = new stringModel({
        value: value.trim(),
        ...analysis,
    });

    await newRecord.save();
    return { record: newRecord, isNew: true};
};


/**
 * fetch all string record by original string or SHA256 hash
 */

export const getStringService = async (value) => {
    const hash = analyzeString(value).sha256_hash;

    const record = await stringModel.findOne({
        $or: [{ value: value.trim() }, { sha256_hash: hash }],
    });

    if (!record) {
        throw new Error("String not found");
    }

    return record;
};

/**
 * Fetches all string records, with optional query filters.
 * e.g. /strings?is_palindrome=true&min_length=5
 */


export const getAllStringService = async (filters = {}) => {
    const query = {};

    if (filters.is_palindrome !== undefined) {
        query.is_palindrome = filters.is_palindrome === "true";
    }

    if (filters.min_lenght || filters.max_lenght) {
        query.lenght = {};
        if (filters.min_lenght) query.lenght.$gte = Number(filters.min_lenght);
        if (filters.max_lenght) query.lenght.$lte = Number(filters.max_lenght);
    }

    if (filters.word_count) {
        query.word_count = Number(filters.word_count);
    }

    return await stringModel.find(query)
};


/**
 * Filter strings based on a natural language query.
 * Example queries:
 *  - "all palindromic strings"
 *  - "strings longer than 5 characters"
 *  - "single-word palindromic strings"
 */
export const filterByNaturalLanguageService = async (query) => {
  try {
    if (!query || typeof query !== "string") {
      throw new Error("Query must be a string.");
    }

    const q = query.toLowerCase();
    const filters = {};

    // Detect palindrome
    if (q.includes("palindrome") || q.includes("palindromic")) {
      filters.is_palindrome = true;
    }

    // Detect "single word" or "multi word"
    if (q.includes("single word")) {
      filters.word_count = 1;
    } else if (q.includes("multi word") || q.includes("multiple words")) {
      filters.word_count = { $gt: 1 };
    }

    // Detect length filters
    const lengthMatch = q.match(/(\d+)\s*(?:characters|chars)/);
    if (lengthMatch) {
      const num = Number(lengthMatch[1]);
      if (q.includes("longer than")) filters.length = { $gt: num };
      else if (q.includes("shorter than")) filters.length = { $lt: num };
      else if (q.includes("exactly")) filters.length = num;
    }

    // Basic safety: if no filters were detected
    if (Object.keys(filters).length === 0) {
      throw new Error("Could not interpret the query.");
    }

    // Query MongoDB
    const results = await stringModel.find(filters);
    return results;
  } catch (error) {
    console.error("Error parsing natural language query:", error);
    throw error;
  }
};



/**
 * Delete a string record by it's original value or hash
 */

export const deleteStringService = async (value) => {
    const hash = analyzeString(value).sha256_hash;
    const deleteString = await stringModel.findOneAndDelete({
        $or: [{ value: value.trim() }, { sha256_hash: hash }],
    });

    if (!deleted) {
        throw new Error("String not found or already deleted");
    }

    return deleted

};