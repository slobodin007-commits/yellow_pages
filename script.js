/**
 * YellowPages Info — Финальная кроссбраузер версия
 * 4 языка (RU, EN, HE, AR) + Иконки категорий + Купоны + Поиск
 * FIX: корректная высота fixed header во всех браузерах
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
    couponError: 'Ошибка. Попробуйте позже.',
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
    couponError: 'Error. Try again later.',
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
    couponError: 'שגיאה. נסה שוב.',
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
    couponError: 'خطأ. حاول لاحقاً.',
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

// Часы работы 09:00–21:00 для магазинов из store_adress.txt (одно значение для всех языков)
const HOURS_09_21 = {
  ru: 'Пн–Вс 09:00–21:00',
  en: 'Mon–Sun 09:00–21:00',
  he: "א'-ש' 09:00–21:00",
  ar: 'الإثنين–الأحد 09:00–21:00'
};

// Данные магазинов (первые 4 — из adress/store_adress.txt, название из скобок не переводится)
const STORES_DATA = [
  {
    id: 1,
    firestoreId: 'dr_mobile',
    name: { ru: 'dr_mobile', en: 'dr_mobile', he: 'dr_mobile', ar: 'dr_mobile' },
    category: { ru: 'магазин', en: 'store', he: 'חנות', ar: 'متجر' },
    description: {
      ru: 'Khanita St 22, Haifa.',
      en: 'Khanita St 22, Haifa.',
      he: 'Khanita St 22, Haifa.',
      ar: 'Khanita St 22, Haifa.'
    },
    hours: HOURS_09_21,
    coupon: 'YELLOW15',
    couponDesc: { ru: 'Скидка 15%', en: '15% off', he: '15% הנחה', ar: 'خصم 15%' },
    phone: '+972501234501',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khanita+St+22%2C+Haifa',
    image: 'image_store/dr_mobile.png'
  },
  {
    id: 2,
    firestoreId: 'hanita_dogs',
    name: { ru: 'חניתה דוגס', en: 'חניתה דוגס', he: 'חניתה דוגס', ar: 'חניתה דוגס' },
    category: { ru: 'магазин', en: 'store', he: 'חנות', ar: 'متجر' },
    description: {
      ru: 'Khanita St 27, Haifa.',
      en: 'Khanita St 27, Haifa.',
      he: 'Khanita St 27, Haifa.',
      ar: 'Khanita St 27, Haifa.'
    },
    hours: HOURS_09_21,
    coupon: 'FAMILY20',
    couponDesc: { ru: '20% скидка', en: '20% off', he: '20% הנחה', ar: 'خصم 20%' },
    phone: '+972501234502',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khanita+St+27%2C+Haifa',
    image: 'image_store/hanita_dogs.png'
  },
  {
    id: 3,
    firestoreId: 'florista',
    name: { ru: 'Florista', en: 'Florista', he: 'Florista', ar: 'Florista' },
    category: { ru: 'магазин', en: 'store', he: 'חנות', ar: 'متجر' },
    description: {
      ru: 'Khanita St 34, Haifa.',
      en: 'Khanita St 34, Haifa.',
      he: 'Khanita St 34, Haifa.',
      ar: 'Khanita St 34, Haifa.'
    },
    hours: HOURS_09_21,
    coupon: 'BEAUTY10',
    couponDesc: { ru: '10% скидка', en: '10% off', he: '10% הנחה', ar: 'خصم 10%' },
    phone: '+972501234503',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khanita+St+34%2C+Haifa',
    image: 'image_store/florista.png'
  },
  {
    id: 4,
    firestoreId: 'pizuhe_perez',
    name: { ru: 'פיצוחי פרץ', en: 'פיצוחי פרץ', he: 'פיצוחי פרץ', ar: 'פיצוחי פרץ' },
    category: { ru: 'магазин', en: 'store', he: 'חנות', ar: 'متجر' },
    description: {
      ru: 'Khanita St 40, Haifa.',
      en: 'Khanita St 40, Haifa.',
      he: 'Khanita St 40, Haifa.',
      ar: 'Khanita St 40, Haifa.'
    },
    hours: HOURS_09_21,
    coupon: 'TECH500',
    couponDesc: { ru: 'Скидка по купону', en: 'Coupon discount', he: 'הנחה בקופון', ar: 'خصم بالكوبون' },
    phone: '+972501234504',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khanita+St+40%2C+Haifa',
    image: 'image_store/pizuhe_perez.png'
  },
  {
    id: 5,
    name: { ru: 'Подарки и Сувениры', en: 'Gifts & Souvenirs', he: 'מתנות', ar: 'هدايا' },
    category: { ru: 'подарки', en: 'gifts', he: 'מתנות', ar: 'هدايا' },
    description: {
      ru: 'Подарочные наборы, декор. Упаковка в подарок.',
      en: 'Gift sets, decor. Free wrapping.',
      he: 'סטים למתנה, דקור. עטיפה במתנה.',
      ar: 'مجموعات هدايا، ديكور. تغليف مجاني.'
    },
    hours: { ru: 'Пн–Пт 11:00–19:00', en: 'Mon–Fri 11:00–19:00', he: "א'-ה' 11:00–19:00", ar: 'الإثنين–الجمعة 11:00–19:00' },
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
    hours: { ru: 'Пн–Вс 8:00–22:00', en: 'Mon–Sun 8:00–22:00', he: "א'-ש' 8:00–22:00", ar: 'الإثنين–الأحد 8:00–22:00' },
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
    hours: { ru: 'Пн–Вс 10:00–20:00', en: 'Mon–Sun 10:00–20:00', he: "א'-ש' 10:00–20:00", ar: 'الإثنين–الأحد 10:00–20:00' },
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
    hours: { ru: 'Пн–Вс 10:00–21:00', en: 'Mon–Sun 10:00–21:00', he: "א'-ש' 10:00–21:00", ar: 'الإثنين–الأحد 10:00–21:00' },
    coupon: 'KIDS20',
    couponDesc: { ru: '20% на игрушки', en: '20% off toys', he: '20% על צעצועים', ar: '20% على الألعاب' },
    phone: '+1234567808',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=kids+store',
    image: 'assets/placeholder.svg'
  }
];

// DOM элементы
let searchInput, storesGrid, noResultsEl, toastEl;

// ========== Кроссбраузерный фикс высоты header ==========
function setupHeaderHeightSystem() {
  const header = document.querySelector('.header');
  if (!header) return;

  const update = () => {
    const height = header.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-h', height + 'px');
  };

  // сразу
  update();

  // после полной загрузки (картинки/шрифты)
  window.addEventListener('load', update);

  // поворот/изменение размеров
  window.addEventListener('resize', update);

  // логотип может загрузиться позже
  const logo = document.querySelector('.logo-img');
  if (logo && !logo.complete) {
    logo.addEventListener('load', update, { once: true });
  }

  // самое важное — отслеживание изменений размера header
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(update);
    ro.observe(header);
  } else {
    // fallback для очень старых браузеров
    setInterval(update, 700);
  }
}

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

  card.innerHTML = `
    <img class="store-card-image" src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}" loading="lazy">
    <div class="store-card-body">
      <h3 class="store-card-title">${escapeHtml(s.name)}</h3>
      <span class="store-card-category">${icon} ${escapeHtml(s.category)}</span>
      <p class="store-card-desc">${escapeHtml(s.description)}</p>
      <p class="store-card-hours">🕐 ${escapeHtml(s.hours)}</p>

      <div class="store-coupon-area">
        <button type="button" class="store-coupon-toggle" aria-expanded="false">
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
        <a href="tel:${escapeHtml(s.phone)}" class="store-btn store-btn-call">📞 ${escapeHtml(t('call'))}</a>
        <a href="${escapeHtml(s.mapUrl)}" class="store-btn store-btn-map" target="_blank" rel="noopener">📍 ${escapeHtml(t('directions'))}</a>
      </div>
    </div>
  `;

  const toggleBtn = card.querySelector('.store-coupon-toggle');
  const revealEl = card.querySelector('.store-coupon-reveal');

  toggleBtn.addEventListener('click', async function() {
    if (store.firestoreId && window.ypFirebase) {
      toggleBtn.disabled = true;
      try {
        await window.ypFirebase.createCouponAndRedirect(store.firestoreId);
      } catch (err) {
        console.error(err);
        var msg = t('couponError') || 'Ошибка. Попробуйте позже.';
        var isStoreNotFound = err && err.message && (err.message.includes('not-found') || err.message.includes('Store not found'));
        if (isStoreNotFound) {
          try {
            showToast('Создаём базу магазинов…');
            await window.ypFirebase.seedStores();
            showToast('Готово. Открываю купон…');
            await window.ypFirebase.createCouponAndRedirect(store.firestoreId);
            return;
          } catch (retryErr) {
            console.error(retryErr);
            msg = 'Магазин ещё не добавлен в базу. Откройте страницу с ?seed=1 и нажмите «Создать магазины в базе».';
          }
        } else if (err && err.message && (err.message.includes('unavailable') || err.message.includes('network'))) {
          msg = 'Нет связи. Проверьте интернет.';
        }
        showToast(msg);
      } finally {
        toggleBtn.disabled = false;
      }
      return;
    }
    const isOpen = !revealEl.hidden;
    revealEl.hidden = isOpen;
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    toggleBtn.textContent = revealEl.hidden ? t('showCoupon') : t('hideCoupon');
  });

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
  try { document.execCommand('copy'); }
  finally { document.body.removeChild(textarea); }
}

// Toast
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add('is-visible');

  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.classList.remove('is-visible');
    setTimeout(() => { toastEl.hidden = true; }, 350);
  }, 1800);
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

  filtered.forEach(store => storesGrid.appendChild(createStoreCard(store)));

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

  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
}

// Установить язык
function setLang(lang) {
  if (!LANGS.includes(lang)) return;

  currentLang = lang;
  localStorage.setItem('yp-lang', lang);

  const html = document.documentElement;
  html.lang = lang;
  html.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';

  updateUI();
  renderStores(searchInput ? searchInput.value : '');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // после смены языка высота шапки может измениться
  // (ResizeObserver тоже поймает, но вызов не мешает)
  const header = document.querySelector('.header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
}

// Шапка на мобильном: скрывается при прокрутке вниз, появляется при прокрутке вверх
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY || window.pageYOffset;
  let accDown = 0;
  let accUp = 0;
  const threshold = 18;
  const topZone = 60;
  let ticking = false;
  const mobile = window.matchMedia('(max-width: 599px)');

  function updateHeader() {
    if (!mobile.matches) {
      header.classList.remove('header--hidden');
      accDown = accUp = 0;
      ticking = false;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const delta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    if (scrollY <= topZone) {
      header.classList.remove('header--hidden');
      accDown = accUp = 0;
    } else if (delta > 0) {
      accDown += delta;
      accUp = 0;
      if (accDown >= threshold) {
        header.classList.add('header--hidden');
        accDown = 0;
      }
    } else if (delta < 0) {
      accUp += -delta;
      accDown = 0;
      if (accUp >= threshold) {
        header.classList.remove('header--hidden');
        accUp = 0;
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  mobile.addEventListener('change', () => {
    lastScrollY = window.scrollY || window.pageYOffset;
    accDown = accUp = 0;
    updateHeader();
  });

  updateHeader();
}

// Инициализация
function init() {
  searchInput = document.getElementById('search-input');
  storesGrid = document.getElementById('stores-grid');
  noResultsEl = document.getElementById('no-results');
  toastEl = document.getElementById('toast');

  // Система высоты шапки — ВКЛЮЧАЕМ ПЕРВОЙ
  setupHeaderHeightSystem();

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

  // Рендер
  renderStores('');

  // Блок «Создать магазины»: показывать только при ?seed=1 в URL
  if (window.location.search.indexOf('seed=1') !== -1) {
    var seedBlock = document.getElementById('seed-block');
    var seedBtn = document.getElementById('seed-stores-btn');
    if (seedBlock) seedBlock.hidden = false;
    if (seedBtn) {
      seedBtn.addEventListener('click', function() {
        if (!window.ypFirebase) {
          showToast('Подождите загрузки… и нажмите снова.');
          return;
        }
        seedBtn.disabled = true;
        window.ypFirebase.seedStores()
          .then(function(r) {
            showToast(r.message || 'Готово');
          })
          .catch(function(err) {
            showToast('Ошибка: ' + (err && err.message ? err.message : 'попробуйте позже'));
          })
          .then(function() {
            seedBtn.disabled = false;
          });
      });
    }
  }
}

// Запуск
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}