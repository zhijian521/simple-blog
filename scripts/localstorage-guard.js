// ponytail: Node 25 ships a half-defined `localStorage` global (getter only, no getItem),
// which crashes Next's bundled @typescript/vfs during dev SSR. Stub a minimal store so
// `localStorage.getItem('DEBUG')` returns null instead of throwing. Production builds are unaffected.
if (typeof globalThis.localStorage !== 'undefined' && typeof globalThis.localStorage?.getItem !== 'function') {
    const store = {};
    Object.defineProperty(globalThis, 'localStorage', {
        value: {
            getItem: (k) => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; },
            clear: () => { for (const k of Object.keys(store)) delete store[k]; },
            key: (i) => Object.keys(store)[i] ?? null,
            get length() { return Object.keys(store).length; },
        },
        configurable: true,
        writable: true,
    });
}
