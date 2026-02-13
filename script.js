/**
 * YellowPages Info — каталог магазинов с купонами (Израиль)
 * 4 языка: иврит (основной), русский, английский, арабский
 * Поиск, купоны, копирование, переключение языка, RTL
 */

// ========== Коды языков: he, ru, en, ar ==========
const LANG_CODES = ["he", "ru", "en", "ar"];
const RTL_LANGS = ["he", "ar"];
const STORAGE_KEY = "yp-lang";

// Текущий язык (по умолчанию иврит)
let currentLang = (function () {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANG_CODES.includes(saved)) return saved;
  } catch (e) {}
  return "he";
})();

// ========== UI-строки по языкам ==========
const UI = {
  he: {
    heroTitle: "YellowPages Info — הנחות מקומיות לידך",
    heroDesc: "מצאו קופונים והנחות בחנויות לידכם. קטלוג אחד — כל ההצעות המשתלמות בעירכם.",
    searchPlaceholder: "חיפוש לפי שם או קטגוריה...",
    searchLabel: "חיפוש לפי חנויות",
    storesTitle: "חנויות עם קופונים",
    showCoupon: "הצג קופון",
    hideCoupon: "הסתר קופון",
    copyCode: "העתק קוד",
    call: "התקשר",
    getDirections: "איך להגיע",
    codeCopied: "הקוד הועתק",
    noResults: "לא נמצאו תוצאות.",
    adLabel: "פרסום / שותף השבוע",
    adPlaceholder: "כאן יכול להיות הבאנר שלך. ",
    adContactLink: "צרו קשר",
    contactsTitle: "צרו קשר",
    footerCta: "רוצים להוסיף חנות? כתבו לנו!",
    navStores: "חנויות",
    navCoupons: "קופונים",
    navContacts: "צרו קשר"
  },
  ru: {
    heroTitle: "YellowPages Info — локальные скидки рядом",
    heroDesc: "Находите купоны и скидки в магазинах рядом с вами. Один каталог — все выгодные предложения вашего города.",
    searchPlaceholder: "Поиск по названию или категории...",
    searchLabel: "Поиск по магазинам",
    storesTitle: "Магазины с купонами",
    showCoupon: "Показать купон",
    hideCoupon: "Скрыть купон",
    copyCode: "Скопировать код",
    call: "Позвонить",
    getDirections: "Как добраться",
    codeCopied: "Код скопирован",
    noResults: "По вашему запросу ничего не найдено.",
    adLabel: "Реклама / Партнёр недели",
    adPlaceholder: "Здесь может быть ваш баннер. ",
    adContactLink: "Связаться с нами",
    contactsTitle: "Контакты",
    footerCta: "Хотите добавить магазин? Напишите нам!",
    navStores: "Магазины",
    navCoupons: "Купоны",
    navContacts: "Контакты"
  },
  en: {
    heroTitle: "YellowPages Info — local discounts near you",
    heroDesc: "Find coupons and discounts at stores near you. One catalog — all the best deals in your area.",
    searchPlaceholder: "Search by name or category...",
    searchLabel: "Search stores",
    storesTitle: "Stores with coupons",
    showCoupon: "Show coupon",
    hideCoupon: "Hide coupon",
    copyCode: "Copy code",
    call: "Call",
    getDirections: "Get directions",
    codeCopied: "Code copied",
    noResults: "No results found.",
    adLabel: "Ad / Partner of the week",
    adPlaceholder: "Your banner could be here. ",
    adContactLink: "Contact us",
    contactsTitle: "Contact",
    footerCta: "Want to add your store? Get in touch!",
    navStores: "Stores",
    navCoupons: "Coupons",
    navContacts: "Contact"
  },
  ar: {
    heroTitle: "YellowPages Info — خصومات محلية قريبة منك",
    heroDesc: "اعثر على كوبونات وخصومات في المتاجر القريبة منك. كتالوج واحد — كل العروض المربحة في مدينتك.",
    searchPlaceholder: "بحث بالاسم أو الفئة...",
    searchLabel: "بحث في المتاجر",
    storesTitle: "متاجر مع كوبونات",
    showCoupon: "عرض الكوبون",
    hideCoupon: "إخفاء الكوبون",
    copyCode: "نسخ الرمز",
    call: "اتصل",
    getDirections: "كيفية الوصول",
    codeCopied: "تم نسخ الرمز",
    noResults: "لم يتم العثور على نتائج.",
    adLabel: "إعلان / شريك الأسبوع",
    adPlaceholder: "يمكن أن يكون إعلانك هنا. ",
    adContactLink: "اتصل بنا",
    contactsTitle: "اتصل بنا",
    footerCta: "تريد إضافة متجر؟ تواصل معنا!",
    navStores: "المتاجر",
    navCoupons: "كوبونات",
    navContacts: "اتصل بنا"
  }
};

