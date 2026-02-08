import { Store } from "../core/store.js";

export function ProductCard(p, i18n, currency) {
  const { lang, currency: cur } = Store.get();
  const price = (p.priceUSD * currency[cur].rate).toFixed(2);

  return `
    <article class="card">
      <img src="${p.image}" alt="${p.name[lang]}" class="card__image" />
      <h3>${p.name[lang]}</h3>
      <p class="card__description">${p.description[lang]}</p>
      <p class="card__price">${currency[cur].symbol}${price}</p>
      <button data-id="${p.id}">${i18n[lang].add}</button>
    </article>
  `;
}
