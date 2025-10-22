import StringModel from "../models/stringModel.js";
import { analyzeString } from "../utils/computeProperties.js";

/**
 * Create and analyze a string, or return existing record if duplicate.
 */
export const createStringService = async (value) => {
  const analysis = analyzeString(value);

  // Check for duplicates
  const existing = await StringModel.findOne({ "properties.sha256_hash": analysis.sha256_hash });
  if (existing) {
    return { record: existing, isNew: false };
  }

  // Create new record
  const newRecord = new StringModel({
    value: value.trim(),
    properties: analysis,
    created_at: new Date().toISOString(),
  });

  await newRecord.save();
  return { record: newRecord, isNew: true };
};

/**
 * Get a specific string by value or hash
 */
export const getStringService = async (value) => {
  const hash = analyzeString(value).sha256_hash;
  const record = await StringModel.findOne({
    $or: [{ value: value.trim() }, { "properties.sha256_hash": hash }],
  });
  return record || null;
};

/**
 * Retrieve all strings with optional filters
 */
export const getAllStringService = async (filters = {}) => {
  const query = {};

  if (filters.is_palindrome !== undefined) {
    query["properties.is_palindrome"] = filters.is_palindrome === "true";
  }

  if (filters.min_length || filters.max_length) {
    query["properties.length"] = {};
    if (filters.min_length) query["properties.length"].$gte = Number(filters.min_length);
    if (filters.max_length) query["properties.length"].$lte = Number(filters.max_length);
  }

  if (filters.word_count) {
    query["properties.word_count"] = Number(filters.word_count);
  }

  return await StringModel.find(query).sort({ created_at: -1 });
};

/**
 * Filter strings by natural language
 */
export const filterByNaturalLanguageService = async (query) => {
  if (!query || typeof query !== "string") {
    const err = new Error("Query must be a string");
    err.code = 400;
    throw err;
  }

  const q = query.toLowerCase();
  const filters = {};

  if (q.includes("palindrome") || q.includes("palindromic")) filters.is_palindrome = true;
  if (q.includes("single word") || q.includes("single-word")) filters.word_count = 1;

  const lengthMatch = q.match(/(?:longer than|greater than|more than)\s+(\d+)/);
  if (lengthMatch) filters.min_length = Number(lengthMatch[1]);

  const containsMatch = q.match(/contain(?:ing)?(?: the letter)?\s+([a-z0-9])/);
  if (containsMatch) filters.contains_character = containsMatch[1];

  if (Object.keys(filters).length === 0) {
    const err = new Error("Could not interpret query");
    err.code = 400;
    throw err;
  }

  const results = await getAllStringService(filters);
  return results;
};

/**
 * Delete a string record
 */
export const deleteStringService = async (value) => {
  const hash = analyzeString(value).sha256_hash;
  const deleted = await StringModel.findOneAndDelete({
    $or: [{ value: value.trim() }, { "properties.sha256_hash": hash }],
  });
  return deleted || null;
};
