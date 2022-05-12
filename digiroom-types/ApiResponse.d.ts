export type ApiResponse<T> = {
  message: "findOne" | "updated" | "created" | "deleted";
  data: T;
};

export type ApiError = {
  message: string;
  error: string;
};