// ========== Магазины: мультиязычные поля (he, ru, en, ar) ==========
const STORES_DATA = [
  {
    id: 1,
    name: { he: "סטייל ואופנה", ru: "Стиль и мода", en: "Style & Fashion", ar: "ستايل وأزياء" },
    category: { he: "ביגוד", ru: "одежда", en: "clothing", ar: "ملابس" },
    description: {
      he: "ביגוד נשים וגברים, אקססוריז. מבצעי עונה.",
      ru: "Женская и мужская одежда, аксессуары. Сезонные распродажи.",
      en: "Women's and men's clothing, accessories. Seasonal sales.",
      ar: "ملابس نسائية ورجالية، إكسسوارات. تخفيضات موسمية."
    },
    hours: { he: "א'-ש' 10:00–21:00", ru: "Пн–Вс 10:00–21:00", en: "Sun–Sat 10:00–21:00", ar: "الأحد–السبت 10:00–21:00" },
    coupon: "YELLOW15",
    couponDesc: { he: "15% הנחה על קנייה ראשונה", ru: "Скидка 15% на первую покупку", en: "15% off first purchase", ar: "خصم 15% على أول شراء" },
    phone: "+972501234501",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 2,
    name: { he: "נעליים לכל המשפחה", ru: "Обувь для всей семьи", en: "Shoes for the whole family", ar: "أحذية للعائلة" },
    category: { he: "נעליים", ru: "обувь", en: "shoes", ar: "أحذية" },
    description: {
      he: "סניקרס, נעליים, מגפיים. מדידה חינם.",
      ru: "Кроссовки, туфли, сапоги. Бесплатная примерка.",
      en: "Sneakers, shoes, boots. Free fitting.",
      ar: "سنيكرز، أحذية، بوت. قياس مجاني."
    },
    hours: { he: "א'-ה' 9:00–20:00, ו' 10:00–18:00", ru: "Пн–Сб 9:00–20:00, Вс 10:00–18:00", en: "Sun–Fri 9:00–20:00, Sat 10:00–18:00", ar: "الأحد–الجمعة 9:00–20:00، السبت 10:00–18:00" },
    coupon: "FAMILY20",
    couponDesc: { he: "20% על זוג שני", ru: "20% на вторую пару", en: "20% off second pair", ar: "20% على الزوج الثاني" },
    phone: "+972501234502",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 3,
    name: { he: "יופי וקוסמטיקה", ru: "Красота и косметика", en: "Beauty & Cosmetics", ar: "جمال ومستحضرات" },
    category: { he: "קוסמטיקה", ru: "косметика", en: "cosmetics", ar: "مستحضرات تجميل" },
    description: {
      he: "בושם, טיפוח, איפור. טסטרים במתנה.",
      ru: "Парфюмерия, уход, декоративная косметика. Тестеры в подарок.",
      en: "Fragrance, skincare, makeup. Free testers.",
      ar: "عطور، عناية، مكياج. عينات مجانية."
    },
    hours: { he: "כל יום 10:00–22:00", ru: "Ежедневно 10:00–22:00", en: "Daily 10:00–22:00", ar: "يومياً 10:00–22:00" },
    coupon: "BEAUTY10",
    couponDesc: { he: "10% על כל המבחר", ru: "10% на весь ассортимент", en: "10% off entire range", ar: "10% على كل التشكيلة" },
    phone: "+972501234503",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 4,
    name: { he: "עולם הטכנולוגיה", ru: "ТехноМир", en: "TechWorld", ar: "عالم التقنية" },
    category: { he: "אלקטרוניקה", ru: "электроника", en: "electronics", ar: "إلكترونيات" },
    description: {
      he: "סמארטפונים, מחשבים, גאדג'טים. תשלום ב-0% ריבית.",
      ru: "Смартфоны, ноутбуки, гаджеты. Рассрочка 0%.",
      en: "Smartphones, laptops, gadgets. 0% financing.",
      ar: "هواتف، أجهزة كمبيوتر، أدوات. تقسيط 0%."
    },
    hours: { he: "א'-ש' 10:00–21:00", ru: "Пн–Вс 10:00–21:00", en: "Sun–Sat 10:00–21:00", ar: "الأحد–السبت 10:00–21:00" },
    coupon: "TECH500",
    couponDesc: { he: "500 ₪ הנחה מעל 15000 ₪", ru: "500 ₪ скидка от 15000 ₪", en: "500 ₪ off over 15000 ₪", ar: "خصم 500 ₪ فوق 15000 ₪" },
    phone: "+972501234504",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 5,
    name: { he: "מתנות souvenirs", ru: "Подарки и сувениры", en: "Gifts & Souvenirs", ar: "هدايا وذكرى" },
    category: { he: "מתנות", ru: "подарки", en: "gifts", ar: "هدايا" },
    description: {
      he: "סטים למתנה, גלויות, דקור. עטיפה במתנה.",
      ru: "Подарочные наборы, открытки, декор. Упаковка в подарок.",
      en: "Gift sets, cards, decor. Free wrapping.",
      ar: "مجموعات هدايا، بطاقات، ديكور. تغليف مجاني."
    },
    hours: { he: "א'-ה' 11:00–19:00, ו'-ש' 10:00–18:00", ru: "Пн–Пт 11:00–19:00, Сб–Вс 10:00–18:00", en: "Sun–Thu 11:00–19:00, Fri–Sat 10:00–18:00", ar: "الأحد–الخميس 11:00–19:00، الجمعة–السبت 10:00–18:00" },
    coupon: "GIFT25",
    couponDesc: { he: "25% על סטי מתנה", ru: "25% на подарочные наборы", en: "25% off gift sets", ar: "25% على مجموعات الهدايا" },
    phone: "+972501234505",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 6,
    name: { he: "קפה ומאפים", ru: "Кофе и булки", en: "Coffee & Pastries", ar: "قهوة ومعجنات" },
    category: { he: "בית קפה", ru: "кафе", en: "cafe", ar: "مقهى" },
    description: {
      he: "מאפים טריים, קפה, ארוחות בוקר. אווירה נעימה.",
      ru: "Свежая выпечка, кофе, завтраки. Уютная атмосфера.",
      en: "Fresh pastries, coffee, breakfast. Cozy atmosphere.",
      ar: "معجنات طازجة، قهوة، إفطار. أجواء مريحة."
    },
    hours: { he: "א'-ש' 8:00–22:00", ru: "Пн–Вс 8:00–22:00", en: "Sun–Sat 8:00–22:00", ar: "الأحد–السبت 8:00–22:00" },
    coupon: "COFFEE2",
    couponDesc: { he: "קפה שני במתנה", ru: "2-й кофе в подарок", en: "Second coffee free", ar: "القهوة الثانية مجاناً" },
    phone: "+972501234506",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 7,
    name: { he: "מוצרי ספורט", ru: "Спорттовары", en: "Sports gear", ar: "مستلزمات رياضية" },
    category: { he: "ספורט", ru: "спорт", en: "sports", ar: "رياضة" },
    description: {
      he: "מכשירי כושר, ביגוד ספורט, אקססוריז.",
      ru: "Тренажёры, одежда для спорта, аксессуары.",
      en: "Fitness equipment, sportswear, accessories.",
      ar: "أجهزة رياضية، ملابس رياضية، إكسسوارات."
    },
    hours: { he: "א'-ש' 10:00–20:00", ru: "Пн–Вс 10:00–20:00", en: "Sun–Sat 10:00–20:00", ar: "الأحد–السبت 10:00–20:00" },
    coupon: "SPORT30",
    couponDesc: { he: "30% על ביגוד ונעליים", ru: "30% на одежду и обувь", en: "30% off clothing and shoes", ar: "30% على الملابس والأحذية" },
    phone: "+972501234507",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  },
  {
    id: 8,
    name: { he: "עולם הילד", ru: "Детский мир", en: "Kids World", ar: "عالم الأطفال" },
    category: { he: "מוצרי ילדים", ru: "детские товары", en: "kids", ar: "منتجات أطفال" },
    description: {
      he: "ביגוד, צעצועים, מוצרים לבית הספר ויצירה.",
      ru: "Одежда, игрушки, товары для школы и творчества.",
      en: "Clothing, toys, school and craft supplies.",
      ar: "ملابس، ألعاب، مستلزمات مدرسة وإبداع."
    },
    hours: { he: "א'-ש' 10:00–21:00", ru: "Пн–Вс 10:00–21:00", en: "Sun–Sat 10:00–21:00", ar: "الأحد–السبت 10:00–21:00" },
    coupon: "KIDS20",
    couponDesc: { he: "20% על צעצועים", ru: "20% на игрушки", en: "20% off toys", ar: "20% على الألعاب" },
    phone: "+972501234508",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Israel",
    image: "assets/placeholder.svg"
  }
];

