class ApiError extends Error {
    constructor(
      statusCode, // HTTP status code
      message = "something went wrong", // Default error message
      errors = [], // Additional error details (if any)
    ) {
      super(message); // Call parent Error constructor with message
      this.statusCode = statusCode; // Store the status code
      this.message = message; // Store the message
      this.errors = errors; // Store any extra error details
  
    }
  }
  
  export { ApiError };
  