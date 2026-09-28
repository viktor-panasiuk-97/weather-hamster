export type QueryParams = Record<string, string | number>;

/**
 * Transport-agnostic HTTP client that API modules depend on.
 * Concrete transports (fetch, axios, mocks, …) are plugged in via adapters.
 */
export interface HttpClient {
  /**
   * Performs a GET request and resolves with the parsed JSON body.
   *
   * @throws {HttpError} If the server responds with a non-2xx status.
   */
  get<T>(url: string, params?: QueryParams): Promise<T>;
}

export class HttpError extends Error {
  status: number;
  statusText: string;
  body: string;

  constructor(
    status: number,
    statusText: string,
    body: string,
    message: string = `HTTP error ${status} ${statusText}`,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

function buildUrl(url: string, params: QueryParams): string {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();

  return query ? `${url}?${query}` : url;
}

/**
 * Adapts the global `fetch` API to the `HttpClient` interface.
 */
export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, params: QueryParams = {}): Promise<T> {
    const response = await fetch(buildUrl(url, params));

    if (!response.ok) {
      const body = await response.text();
      throw new HttpError(response.status, response.statusText, body);
    }

    return response.json() as Promise<T>;
  }
}
