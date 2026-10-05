export type QueryParams = Record<string, string | number>;

export type RequestOptions = {
  /** Aborts the request when signalled. */
  signal?: AbortSignal;
  /** Overrides the client's default timeout, in milliseconds. */
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Transport-agnostic HTTP client that API modules depend on.
 * Concrete transports (fetch, axios, mocks, …) are plugged in via adapters.
 */
export interface HttpClient {
  /**
   * Performs a GET request and resolves with the parsed JSON body.
   *
   * @throws {HttpError} If the server responds with a non-2xx status.
   * @throws {HttpTimeoutError} If the request does not complete within the timeout.
   */
  get<T>(url: string, params?: QueryParams, options?: RequestOptions): Promise<T>;
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

export class HttpTimeoutError extends Error {
  timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs} ms`);
    this.name = "HttpTimeoutError";
    this.timeoutMs = timeoutMs;
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
  private readonly timeoutMs: number;

  constructor(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    this.timeoutMs = timeoutMs;
  }

  async get<T>(url: string, params: QueryParams = {}, options: RequestOptions = {}): Promise<T> {
    const { signal, timeoutMs = this.timeoutMs } = options;
    const controller = new AbortController();
    let timedOut = false;

    // AbortSignal.any/timeout aren't available on every RN runtime, so link the signals by hand.
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const abortFromCaller = () => controller.abort();

    if (signal?.aborted) {
      controller.abort();
    } else {
      signal?.addEventListener("abort", abortFromCaller);
    }

    try {
      const response = await fetch(buildUrl(url, params), { signal: controller.signal });

      if (!response.ok) {
        const body = await response.text();
        throw new HttpError(response.status, response.statusText, body);
      }

      // Awaited inside the try so the timeout also covers a stalled body.
      return (await response.json()) as T;
    } catch (error) {
      if (timedOut) {
        throw new HttpTimeoutError(timeoutMs);
      }
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abortFromCaller);
    }
  }
}
