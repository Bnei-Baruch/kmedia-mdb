// Thrown by SSR data loaders when the requested entity doesn't exist.
// The server still renders the page (with a not-found message) but answers 404, not 500.
export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.name   = 'NotFoundError';
    this.status = 404;
  }
}

export const isNotFoundError = err => err?.status === 404 || err?.name === 'NotFoundError';
