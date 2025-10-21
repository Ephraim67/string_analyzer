import {
  createStringService,
  getStringService,
  getAllStringService,
  filterByNaturalLanguageService,
  deleteStringService,
} from "../services/stringService.js";

/**
 * POST /strings
 * Analyze a string and compute its properties
 */
export const analyzeString = async (req, res) => {
  try {
    const { value } = req.body;

    
    if (value === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body or missing 'value' field.",
      });
    }

    
    if (typeof value !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid data type for 'value'. It must be a string.",
      });
    }

    const result = await createStringService(value);
    return res.status(201).json(result); 

  } catch (error) {
    
    if (error.code === 409) {
      return res.status(409).json({
        status: "error",
        message: "String already exists in the system.",
      });
    }

    console.error("Error analyzing string:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

/**
 * GET /strings/:string_value
 * Retrieve a specific string and its properties
 */

export const getString = async (req, res) => {
  try {
    const { string_value } = req.params;
    const result = await getStringService(string_value);

    
    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "String does not exist in the system.",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching string:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

/**
 * GET /strings
 * Retrieve all strings, optionally filtered by query parameters
 */

export const getAllString = async (req, res) => {
  try {
    const filters = req.query;

    const result = await getAllStringService(filters);
    return res.status(200).json(result);
  } catch (error) {
    
    if (error.code === 400) {
      return res.status(400).json({
        status: "error",
        message: "Invalid query parameter values or types.",
      });
    }

    console.error("Error fetching all strings:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

/**
 * GET /strings/filter-by-natural-language
 * Interpret natural language queries like "all single word palindromic strings"
 */

export const filterByNaturalLanguage = async (req, res) => {
  try {
    const { query } = req.query;

    
    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Missing 'query' parameter.",
      });
    }

    const result = await filterByNaturalLanguageService(query);
    return res.status(200).json(result);
  } catch (error) {
    
    if (error.code === 422) {
      return res.status(422).json({
        status: "error",
        message: "Query parsed but resulted in conflicting filters.",
      });
    }

    console.error("Error filtering strings by natural language:", error);
    return res.status(400).json({
      status: "error",
      message: "Unable to parse natural language query.",
    });
  }
};

/**
 * DELETE /strings/:string_value
 * Delete a string from the system
 */

export const deleteString = async (req, res) => {
  try {
    const { string_value } = req.params;
    const deleted = await deleteStringService(string_value);

    
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "String does not exist in the system.",
      });
    }

    
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting string:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
