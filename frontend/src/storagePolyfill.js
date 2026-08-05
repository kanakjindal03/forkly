// The customer app (CustomerApp.jsx) was originally built for the Claude.ai
// "artifact" runtime, which injects a `window.storage` key-value API for
// persisting data (see the artifact's own comments). That API doesn't exist
// in a normal browser, so this file provides a drop-in, localStorage-backed
// equivalent with the same shape, installed once before the app renders.
//
// Behavior matches the original API: `get` throws for a missing key (the app
// already wraps its reads in try/catch and treats a throw as "not found").

function installStoragePolyfill() {
  if (typeof window === "undefined" || window.storage) return;

  window.storage = {
    async get(key) {
      const raw = window.localStorage.getItem(key);
      if (raw === null) throw new Error(`No value found for key "${key}"`);
      return { key, value: raw, shared: false };
    },
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      const existed = window.localStorage.getItem(key) !== null;
      window.localStorage.removeItem(key);
      return { key, deleted: existed, shared: false };
    },
    async list(prefix) {
      const keys = Object.keys(window.localStorage).filter((k) => !prefix || k.startsWith(prefix));
      return { keys, prefix, shared: false };
    },
  };
}

installStoragePolyfill();
