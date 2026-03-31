// Fix for "Cannot set property fetch of #<Window> which has only a getter"
// This happens in some environments where window.fetch is read-only
// This MUST run before any other imports that might try to use or polyfill fetch
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (window.fetch && descriptor && descriptor.get && !descriptor.writable) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  console.warn('Could not make window.fetch writable:', e);
}

// Polyfill Buffer for browser compatibility (required by @solana/web3.js)
import { Buffer } from 'buffer';
window.Buffer = Buffer;
