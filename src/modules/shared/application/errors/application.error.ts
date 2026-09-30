export type ApplicationErrorCategory =
  | 'bad-request'
  | 'conflict'
  | 'forbidden'
  | 'not-found'
  | 'unauthorized'
  | 'unprocessable'
  | 'unavailable';

export abstract class ApplicationError extends Error {
  protected constructor(
    public readonly code: string,
    message: string,
    public readonly category: ApplicationErrorCategory = 'unprocessable',
  ) {
    super(message);
    this.name = new.target.name;
  }
}
