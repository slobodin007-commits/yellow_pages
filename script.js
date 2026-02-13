/**
 * YellowPages Info — Улучшенная версия
 * 4 языка (RU, EN, HE, AR) + Анимации + Иконки категорий
 */

// ========== Язык и локализация ==========
const LANGS = ['ru', 'en', 'he', 'ar'];
const RTL_LANGS = ['he', 'ar'];
let currentLang = localStorage.getItem('yp-lang') || 'ru';

// UI строки для всех языков
const UI = {
  ru: {
    heroTitle: 'YellowPages Info — локальные скидки рядом',
    heroDesc: 'Находите купоны и скидки в магазинах рядом с вами. Один каталог — все выгодные предложения вашего города.',
    searchPlaceholder: 'Поиск по названию или категории...',
    searchLabel: 'Поиск по магазинам',
    storesTitle: 'Магазины с купонами',
    showCoupon: 'Показать купон',
    hideCoupon: 'Скрыть купон',
    copyCode: 'Скопировать код',
    call: 'Позвонить',
    directions: 'Как добраться',
    copied: 'Код скопирован!',
    noResults: 'По вашему запросу ничего не найдено.',
    adLabel: 'Реклама',
    contactsTitle: 'Контакты',
    footerCta: 'Хотите добавить магазин? Напишите нам!',
    footerRights: 'Все права защищены',
    navStores: 'Магазины',
    navCoupons: 'Купоны',
    navContacts: 'Контакты'
  },
  en: {
    heroTitle: 'YellowPages Info — local deals near you',
    heroDesc: 'Find coupons and discounts at stores near you. One catalog — all the best offers in your city.',
    searchPlaceholder: 'Search by name or category...',
    searchLabel: 'Search stores',
    storesTitle: 'Stores with coupons',
    showCoupon: 'Show coupon',
    hideCoupon: 'Hide coupon',
    copyCode: 'Copy code',
    call: 'Call',
    directions: 'Get directions',
    copied: 'Code copied!',
    noResults: 'No results found.',
    adLabel: 'Advertisement',
    contactsTitle: 'Contact',
    footerCta: 'Want to add your store? Get in touch!',
    footerRights: 'All rights reserved',
    navStores: 'Stores',
    navCoupons: 'Coupons',
    navContacts: 'Contact'
  },
  he: {
    heroTitle: 'YellowPages Info — הנחות מקומיות לידך',
    heroDesc: 'מצאו קופונים והנחות בחנויות לידכם. קטלוג אחד — כל ההצעות המשתלמות בעירכם.',
    searchPlaceholder: 'חיפוש לפי שם או קטגוריה...',
    searchLabel: 'חיפוש לפי חנויות',
    storesTitle: 'חנויות עם קופונים',
    showCoupon: 'הצג קופון',
    hideCoupon: 'הסתר קופון',
    copyCode: 'העתק קוד',
    call: 'התקשר',
    directions: 'איך להגיע',
    copied: 'הקוד הועתק!',
    noResults: 'לא נמצאו תוצאות.',
    adLabel: 'פרסום',
    contactsTitle: 'צור קשר',
    footerCta: 'רוצים להוסיף חנות? כתבו לנו!',
    footerRights: 'כל הזכויות שמורות',
    navStores: 'חנויות',
    navCoupons: 'קופונים',
    navContacts: 'צור קשר'
  },
  ar: {
    heroTitle: 'YellowPages Info — خصومات محلية بالقرب منك',
    heroDesc: 'ابحث عن قسائم وخصومات في المتاجر القريبة منك. دليل واحد — أفضل العروض في مدينتك.',
    searchPlaceholder: 'البحث بالاسم أو الفئة...',
    searchLabel: 'البحث في المتاجر',
    storesTitle: 'متاجر مع قسائم',
    showCoupon: 'عرض القسيمة',
    hideCoupon: 'إخفاء القسيمة',
    copyCode: 'نسخ الرمز',
    call: 'اتصل',
    directions: 'الحصول على الاتجاهات',
    copied: 'تم نسخ الرمز!',
    noResults: 'لم يتم العثور على نتائج.',
    adLabel: 'إعلان',
    contactsTitle: 'اتصل بنا',
    footerCta: 'تريد إضافة متجرك؟ اتصل بنا!',
    footerRights: 'جميع الحقوق محفوظة',
    navStores: 'المتاجر',
    navCoupons: 'قسائم',
    navContacts: 'اتصل بنا'
  }
};

