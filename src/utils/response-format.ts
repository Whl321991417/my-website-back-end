export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export class ResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      data,
      message: message || 'Success',
      status: 200,
      success: true,
    };
  }

  static created<T>(data: T, message?: string): ApiResponse<T> {
    return {
      data,
      message: message || 'Created successfully',
      status: 201,
      success: true,
    };
  }

  static noContent(message?: string): ApiResponse<null> {
    return {
      data: null,
      message: message || 'No content',
      status: 204,
      success: true,
    };
  }

  static error<T>(status: number, message: string): ApiResponse<T> {
    return {
      data: null as any,
      message,
      status,
      success: false,
    };
  }
}
