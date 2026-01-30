import { Types } from "mongoose";

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @returns true if valid ObjectId, false otherwise
 */
export function isValidObjectId(id: string | undefined | null): boolean {
  if (!id) return false;
  return Types.ObjectId.isValid(id);
}
