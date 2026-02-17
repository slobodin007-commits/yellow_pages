/**
 * YellowPages Info — главная страница: язык, данные магазинов, поиск, купоны, колесо для pizuhe_perez
 */
const LANGS = ['ru', 'en', 'he', 'ar'];
const RTL_LANGS = ['he', 'ar'];
let currentLang = localStorage.getItem('yp-lang') || 'ru';

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

const HOURS_09_21 = {
  ru: 'Пн–Вс 09:00–21:00',
  en: 'Mon–Sun 09:00–21:00',
  he: "א'-ש' 09:00–21:00",
  ar: 'الإثنين–الأحد 09:00–21:00'
};

const STORES_DATA = [
  {
    id: 1,
    firestoreId: 'dr_mobile',
    name: { ru: 'dr_mobile', en: 'dr_mobile', he: 'dr_mobile', ar: 'dr_mobile' },
    category: { ru: 'магазин', en: 'store', he: 'חנות', ar: 'متجر' },
    description: { ru: 'Khanita St 22, Haifa.', en: 'Khanita St 22, Haifa.', he: 'Khanita St 22, Haifa.', ar: 'Khanita St 22, Haifa.' },
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
    description: { ru: 'Khanita St 27, Haifa.', en: 'Khanita St 27, Haifa.', he: 'Khanita St 27, Haifa.', ar: 'Khanita St 27, Haifa.' },
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
    description: { ru: 'Khanita St 34, Haifa.', en: 'Khanita St 34, Haifa.', he: 'Khanita St 34, Haifa.', ar: 'Khanita St 34, Haifa.' },
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
    description: { ru: 'Khanita St 40, Haifa.', en: 'Khanita St 40, Haifa.', he: 'Khanita St 40, Haifa.', ar: 'Khanita St 40, Haifa.' },
    hours: HOURS_09_21,
    coupon: 'TECH500',
    couponDesc: { ru: 'Колесо удачи', en: 'Lucky wheel', he: 'גלגל המזל', ar: 'عجلة الحظ' },
    phone: '+972501234504',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khanita+St+40%2C+Haifa',
    image: 'image_store/pizuhe_perez.png'
  },
  {
    id: 5,
    name: { ru: 'Подарки и Сувениры', en: 'Gifts & Souvenirs', he: 'מתנות', ar: 'هدايا' },
    category: { ru: 'подарки', en: 'gifts', he: 'מתנות', ar: 'هدايا' },
    description: { ru: 'Подарочные наборы, декор.', en: 'Gift sets, decor.', he: 'סטים למתנה, דקור.', ar: 'مجموعات هدايا، ديكور.' },
    hours: { ru: 'Пн–Пт 11:00–19:00', en: 'Mon–Fri 11:00–19:00', he: "א'-ה' 11:00–19:00", ar: 'الإثنين–الجمعة 11:00–19:00' },
    coupon: 'GIFT25',
    couponDesc: { ru: '25% на наборы', en: '25% off sets', he: '25% על סטים', ar: '25% على المجموعات' },
    phone: '+1234567805',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=gift+shop',
    image: 'assets/placeholder.svg'
  }
];

function t(key) {
  return UI[currentLang]?.[key] ?? UI.ru[key] ?? key;
}

function getStore(store) {
  const lang = currentLang;
  return {
    name: typeof store.name === 'object' ? (store.name[lang] || store.name.ru) : store.name,
    category: typeof store.category === 'object' ? (store.category[lang] || store.category.ru) : store.category,
    description: typeof store.description === 'object' ? (store.description[lang] || store.description.ru) : store.description,
    hours: typeof store.hours === 'object' && store.hours[lang] != null ? store.hours[lang] : (store.hours?.ru || store.hours || ''),
    couponDesc: typeof store.couponDesc === 'object' ? (store.couponDesc[lang] || store.couponDesc.ru) : store.couponDesc,
    coupon: store.coupon,
    phone: store.phone,
    mapUrl: store.mapUrl,
    image: store.image
  };
}

function getCategoryIcon(category) {
  if (!category) return '🏪';
  const lower = String(category).toLowerCase();
  for (const key in CATEGORY_ICONS) {
    if (lower.includes(key.toLowerCase())) return CATEGORY_ICONS[key];
  }
  return '🏪';
}

function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