// Иконки для категорий
const CATEGORY_ICONS = {
  'одежда': '👕', 'clothing': '👕', 'ביגוד': '👕', 'ملابس': '👕',
  'обувь': '👟', 'shoes': '👟', 'נעליים': '👟', 'أحذية': '👟',
  'косметика': '💄', 'cosmetics': '💄', 'קוסמטיקה': '💄', 'مستحضرات تجميل': '💄',
  'электроника': '📱', 'electronics': '📱', 'אלקטרוניקה': '📱', 'إلكترونيات': '📱',
  'подарки': '🎁', 'gifts': '🎁', 'מתנות': '🎁', 'هدايا': '🎁',
  'кафе': '☕', 'cafe': '☕', 'בית קפה': '☕', 'مقهى': '☕',
  'спорт': '⚽', 'sports': '⚽', 'ספורט': '⚽', 'رياضة': '⚽',
  'детские товары': '🧸', 'kids': '🧸', 'מוצרי ילדים': '🧸', 'منتجات أطفال': '🧸'
};

// Данные магазинов (мультиязычные)
const STORES_DATA = [
  {
    id: 1,
    name: { ru: 'Стиль и Мода', en: 'Style & Fashion', he: 'סטייל ואופנה', ar: 'الأناقة والموضة' },
    category: { ru: 'одежда', en: 'clothing', he: 'ביגוד', ar: 'ملابس' },
    description: {
      ru: 'Женская и мужская одежда, аксессуары. Сезонные распродажи.',
      en: 'Women\'s and men\'s clothing, accessories. Seasonal sales.',
      he: 'ביגוד נשים וגברים, אקססוריז. מבצעי עונה.',
      ar: 'ملابس نسائية ورجالية، إكسسوارات. تخفيضات موسمية.'
    },
    hours: { ru: 'Пн–Вс 10:00–21:00', en: 'Mon–Sun 10:00–21:00', he: 'א\'-ש\' 10:00–21:00', ar: 'الإثنين–الأحد 10:00–21:00' },
    coupon: 'YELLOW15',
    couponDesc: { ru: 'Скидка 15% на первую покупку', en: '15% off first purchase', he: '15% הנחה על קנייה ראשונה', ar: 'خصم 15% على أول عملية شراء' },
    phone: '+1234567801',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=clothing+store',
    image: 'assets/placeholder.svg'
  },
  {
    id: 2,
    name: { ru: 'Обувь для всей семьи', en: 'Family Shoes', he: 'נעליים לכל המשפחה', ar: 'أحذية للعائلة' },
    category: { ru: 'обувь', en: 'shoes', he: 'נעליים', ar: 'أحذية' },
    description: {
      ru: 'Кроссовки, туфли, сапоги. Бесплатная примерка.',
      en: 'Sneakers, shoes, boots. Free fitting.',
      he: 'סניקרס, נעליים, מגפיים. מדידה חינם.',
      ar: 'أحذية رياضية، أحذية، حذاء طويل. تركيب مجاني.'
    },
    hours: { ru: 'Пн–Сб 9:00–20:00', en: 'Mon–Sat 9:00–20:00', he: 'א\'-ו\' 9:00–20:00', ar: 'الإثنين–السبت 9:00–20:00' },
    coupon: 'FAMILY20',
    couponDesc: { ru: '20% на вторую пару', en: '20% off second pair', he: '20% על זוג שני', ar: '20% على الزوج الثاني' },
    phone: '+1234567802',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=shoe+store',
    image: 'assets/placeholder.svg'
  },
  {
    id: 3,
    name: { ru: 'Красота и Косметика', en: 'Beauty & Cosmetics', he: 'יופי וקוסמטיקה', ar: 'الجمال ومستحضرات التجميل' },
    category: { ru: 'косметика', en: 'cosmetics', he: 'קוסמטיקה', ar: 'مستحضرات تجميل' },
    description: {
      ru: 'Парфюмерия, уход, косметика. Тестеры в подарок.',
      en: 'Perfume, skincare, makeup. Free testers.',
      he: 'בושם, טיפוח, איפור. טסטרים במתנה.',
      ar: 'عطور، عناية بالبشرة، مكياج. عينات مجانية.'
    },
    hours: { ru: 'Ежедневно 10:00–22:00', en: 'Daily 10:00–22:00', he: 'כל יום 10:00–22:00', ar: 'يومياً 10:00–22:00' },
    coupon: 'BEAUTY10',
    couponDesc: { ru: '10% на весь ассортимент', en: '10% off everything', he: '10% על כל המבחר', ar: '10% على كل شيء' },
    phone: '+1234567803',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=beauty+store',
    image: 'assets/placeholder.svg'
  },
  {
    id: 4,
    name: { ru: 'ТехноМир', en: 'TechWorld', he: 'עולם הטכנולוגיה', ar: 'عالم التقنية' },
    category: { ru: 'электроника', en: 'electronics', he: 'אלקטרוניקה', ar: 'إلكترونيات' },
    description: {
      ru: 'Смартфоны, ноутбуки, гаджеты. Рассрочка 0%.',
      en: 'Smartphones, laptops, gadgets. 0% financing.',
      he: 'סמארטפונים, מחשבים, גאדג\'טים. תשלום 0% ריבית.',
      ar: 'هواتف ذكية، أجهزة كمبيوتر محمولة، أدوات. تمويل 0%.'
    },
    hours: { ru: 'Пн–Вс 10:00–21:00', en: 'Mon–Sun 10:00–21:00', he: 'א\'-ש\' 10:00–21:00', ar: 'الإثنين–الأحد 10:00–21:00' },
    coupon: 'TECH500',
    couponDesc: { ru: '500₽ скидка от 15000₽', en: '500₽ off over 15000₽', he: '500₪ הנחה מעל 15000₪', ar: 'خصم 500₽ فوق 15000₽' },
    phone: '+1234567804',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=electronics',
    image: 'assets/placeholder.svg'
  },
  {
    id: 5,
    name: { ru: 'Подарки и Сувениры', en: 'Gifts & Souvenirs', he: 'מתנות סוונירים', ar: 'الهدايا والتذكارات' },
    category: { ru: 'подарки', en: 'gifts', he: 'מתנות', ar: 'هدايا' },
    description: {
      ru: 'Подарочные наборы, декор. Упаковка в подарок.',
      en: 'Gift sets, decor. Free wrapping.',
      he: 'סטים למתנה, דקור. עטיפה במתנה.',
      ar: 'مجموعات هدايا، ديكور. تغليف مجاني.'
    },
    hours: { ru: 'Пн–Пт 11:00–19:00', en: 'Mon–Fri 11:00–19:00', he: 'א\'-ה\' 11:00–19:00', ar: 'الإثنين–الجمعة 11:00–19:00' },
    coupon: 'GIFT25',
    couponDesc: { ru: '25% на наборы', en: '25% off sets', he: '25% על סטים', ar: '25% على المجموعات' },
    phone: '+1234567805',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=gift+shop',
    image: 'assets/placeholder.svg'
  },
  {
    id: 6,
    name: { ru: 'Кофе и Булочки', en: 'Coffee & Pastries', he: 'קפה ומאפים', ar: 'القهوة والمعجنات' },
    category: { ru: 'кафе', en: 'cafe', he: 'בית קפה', ar: 'مقهى' },
    description: {
      ru: 'Свежая выпечка, кофе, завтраки. Уютная атмосфера.',
      en: 'Fresh pastries, coffee, breakfast. Cozy atmosphere.',
      he: 'מאפים טריים, קפה, ארוחות בוקר. אווירה נעימה.',
      ar: 'معجنات طازجة، قهوة، إفطار. أجواء مريحة.'
    },
    hours: { ru: 'Пн–Вс 8:00–22:00', en: 'Mon–Sun 8:00–22:00', he: 'א\'-ש\' 8:00–22:00', ar: 'الإثنين–الأحد 8:00–22:00' },
    coupon: 'COFFEE2',
    couponDesc: { ru: '2-й кофе в подарок', en: '2nd coffee free', he: 'קפה שני במתנה', ar: 'القهوة الثانية مجاناً' },
    phone: '+1234567806',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=cafe',
    image: 'assets/placeholder.svg'
  },
  {
    id: 7,
    name: { ru: 'Спорттовары', en: 'Sports Store', he: 'מוצרי ספורט', ar: 'متجر رياضي' },
    category: { ru: 'спорт', en: 'sports', he: 'ספורט', ar: 'رياضة' },
    description: {
      ru: 'Одежда для спорта, тренажёры, аксессуары.',
      en: 'Sportswear, equipment, accessories.',
      he: 'ביגוד ספורט, מכשירי כושר, אקססוריז.',
      ar: 'ملابس رياضية، معدات، إكسسوارات.'
    },
    hours: { ru: 'Пн–Вс 10:00–20:00', en: 'Mon–Sun 10:00–20:00', he: 'א\'-ש\' 10:00–20:00', ar: 'الإثنين–الأحد 10:00–20:00' },
    coupon: 'SPORT30',
    couponDesc: { ru: '30% на одежду', en: '30% off clothing', he: '30% על ביגוד', ar: '30% على الملابس' },
    phone: '+1234567807',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=sports+store',
    image: 'assets/placeholder.svg'
  },
  {
    id: 8,
    name: { ru: 'Детский Мир', en: 'Kids World', he: 'עולם הילד', ar: 'عالم الأطفال' },
    category: { ru: 'детские товары', en: 'kids', he: 'מוצרי ילדים', ar: 'منتجات أطفال' },
    description: {
      ru: 'Одежда, игрушки, товары для школы.',
      en: 'Clothing, toys, school supplies.',
      he: 'ביגוד, צעצועים, מוצרים לבית הספר.',
      ar: 'ملابس، ألعاب، مستلزمات مدرسية.'
    },
    hours: { ru: 'Пн–Вс 10:00–21:00', en: 'Mon–Sun 10:00–21:00', he: 'א\'-ש\' 10:00–21:00', ar: 'الإثنين–الأحد 10:00–21:00' },
    coupon: 'KIDS20',
    couponDesc: { ru: '20% на игрушки', en: '20% off toys', he: '20% על צעצועים', ar: '20% على الألعاب' },
    phone: '+1234567808',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=kids+store',
    image: 'assets/placeholder.svg'
  }
];

