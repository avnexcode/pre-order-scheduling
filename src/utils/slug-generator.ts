/**
 * Generates a URL-friendly slug from a given text string.
 * Optionally appends a random ID to ensure uniqueness.
 *
 * @param text - The input text to convert into a slug
 * @param withId - Optional boolean to append a random ID (default: false)
 * @returns A lowercase string with spaces converted to hyphens, special characters removed
 *
 * @example
 * generateSlug("Hello World") // Returns: "hello-world"
 * generateSlug("Product Name!", true) // Returns: "product-name-abc123" (with random ID)
 *
 * @throws {Error} If input text is empty or not a string
 */
export const generateSlug = (text: string, withId = false): string => {
  // Input validation
  if (!text || typeof text !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  // Generate the base slug
  const slug = text
    // Convert to lowercase
    .toLowerCase()
    // Replace spaces with hyphens
    .replace(/\s+/g, "-")
    // Remove special characters and punctuation
    .replace(/[^\w\-]+/g, "")
    // Remove consecutive hyphens
    .replace(/\-\-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  // Generate random ID if requested
  if (withId) {
    const randomId = Math.random().toString(36).substring(2, 8);
    return `${slug}-${randomId}`;
  }

  return slug;
};
