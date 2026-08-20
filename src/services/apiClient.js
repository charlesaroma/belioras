export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function mockDelay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockApi(resolver, ms = 250) {
  await mockDelay(ms);
  return resolver();
}