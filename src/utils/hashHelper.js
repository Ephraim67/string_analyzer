import crypto from "crypto"

/**
 * Generates a SHA-256 hash for the given string.
 * @param {string} value - The input string to hash.
 * @returns {string} - The SHA-256 hash in hexadecimal format.
 */

export const generateSHA256 = (value) => {
    return crypto.createHash("sha256").update(value).digest("Hex");
};
