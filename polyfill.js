// Robust polyfill loader for ReadableStream used by undici on Node < 18
(function () {
  const tryPaths = [
    'web-streams-polyfill/ponyfill',
    'web-streams-polyfill/dist/ponyfill',
    'web-streams-polyfill/lib/ponyfill'
  ];

  let ponyfill = null;
  for (const p of tryPaths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ponyfill = require(p);
      if (ponyfill) break;
    } catch (e) {
      // ignore
    }
  }

  if (ponyfill && ponyfill.ReadableStream && typeof globalThis.ReadableStream === 'undefined') {
    globalThis.ReadableStream = ponyfill.ReadableStream;
    return;
  }

  // final attempt: require package root
  try {
    const root = require('web-streams-polyfill');
    if (root && root.ReadableStream && typeof globalThis.ReadableStream === 'undefined') {
      globalThis.ReadableStream = root.ReadableStream;
      return;
    }
  } catch (e) {
    // ignore
  }

  // warn once
  // eslint-disable-next-line no-console
  console.warn('ReadableStream not available. Install `web-streams-polyfill` or upgrade Node to 18+ and ensure the polyfill is preloaded.');
})();
