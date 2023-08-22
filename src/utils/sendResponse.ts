import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function sendResponse<T, U extends boolean>({
  res,
  status = 200,
  message = "Success",
  data,
  success,
}: {
  res: Response;
  status?: number;
  message: string;
  data?: U extends true ? T : null;
  success: U;
}): void {
  const responseBody: ApiResponse<U extends true ? T : null> = {
    success,
    message,
    data,
  };

  res.status(status).json(responseBody);
}
