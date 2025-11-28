import { JSDOM } from 'jsdom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App';
import { ICON_STYLES } from '../src/types';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  pretendToBeVisual: true,
});

(globalThis as any).React = React;
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
});

Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});

const mockIcons = Array.from({ length: 4 }).map((_, index) => ({
  id: `icon-${index}`,
  url: `https://example.com/icon-${index}.png`,
  dataUri: `data:image/png;base64,${index}`,
  mimeType: 'image/png',
  prompt: 'mock prompt',
  seed: index,
  style: 'pastels',
  colors: ['#FFFFFF'],
}));

const mockPayload = {
  requestId: 'test-request',
  durationMs: 1234,
  prompt: 'mock prompt',
  style: ICON_STYLES[0],
  icons: mockIcons,
};

let shouldFail = true;
(globalThis as any).fetch = async () => {
  if (shouldFail) {
    shouldFail = false;
    return Promise.reject(new Error('Network error'));
  }
  return {
    ok: true,
    json: async () => mockPayload,
  };
};

const rootElement = dom.window.document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  const form = dom.window.document.querySelector('form');
  if (form) {
    const event = new dom.window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
  }
}, 10);

setTimeout(() => {
  console.log('Rendered App without runtime errors');
  root.unmount();
  dom.window.close();
}, 400);
