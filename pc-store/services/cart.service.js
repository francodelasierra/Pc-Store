import { Store } from "../core/store.js";

export const CartService = {
  add(product) {
    const { cart } = Store.get();
    Store.set({ cart: [...cart, product] });
  },

  remove(id) {
    const { cart } = Store.get();

    const index = cart.findIndex(p => p.id === id);

    if (index === -1) return;

    const newCart = [...cart];
    newCart.splice(index, 1);
    Store.set({ cart: newCart });
  }
};
