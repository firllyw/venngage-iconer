export interface ErrorPayload {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly details?: unknown;

  constructor({ message, statusCode = 500, details }: ErrorPayload) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, AppError);
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
