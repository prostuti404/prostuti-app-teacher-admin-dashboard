/**
 * Extract user-friendly error message from API error responses.
 * Compatible with RTK Query error structure (TLoginError type).
 *
 * @param error - The error object from a catch block or RTK Query error
 * @param fallback - Default message if error structure doesn't match expected format
 * @returns A user-friendly error message string
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An error occurred. Please try again."
): string {
  if (error && typeof error === "object") {
    // Handle RTK Query error structure: { data: { message: string } }
    if ("data" in error && error.data && typeof error.data === "object") {
      const data = error.data as Record<string, unknown>;
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      // Check for errorSources array (from TErrorData type)
      if (
        "errorSources" in data &&
        Array.isArray(data.errorSources) &&
        data.errorSources.length > 0
      ) {
        const firstError = data.errorSources[0] as { message?: string };
        if (firstError.message) {
          return firstError.message;
        }
      }
    }
    // Handle standard Error objects
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return fallback;
}
