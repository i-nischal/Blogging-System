class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  // Success responses
  static success(message, data = null, statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static created(message, data = null) {
    return new ApiResponse(true, message, data, 201);
  }

  // Error responses
  static error(message, statusCode = 400, data = null) {
    return new ApiResponse(false, message, data, statusCode);
  }

  static notFound(message = "Resource not found") {
    return new ApiResponse(false, message, null, 404);
  }

  static unauthorized(message = "Not authorized") {
    return new ApiResponse(false, message, null, 401);
  }

  static forbidden(message = "Access forbidden") {
    return new ApiResponse(false, message, null, 403);
  }

  static serverError(message = "Internal server error") {
    return new ApiResponse(false, message, null, 500);
  }
}

export default ApiResponse;
