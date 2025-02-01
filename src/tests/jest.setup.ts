import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: jest.fn() },
    }) as unknown as Promise<Response>,
);

const mockImportMeta = {
  env: {
    VITE_WEATHERBIT_API_URL: "mocked-url",
    VITE_WEATHERBIT_API_KEY: "mocked-api-key",
    VITE_SENTRY_URL: "mocked-sentry-url",
  },
};

Object.defineProperty(global, "import", {
  get() {
    return { meta: mockImportMeta };
  },
});
