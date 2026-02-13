/**
 * YellowPages Info — каталог магазинов с купонами
 * Mobile-first статический сайт
 * Поиск, фильтрация, отображение купонов, копирование кодов
 */

// ========== Данные магазинов ==========
const STORES_DATA = [
  {
    id: 1,
    name: "Стиль и Мода",
    category: "одежда",
    description: "Женская и мужская одежда, аксессуары. Сезонные распродажи и эксклюзивные коллекции.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "YELLOW15",
    couponDesc: "Скидка 15% на первую покупку",
    phone: "+1234567801",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=clothing+store",
    image: "assets/placeholder.svg"
  },
  {
    id: 2,
    name: "Обувь для всей семьи",
    category: "обувь",
    description: "Кроссовки, туфли, сапоги. Бесплатная примерка и консультация специалиста.",
    hours: "Пн–Сб 9:00–20:00, Вс 10:00–18:00",
    coupon: "FAMILY20",
    couponDesc: "20% на вторую пару обуви",
    phone: "+1234567802",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=shoe+store",
    image: "assets/placeholder.svg"
  },
  {
    id: 3,
    name: "Красота и Косметика",
    category: "косметика",
    description: "Парфюмерия, уход за кожей, декоративная косметика. Тестеры в подарок при покупке.",
    hours: "Ежедневно 10:00–22:00",
    coupon: "BEAUTY10",
    couponDesc: "10% на весь ассортимент",
    phone: "+1234567803",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=beauty+store",
    image: "assets/placeholder.svg"
  },
  {
    id: 4,
    name: "ТехноМир",
    category: "электроника",
    description: "Смартфоны, ноутбуки, гаджеты. Рассрочка 0% на 12 месяцев. Официальная гарантия.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "TECH500",
    couponDesc: "500 руб. скидка при покупке от 15000 руб.",
    phone: "+1234567804",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=electronics+store",
    image: "assets/placeholder.svg"
  },
  {
    id: 5,
    name: "Подарки и Сувениры",
    category: "подарки",
    description: "Подарочные наборы, открытки, декор для дома. Упаковка в подарок при любой покупке.",
    hours: "Пн–Пт 11:00–19:00, Сб–Вс 10:00–18:00",
    coupon: "GIFT25",
    couponDesc: "25% на подарочные наборы",
    phone: "+1234567805",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=gift+shop",
    image: "assets/placeholder.svg"
  },
  {
    id: 6,
    name: "Кофе и Булочки",
    category: "кафе",
    description: "Свежая выпечка, ароматный кофе, завтраки. Уютная атмосфера для встреч с друзьями.",
    hours: "Пн–Вс 8:00–22:00",
    coupon: "COFFEE2",
    couponDesc: "Второй кофе в подарок при покупке двух напитков",
    phone: "+1234567806",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=cafe",
    image: "assets/placeholder.svg"
  },
  {
    id: 7,
    name: "Спорттовары",
    category: "спорт",
    description: "Тренажёры, одежда для спорта, аксессуары для фитнеса. Профессиональные консультации.",
    hours: "Пн–Вс 10:00–20:00",
    coupon: "SPORT30",
    couponDesc: "30% на спортивную одежду и обувь",
    phone: "+1234567807",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=sports+store",
    image: "assets/placeholder.svg"
  },
  {
    id: 8,
    name: "Детский Мир",
    category: "детские товары",
    description: "Одежда, игрушки, товары для школы и творчества. Развивающие игры для всех возрастов.",
    hours: "Пн–Вс 10:00–21:00",
    coupon: "KIDS20",
    couponDesc: "20% на детские игрушки",
    phone: "+1234567808",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=kids+store",
    image: "assets/placeholder.svg"
  }
];

// ========== DOM элементы ==========
let searchInput, storesGrid, noResultsEl, toastEl;

/**
 * Экранирование HTML для безопасности
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Создание карточки магазина
 */
function createStoreCard(store) {
  const card = document.createElement("article");
  card.className = "store-card";
  card.dataset.storeId = store.id;
  
  // Для поиска: объединяем все текстовые поля
  const searchText = [store.name, store.category, store.description].join(" ").toLowerCase();
  card.dataset.search = searchText;

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
          <p class="store-coupon-desc">${escapeHtml(store.couponDesc)}</p>
          <button type="button" class="store-copy-btn" data-copy="${escapeHtml(store.coupon)}">
            Скопировать код
          </button>
        </div>
      </div>
      
      <div class="store-actions">
        <a href="tel:${escapeHtml(store.phone)}" class="store-btn store-btn-call">
          📞 Позвонить
        </a>
        <a href="${escapeHtml(store.mapUrl)}" class="store-btn store-btn-map" target="_blank" rel="noopener">
          📍 Как добраться
        </a>
      </div>
    </div>
  `;

  // Обработчик показа/скрытия купона
  const toggleBtn = card.querySelector(".store-coupon-toggle");
  const revealEl = card.querySelector(".store-coupon-reveal");
  
  toggleBtn.addEventListener("click", function() {
    const isOpen = !revealEl.hidden;
    revealEl.hidden = isOpen;
    toggleBtn.setAttribute("aria-expanded", !isOpen);
    toggleBtn.textContent = revealEl.hidden ? "Показать купон" : "Скрыть купон";
  });

  // Обработчик копирования кода
  const copyBtn = card.querySelector(".store-copy-btn");
  copyBtn.addEventListener("click", function() {
    copyToClipboard(this.dataset.copy);
    showToast("Код скопирован!");
  });

  return card;
}

/**
 * Копирование текста в буфер обмена
 */
function copyToClipboard(text) {
  // Современный API (для большинства браузеров)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }
  
  // Fallback для старых браузеров
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Показ всплывающего уведомления (toast)
 */
function showToast(message) {
  if (!toastEl) return;
  
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add("is-visible");
  
  // Скрыть через 2 секунды
  clearTimeout(toastEl._toastTimer);
  toastEl._toastTimer = setTimeout(function() {
    toastEl.classList.remove("is-visible");
    setTimeout(function() {
      toastEl.hidden = true;
    }, 300);
  }, 2000);
}

/**
 * Отрисовка списка магазинов с учётом поискового запроса
 */
function renderStores(query) {
  if (!storesGrid || !noResultsEl) return;
  
  const q = (query || "").trim().toLowerCase();
  storesGrid.innerHTML = "";
  
  // Фильтрация по запросу
  const filtered = q 
    ? STORES_DATA.filter(store => {
        const searchText = [store.name, store.category, store.description].join(" ").toLowerCase();
        return searchText.includes(q);
      })
    : STORES_DATA;
  
  // Добавляем карточки
  filtered.forEach(store => {
    storesGrid.appendChild(createStoreCard(store));
  });
  
  // Показываем сообщение, если ничего не найдено
  noResultsEl.hidden = filtered.length > 0;
}

/**
 * Инициализация приложения
 */
function init() {
  // Получаем ссылки на DOM элементы
  searchInput = document.getElementById("search-input");
  storesGrid = document.getElementById("stores-grid");
  noResultsEl = document.getElementById("no-results");
  toastEl = document.getElementById("toast");
  
  // Первоначальная отрисовка всех магазинов
  renderStores("");
  
  // Обработчик поиска (в реальном времени)
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      renderStores(this.value);
    });
    
    // Обработчик для кнопки "очистить" в поле поиска
    searchInput.addEventListener("search", function() {
      renderStores(this.value);
    });
  }
}

// Запуск после загрузки DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
