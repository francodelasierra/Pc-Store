export const Store = (() => {
  let state = { cart: [], lang: "es", currency: "USD" };
  const listeners = [];

  return {
    get: () => state,
    set: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach(fn => fn());
      document.dispatchEvent(new Event("stateChange"));
    },
    subscribe: (fn) => listeners.push(fn)
  };
})();
