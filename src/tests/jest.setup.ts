import { TextEncoder, TextDecoder } from 'util';

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
    VITE_FIREBASE_API_KEY: 'mocked-firebase-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'mocked-firebase-auth-domain',
    VITE_FIREBASE_PROJECT_ID: 'mocked-firestore-project-id',
    VITE_FIREBASE_STORAGE_BUCKET: 'mocked-storage-bucket',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 'mocked-sender-id',
    VITE_FIREBASE_APP_ID: 'mocked-app-id',
  },
};

Object.defineProperty(global, 'import', {
  get() {
    return { meta: mockImportMeta };
  },
});