// DOM элементы
let searchInput, storesGrid, noResultsEl, toastEl;

// Получить текущую UI строку
function t(key) {
  return (UI[currentLang] && UI[currentLang][key]) || UI.ru[key] || '';
}

// Получить данные магазина на текущем языке
function getStore(store) {
  return {
    id: store.id,
    name: store.name[currentLang] || store.name.ru,
    category: store.category[currentLang] || store.category.ru,
    description: store.description[currentLang] || store.description.ru,
    hours: store.hours[currentLang] || store.hours.ru,
    coupon: store.coupon,
    couponDesc: store.couponDesc[currentLang] || store.couponDesc.ru,
    phone: store.phone,
    mapUrl: store.mapUrl,
    image: store.image
  };
}

// Получить иконку категории
function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '🏪';
}

// Экранирование HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Создание карточки магазина
function createStoreCard(store) {
  const s = getStore(store);
  const icon = getCategoryIcon(s.category);
  
  const card = document.createElement('article');
  card.className = 'store-card';
  card.dataset.storeId = store.id;
  
  const searchText = [s.name, s.category, s.description].join(' ').toLowerCase();
  card.dataset.search = searchText;

  card.innerHTML = `
    <img class="store-card-image" src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}" loading="lazy">
    <div class="store-card-body">
      <h3 class="store-card-title">${escapeHtml(s.name)}</h3>
      <span class="store-card-category">${icon} ${escapeHtml(s.category)}</span>
      <p class="store-card-desc">${escapeHtml(s.description)}</p>
      <p class="store-card-hours">🕐 ${escapeHtml(s.hours)}</p>
      
      <div class="store-coupon-area">
        <button type="button" class="store-coupon-toggle" data-store-id="${store.id}" aria-expanded="false">
          ${escapeHtml(t('showCoupon'))}
        </button>
        <div class="store-coupon-reveal" hidden>
          <div class="store-coupon-code">${escapeHtml(s.coupon)}</div>
          <p class="store-coupon-desc">${escapeHtml(s.couponDesc)}</p>
          <button type="button" class="store-copy-btn" data-copy="${escapeHtml(s.coupon)}">
            ${escapeHtml(t('copyCode'))}
          </button>
        </div>
      </div>
      
      <div class="store-actions">
        <a href="tel:${escapeHtml(s.phone)}" class="store-btn store-btn-call">
          📞 ${escapeHtml(t('call'))}
        </a>
        <a href="${escapeHtml(s.mapUrl)}" class="store-btn store-btn-map" target="_blank" rel="noopener">
          📍 ${escapeHtml(t('directions'))}
        </a>
      </div>
    </div>
  `;

  // Обработчик купона
  const toggleBtn = card.querySelector('.store-coupon-toggle');
  const revealEl = card.querySelector('.store-coupon-reveal');
  
  toggleBtn.addEventListener('click', function() {
    const isOpen = !revealEl.hidden;
    revealEl.hidden = isOpen;
    toggleBtn.setAttribute('aria-expanded', !isOpen);
    toggleBtn.textContent = revealEl.hidden ? t('showCoupon') : t('hideCoupon');
  });

  // Копирование кода
  const copyBtn = card.querySelector('.store-copy-btn');
  copyBtn.addEventListener('click', function() {
    copyToClipboard(this.dataset.copy);
    showToast(t('copied'));
  });

  return card;
}

