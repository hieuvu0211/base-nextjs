export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    console.error(error.message);
    if (!error.isRetryable) {
      // Log to monitoring service
      console.error('Non-retryable error:', error);
    }
  } else if (error instanceof Error) {
    console.error('An unexpected error occurred:', error);
  } else {
    console.error('Something went wrong:', error);
  }
};