import { PRODUCTS } from "./data/products.js";
import { I18N } from "./data/i18n.js";
import { CURRENCY } from "./data/currency.js";
import { Store } from "./core/store.js";
import { ProductCard } from "./ui/ProductCard.js";
import { CartService } from "./services/cart.service.js";

const productsEl = document.getElementById("products");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const priceValue = document.getElementById("price-value");
const searchInput = document.getElementById("search-input");

const cartEl = document.getElementById("cart");

/* ---------------- FILTRO DE PRODUCTOS ---------------- */

function filteredProducts() {
  const text = searchInput.value.toLowerCase();

  return PRODUCTS.filter(p => {
    const byCat =
      categoryFilter.value === "all" ||
      p.category === categoryFilter.value;

    const byPrice = p.priceUSD <= Number(priceFilter.value);

    const byText =
      p.name.es.toLowerCase().includes(text) ||
      p.name.en.toLowerCase().includes(text);

    return byCat && byPrice && byText;
  });
}

/* ---------------- RENDER PRINCIPAL ---------------- */

function render() {
  const { cart, lang, currency: cur } = Store.get();

  /* -------- PRODUCTOS -------- */

  const list = filteredProducts();

  if (list.length === 0) {
    productsEl.innerHTML = `<p class="no-results">No hay productos</p>`;
  } else {
    productsEl.innerHTML = list
      .map(p => ProductCard(p, I18N, CURRENCY))
      .join("");
  }

  /* -------- BOTONES AGREGAR -------- */

  document.querySelectorAll(".card button[data-id]").forEach(btn => {
    btn.onclick = () => {
      const prod = PRODUCTS.find(p => p.id === btn.dataset.id);
      CartService.add(prod);

      // 👉 Abrir carrito suavemente SOLO si está cerrado
      if (!cartEl.classList.contains("open")) {
        cartEl.classList.add("open");
      }
    };
  });

  /* -------- CONTADOR -------- */

  cartCountEl.textContent = cart.length;

  /* -------- CARRITO -------- */

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<li class="empty">${I18N[lang].empty}</li>`;
  } else {
    cartItemsEl.innerHTML = cart.map(p => `
      <li class="cart-item">
        <span>${p.name[lang]}</span>
        <span>${CURRENCY[cur].symbol}${(p.priceUSD * CURRENCY[cur].rate).toFixed(2)}</span>
        <button 
          class="btn-remove" 
          data-id="${p.id}">
          ${I18N[lang].remove}
        </button>
      </li>
    `).join("");
  }

  /* -------- TOTAL -------- */

  const total = cart.reduce(
    (sum, p) => sum + p.priceUSD * CURRENCY[cur].rate,
    0
  );

  cartTotalEl.textContent = `${CURRENCY[cur].symbol}${total.toFixed(2)}`;
}

/* ---------------- FILTROS ---------------- */

categoryFilter.onchange = render;

priceFilter.oninput = () => {
  priceValue.textContent = `$${priceFilter.value}`;
  render();
};

searchInput.oninput = render;

/* ---------------- IDIOMA AUTOMÁTICO ---------------- */

const browserLang = navigator.language || navigator.userLanguage;

if (browserLang.startsWith("es")) {
  Store.set({ lang: "es" });
  document.getElementById("lang-select").value = "es";
} else {
  Store.set({ lang: "en" });
  document.getElementById("lang-select").value = "en";
}

/* ---------------- STORE ---------------- */

document.addEventListener("stateChange", render);
render();

/* ---------------- SELECTORES ---------------- */

document.getElementById("lang-select").onchange = e => {
  Store.set({ lang: e.target.value });
};

document.getElementById("currency-select").onchange = e => {
  Store.set({ currency: e.target.value });
};

/* ---------------- CARRITO LATERAL ---------------- */

document.getElementById("cart-button").onclick = () => {
  cartEl.classList.add("open");
  document.body.style.overflow = "hidden"; // 🔥 evita que desaparezca la barra
};

document.getElementById("cart-close").onclick = () => {
  cartEl.classList.remove("open");
  document.body.style.overflow = ""; // 🔥 vuelve normal
};


/* ---------------- QUITAR PRODUCTO ---------------- */

cartItemsEl.onclick = e => {
  const btn = e.target;

  if (btn.classList.contains("btn-remove")) {
    const id = btn.getAttribute("data-id");
    CartService.remove(id);
  }
};
