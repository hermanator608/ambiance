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

// JSDOM does not fully implement TextTrackList. Some media libs (e.g. youtube-video-element)
// assume `textTracks.addEventListener` exists.
Object.defineProperty(HTMLMediaElement.prototype, 'textTracks', {
  configurable: true,
  get: () => ({
    length: 0,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});