// Копирование в буфер
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }
  
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

// Показ toast
function showToast(message) {
  if (!toastEl) return;
  
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add('is-visible');
  
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(function() {
    toastEl.classList.remove('is-visible');
    setTimeout(() => { toastEl.hidden = true; }, 400);
  }, 2000);
}

// Отрисовка магазинов
function renderStores(query) {
  if (!storesGrid || !noResultsEl) return;
  
  const q = (query || '').trim().toLowerCase();
  storesGrid.innerHTML = '';
  
  const filtered = q 
    ? STORES_DATA.filter(store => {
        const s = getStore(store);
        const searchText = [s.name, s.category, s.description].join(' ').toLowerCase();
        return searchText.includes(q);
      })
    : STORES_DATA;
  
  filtered.forEach(store => {
    storesGrid.appendChild(createStoreCard(store));
  });
  
  noResultsEl.textContent = t('noResults');
  noResultsEl.hidden = filtered.length > 0;
}

// Обновить UI текст
function updateUI() {
  const els = {
    'hero-title': t('heroTitle'),
    'hero-desc': t('heroDesc'),
    'search-label': t('searchLabel'),
    'stores-title': t('storesTitle'),
    'ad-label': t('adLabel'),
    'contacts-title': t('contactsTitle'),
    'footer-cta': t('footerCta'),
    'footer-rights': t('footerRights'),
    'nav-stores': t('navStores'),
    'nav-coupons': t('navCoupons'),
    'nav-contacts': t('navContacts')
  };
  
  Object.keys(els).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = els[id];
  });
  
  if (searchInput) {
    searchInput.placeholder = t('searchPlaceholder');
  }
}

