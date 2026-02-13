/**
 * YellowPages Info — каталог магазинов с купонами
 * Данные магазинов и логика: поиск, раскрытие купона, копирование, toast
 */

// ========== Демо-магазины (8 штук) ==========
const STORES = [
  {
    id: 1,
    name: "Стиль и мода",
    category: "одежда",
    description: "Женская и мужская одежда, аксессуары. Сезонные распродажи.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "YELLOW15",
    couponDesc: "Скидка 15% на первую покупку",
    phone: "+79001234501",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 2,
    name: "Обувь для всей семьи",
    category: "обувь",
    description: "Кроссовки, туфли, сапоги. Бесплатная примерка.",
    hours: "Пн–Сб 9:00–20:00, Вс 10:00–18:00",
    coupon: "FAMILY20",
    couponDesc: "20% на вторую пару",
    phone: "+79001234502",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 3,
    name: "Красота и косметика",
    category: "косметика",
    description: "Парфюмерия, уход, декоративная косметика. Тестеры в подарок.",
    hours: "Ежедневно 10:00–22:00",
    coupon: "BEAUTY10",
    couponDesc: "10% на весь ассортимент",
    phone: "+79001234503",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 4,
    name: "ТехноМир",
    category: "электроника",
    description: "Смартфоны, ноутбуки, гаджеты. Рассрочка 0%.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "TECH500",
    couponDesc: "500 ₽ скидка от 15000 ₽",
    phone: "+79001234504",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 5,
    name: "Подарки и сувениры",
    category: "подарки",
    description: "Подарочные наборы, открытки, декор. Упаковка в подарок.",
    hours: "Пн–Пт 11:00–19:00, Сб–Вс 10:00–18:00",
    coupon: "GIFT25",
    couponDesc: "25% на подарочные наборы",
    phone: "+79001234505",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 6,
    name: "Кофе и булки",
    category: "кафе",
    description: "Свежая выпечка, кофе, завтраки. Уютная атмосфера.",
    hours: "Пн–Вс 8:00–22:00",
    coupon: "COFFEE2",
    couponDesc: "2-й кофе в подарок",
    phone: "+79001234506",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 7,
    name: "Спорттовары",
    category: "спорт",
    description: "Тренажёры, одежда для спорта, аксессуары.",
    hours: "Пн–Вс 10:00–20:00",
    coupon: "SPORT30",
    couponDesc: "30% на одежду и обувь",
    phone: "+79001234507",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  },
  {
    id: 8,
    name: "Детский мир",
    category: "детские товары",
    description: "Одежда, игрушки, товары для школы и творчества.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "KIDS20",
    couponDesc: "20% на игрушки",
    phone: "+79001234508",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Москва",
    image: "assets/placeholder.svg"
  }
];

// ========== DOM элементы ==========
let searchInput, storesGrid, noResultsEl, toastEl;

/**
 * Создаёт HTML одной карточки магазина
 */
function createStoreCard(store) {
  const card = document.createElement("article");
  card.className = "store-card";
  card.dataset.storeId = store.id;

  const categoryLower = store.category.toLowerCase();
  const searchText = [store.name, store.category, store.description].join(" ").toLowerCase();

  card.innerHTML = `
    <img class="store-card-image" src="${escapeHtml(store.image)}" alt="${escapeHtml(store.name)}" loading="lazy">
    <div class="store-card-body">
      <h3 class="store-card-title">${escapeHtml(store.name)}</h3>
      <span class="store-card-category">${escapeHtml(store.category)}</span>
      <p class="store-card-desc">${escapeHtml(store.description)}</p>
      <p class="store-card-hours">🕐 ${escapeHtml(store.hours)}</p>
      <div class="store-coupon-area">
        <button type="button" class="store-coupon-toggle" data-store-id="${store.id}" aria-expanded="false">
          Показать купон
        </button>
        <div class="store-coupon-reveal" hidden>
          <div class="store-coupon-code">${escapeHtml(store.coupon)}</div>
          <p class="store-coupon-desc" style="margin:0 0 0.5rem; font-size:0.875rem; color:#666;">${escapeHtml(store.couponDesc)}</p>
          <button type="button" class="store-copy-btn" data-copy="${escapeHtml(store.coupon)}">Скопировать код</button>
        </div>
      </div>
      <div class="store-actions">
        <a href="tel:${escapeHtml(store.phone)}" class="store-btn store-btn-call">Позвонить</a>
        <a href="${escapeHtml(store.mapUrl)}" class="store-btn store-btn-map" target="_blank" rel="noopener">Как добраться</a>
      </div>
    </div>
  `;

  card.dataset.search = searchText;

  // Обработчик «Показать купон»
  const toggleBtn = card.querySelector(".store-coupon-toggle");
  const revealEl = card.querySelector(".store-coupon-reveal");

  toggleBtn.addEventListener("click", function () {
    const isOpen = revealEl.hidden === false;
    revealEl.hidden = !revealEl.hidden;
    toggleBtn.setAttribute("aria-expanded", !isOpen);
    toggleBtn.textContent = revealEl.hidden ? "Показать купон" : "Скрыть купон";
  });

  // Обработчик «Скопировать код»
  const copyBtn = card.querySelector(".store-copy-btn");
  copyBtn.addEventListener("click", function () {
    const code = this.dataset.copy;
    copyToClipboard(code);
    showToast("Код скопирован");
  });

  return card;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Отрисовка всех карточек (с учётом фильтра по query)
 */
function renderStores(query) {
  const q = (query || "").trim().toLowerCase();
  storesGrid.innerHTML = "";

  const filtered = q
    ? STORES.filter(function (s) {
        const searchText = [s.name, s.category, s.description].join(" ").toLowerCase();
        return searchText.includes(q);
      })
    : STORES;

  filtered.forEach(function (store) {
    storesGrid.appendChild(createStoreCard(store));
  });

  noResultsEl.hidden = filtered.length > 0;
}

/**
 * Копирование текста в буфер обмена
 */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
}

/**
 * Показать toast на 2 секунды
 */
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add("is-visible");
  clearTimeout(toastEl._toastTimer);
  toastEl._toastTimer = setTimeout(function () {
    toastEl.classList.remove("is-visible");
    setTimeout(function () {
      toastEl.hidden = true;
    }, 300);
  }, 2000);
}

/**
 * Инициализация: привязка поиска и первая отрисовка
 */
function init() {
  searchInput = document.getElementById("search-input");
  storesGrid = document.getElementById("stores-grid");
  noResultsEl = document.getElementById("no-results");
  toastEl = document.getElementById("toast");

  if (!searchInput || !storesGrid) return;

  // Поиск в реальном времени
  searchInput.addEventListener("input", function () {
    renderStores(this.value);
  });

  searchInput.addEventListener("search", function () {
    renderStores(this.value);
  });

  renderStores("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