let storesGrid, noResultsEl, searchInput, toastEl;

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
        <button type="button" class="store-coupon-toggle" aria-expanded="false">${escapeHtml(t('showCoupon'))}</button>
        <div class="store-coupon-reveal" hidden>
          <div class="store-coupon-code">${escapeHtml(s.coupon)}</div>
          <p class="store-coupon-desc">${escapeHtml(s.couponDesc)}</p>
          <button type="button" class="store-copy-btn" data-copy="${escapeHtml(s.coupon)}">${escapeHtml(t('copyCode'))}</button>
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
    if (store.firestoreId === 'pizuhe_perez') {
      window.location.href = 'wheel.html';
      return;
    }
    if (store.firestoreId && window.ypFirebase) {
      toggleBtn.disabled = true;
      try {
        await window.ypFirebase.createCouponAndRedirect(store.firestoreId);
      } catch (err) {
        console.error(err);
        var msg = t('couponError') || 'Ошибка. Попробуйте позже.';
        var isStoreNotFound = err && (
          (err.code === 'functions/not-found') ||
          (err.message && (err.message.includes('not-found') || err.message.includes('Store not found')))
        );
        var isFunctionNotFound = err && (
          (err.code === 'functions/not-found') ||
          (err.message && (err.message.includes('404') || err.message.includes('NOT_FOUND')))
        );
        if (isStoreNotFound) {
          try {
            showToast('Создаём базу магазинов…');
            await window.ypFirebase.seedStores();
            showToast('Готово. Открываю купон…');
            await window.ypFirebase.createCouponAndRedirect(store.firestoreId);
            return;
          } catch (retryErr) {
            console.error(retryErr);
            msg = 'Магазин ещё не в базе. Откройте страницу с ?seed=1 и нажмите «Создать магазины в базе».';
          }
        } else if (isFunctionNotFound) {
          msg = 'Функции не задеплоены. В папке проекта выполните: firebase deploy --only functions';
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
  if (copyBtn) copyBtn.addEventListener('click', function() {
    copyToClipboard(this.dataset.copy);
    showToast(t('copied'));
  });

  return card;
}

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
  try { document.execCommand('copy'); } finally { document.body.removeChild(textarea); }
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add('is-visible');
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(function() {
    toastEl.classList.remove('is-visible');
    setTimeout(function() { toastEl.hidden = true; }, 350);
  }, 1800);
}

function renderStores(query) {
  if (!storesGrid || !noResultsEl) return;
  var q = (query || '').trim().toLowerCase();
  storesGrid.innerHTML = '';
  var filtered = q
    ? STORES_DATA.filter(function(store) {
        var s = getStore(store);
        var searchText = [s.name, s.category, s.description].join(' ').toLowerCase();
        return searchText.indexOf(q) !== -1;
      })
    : STORES_DATA;
  filtered.forEach(function(store) {
    storesGrid.appendChild(createStoreCard(store));
  });
  noResultsEl.textContent = t('noResults');
  noResultsEl.hidden = filtered.length > 0;
}

function updateUI() {
  var els = {
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
  Object.keys(els).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = els[id];
  });
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
}

function setLang(lang) {
  if (LANGS.indexOf(lang) === -1) return;
  currentLang = lang;
  localStorage.setItem('yp-lang', lang);
  var html = document.documentElement;
  html.lang = lang;
  html.dir = RTL_LANGS.indexOf(lang) !== -1 ? 'rtl' : 'ltr';
  updateUI();
  renderStores(searchInput ? searchInput.value : '');
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  var header = document.querySelector('.header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
}

function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;
  var lastScrollY = window.scrollY || window.pageYOffset;
  var mobile = window.matchMedia('(max-width: 599px)');
  function update() {
    if (!mobile.matches) { header.classList.remove('header--hidden'); return; }
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY <= 60) header.classList.remove('header--hidden');
    else if (scrollY > lastScrollY) header.classList.add('header--hidden');
    else header.classList.remove('header--hidden');
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', update, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
  storesGrid = document.getElementById('stores-grid');
  noResultsEl = document.getElementById('no-results');
  searchInput = document.getElementById('search-input');
  toastEl = document.getElementById('toast');

  setLang(currentLang);
  renderStores('');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderStores(this.value);
    });
  }

  var seedBlock = document.getElementById('seed-block');
  var seedBtn = document.getElementById('seed-stores-btn');
  if (seedBlock && location.search.indexOf('seed=1') !== -1) {
    seedBlock.hidden = false;
  }
  if (seedBtn && window.ypFirebase) {
    seedBtn.addEventListener('click', function() {
      seedBtn.disabled = true;
      window.ypFirebase.seedStores().then(function() {
        seedBtn.textContent = 'Готово';
      }).catch(function(err) {
        console.error(err);
        seedBtn.disabled = false;
      });
    });
  }

  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setLang(this.dataset.lang);
    });
  });

  initHeaderScroll();

  var header = document.querySelector('.header');
  if (header) {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
});