// Установить язык
function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  
  currentLang = lang;
  localStorage.setItem('yp-lang', lang);
  
  // Обновить HTML атрибуты
  const html = document.documentElement;
  html.lang = lang;
  html.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  
  // Обновить UI
  updateUI();
  renderStores(searchInput ? searchInput.value : '');
  
  // Активная кнопка языка
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Шапка на мобильном: скрывается при прокрутке вниз, появляется при прокрутке вверх (всплывающая панель)
function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;
  var lastScrollY = window.scrollY || window.pageYOffset;
  var ticking = false;
  var mobile = window.matchMedia('(max-width: 599px)');

  function updateHeader() {
    if (!mobile.matches) {
      header.classList.remove('header--hidden');
      return;
    }
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY <= 60) {
      header.classList.remove('header--hidden');
    } else if (scrollY > lastScrollY + 40) {
      header.classList.add('header--hidden');
    } else if (scrollY < lastScrollY - 40) {
      header.classList.remove('header--hidden');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  mobile.addEventListener('change', updateHeader);
  updateHeader();
}

// Инициализация
function init() {
  searchInput = document.getElementById('search-input');
  storesGrid = document.getElementById('stores-grid');
  noResultsEl = document.getElementById('no-results');
  toastEl = document.getElementById('toast');
  
  // Установить сохранённый язык
  setLang(currentLang);
  
  // На мобильном: шапка уезжает вверх при прокрутке вниз, появляется при прокрутке вверх
  initHeaderScroll();
  
  // Поиск
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderStores(this.value);
    });
    searchInput.addEventListener('search', function() {
      renderStores(this.value);
    });
  }
  
  // Переключатель языков
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      setLang(this.dataset.lang);
    });
  });
}

// Запуск
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