/** Возвращает объект магазина с полями на текущем языке */
function getStoreInLang(store) {
  const lang = currentLang;
  return {
    id: store.id,
    name: store.name[lang] || store.name.he,
    category: store.category[lang] || store.category.he,
    description: store.description[lang] || store.description.he,
    hours: store.hours[lang] || store.hours.he,
    coupon: store.coupon,
    couponDesc: store.couponDesc[lang] || store.couponDesc.he,
    phone: store.phone,
    mapUrl: store.mapUrl,
    image: store.image
  };
}

/** Текущие UI-строки */
function t(key) {
  return (UI[currentLang] && UI[currentLang][key]) || UI.he[key] || "";
}

// ========== DOM ==========
let searchInput, storesGrid, noResultsEl, toastEl;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Создаёт карточку магазина для текущего языка */
function createStoreCard(store) {
  const s = getStoreInLang(store);
  const searchText = [s.name, s.category, s.description].join(" ").toLowerCase();

  const card = document.createElement("article");
  card.className = "store-card";
  card.dataset.storeId = store.id;
  card.dataset.search = searchText;

  card.innerHTML =
    '<img class="store-card-image" src="' +
    escapeHtml(s.image) +
    '" alt="' +
    escapeHtml(s.name) +
    '" loading="lazy">' +
    '<div class="store-card-body">' +
    '<h3 class="store-card-title">' +
    escapeHtml(s.name) +
    "</h3>" +
    '<span class="store-card-category">' +
    escapeHtml(s.category) +
    "</span>" +
    '<p class="store-card-desc">' +
    escapeHtml(s.description) +
    "</p>" +
    '<p class="store-card-hours">🕐 ' +
    escapeHtml(s.hours) +
    "</p>" +
    '<div class="store-coupon-area">' +
    '<button type="button" class="store-coupon-toggle" data-store-id="' +
    store.id +
    '" aria-expanded="false">' +
    escapeHtml(t("showCoupon")) +
    "</button>" +
    '<div class="store-coupon-reveal" hidden>' +
    '<div class="store-coupon-code">' +
    escapeHtml(s.coupon) +
    "</div>" +
    '<p class="store-coupon-desc" style="margin:0 0 0.5rem; font-size:0.875rem; color:#666;">' +
    escapeHtml(s.couponDesc) +
    "</p>" +
    '<button type="button" class="store-copy-btn" data-copy="' +
    escapeHtml(s.coupon) +
    '">' +
    escapeHtml(t("copyCode")) +
    "</button>" +
    "</div>" +
    "</div>" +
    '<div class="store-actions">' +
    '<a href="tel:' +
    escapeHtml(s.phone) +
    '" class="store-btn store-btn-call">' +
    escapeHtml(t("call")) +
    "</a>" +
    '<a href="' +
    escapeHtml(s.mapUrl) +
    '" class="store-btn store-btn-map" target="_blank" rel="noopener">' +
    escapeHtml(t("getDirections")) +
    "</a>" +
    "</div>" +
    "</div>";

  const toggleBtn = card.querySelector(".store-coupon-toggle");
  const revealEl = card.querySelector(".store-coupon-reveal");
  toggleBtn.addEventListener("click", function () {
    const isOpen = !revealEl.hidden;
    revealEl.hidden = isOpen;
    toggleBtn.setAttribute("aria-expanded", !isOpen);
    toggleBtn.textContent = revealEl.hidden ? t("showCoupon") : t("hideCoupon");
  });

  const copyBtn = card.querySelector(".store-copy-btn");
  copyBtn.addEventListener("click", function () {
    copyToClipboard(this.dataset.copy);
    showToast(t("codeCopied"));
  });

  return card;
}

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

