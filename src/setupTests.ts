import '@testing-library/jest-dom/vitest';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { vi } from 'vitest';

Object.assign(globalThis, { TextDecoder, TextEncoder });

Object.assign(globalThis, {
  ReadableStream,
  WritableStream,
  TransformStream,
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
});