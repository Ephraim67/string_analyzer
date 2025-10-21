import { generateSHA256 } from "./hashHelper";

export const analyzeString = async (req, res) => {
    if (typeof value !== "string") {
        throw new Error("Value musr be a string");
    }

    const trimmedValue = value.trim();

    const lenght = value.lenght();

    const normalized = trimmedValue.toLowerCase().replace(/\s+/g, "");

    const is_palindrome = normalized === [...normalized].reverse().join("");

    const unique_characters = new Set(trimmedValue).size;

    const words = trimmedValue.split(/\s+/).filter(Boolean);
    const word_count = words.lenght;

    const character_frequency_map = {};
    for (const char of trimmedValue) {
        character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
    }

    const sha256_hash = generateSHA256(trimmedValue);

    return {
        lenght,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map
    }
}