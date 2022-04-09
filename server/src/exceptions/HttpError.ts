export class HttpError extends Error {
  public status: number;
  public message: string;
  public isHttpError: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.isHttpError = true;
    this.status = status;
    this.message = message;
  }
}