/** Отрисовка списка магазинов с фильтром и текущим языком */
function renderStores(query) {
  if (!storesGrid || !noResultsEl) return;
  const q = (query || "").trim().toLowerCase();
  storesGrid.innerHTML = "";

  const filtered = q
    ? STORES_DATA.filter(function (store) {
        const s = getStoreInLang(store);
        const searchText = [s.name, s.category, s.description].join(" ").toLowerCase();
        return searchText.includes(q);
      })
    : STORES_DATA;

  filtered.forEach(function (store) {
    storesGrid.appendChild(createStoreCard(store));
  });
  noResultsEl.textContent = t("noResults");
  noResultsEl.hidden = filtered.length > 0;
}

/** Обновить все UI-тексты на странице */
function applyUI() {
  var el;
  if ((el = document.getElementById("hero-title"))) el.textContent = t("heroTitle");
  if ((el = document.getElementById("hero-desc"))) el.textContent = t("heroDesc");
  if ((el = document.getElementById("search-label"))) el.textContent = t("searchLabel");
  searchInput && (searchInput.placeholder = t("searchPlaceholder"));
  if ((el = document.getElementById("stores-title"))) el.textContent = t("storesTitle");
  if ((el = document.getElementById("ad-label"))) el.textContent = t("adLabel");
  if ((el = document.getElementById("ad-placeholder"))) {
    el.innerHTML = t("adPlaceholder") + '<a href="#contacts" id="ad-contact-link">' + escapeHtml(t("adContactLink")) + "</a>";
  }
  if ((el = document.getElementById("contacts-title"))) el.textContent = t("contactsTitle");
  if ((el = document.getElementById("footer-cta"))) el.textContent = t("footerCta");
  if ((el = document.getElementById("nav-stores"))) el.textContent = t("navStores");
  if ((el = document.getElementById("nav-coupons"))) el.textContent = t("navCoupons");
  if ((el = document.getElementById("nav-contacts"))) el.textContent = t("navContacts");
  if (noResultsEl) noResultsEl.textContent = t("noResults");
}

/** Установить язык и обновить страницу */
function setLang(lang) {
  if (!LANG_CODES.includes(lang)) return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {}

  const html = document.documentElement;
  html.lang = lang === "ar" ? "ar" : lang === "he" ? "he" : lang === "ru" ? "ru" : "en";
  html.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  applyUI();
  renderStores(searchInput ? searchInput.value : "");

  // Активная кнопка языка
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function init() {
  searchInput = document.getElementById("search-input");
  storesGrid = document.getElementById("stores-grid");
  noResultsEl = document.getElementById("no-results");
  toastEl = document.getElementById("toast");

  // Язык при загрузке
  setLang(currentLang);

  searchInput &&
    searchInput.addEventListener("input", function () {
      renderStores(this.value);
    });
  searchInput &&
    searchInput.addEventListener("search", function () {
      renderStores(this.value);
    });

  // Переключатель языка
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(this.getAttribute("data-lang"));
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
