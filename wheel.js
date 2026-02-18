/**
 * Колесо удачи для pizuhe_perez. Отдельная страница, призы без сохранения в базу.
 * Язык из localStorage 'yp-lang'. Скидка 10 ₪ выпадает реже.
 */
const LANGS = ['ru', 'en', 'he', 'ar'];
const RTL_LANGS = ['he', 'ar'];
const currentLang = localStorage.getItem('yp-lang') || 'ru';

/**
 * Единый объект призов: и подписи на колесе (label), и текст в попапе результата (ru, en, he, ar).
 * Меняйте только здесь — изменения появятся и на сегментах, и в «Ваш приз».
 */
const PRIZES = [
  {
    ru: '🥜 100 г фисташек',
    en: '🥜 100g pistachios',
    he: '🥜 100 גרם פיסטוקים',
    ar: '🥜 100 غرام فستق',
    label: { ru: '100г\nфисташек', en: '100g\npist.', he: '100 גרם\nפיסטוקים', ar: '100 غرام\nفستق' }
  },
  {
    ru: '💰 Скидка 10 шекелей',
    en: '💰 10 NIS discount',
    he: '💰 הנחה 10 שקל',
    ar: '💰 خصم 10 شيكل',
    label: { ru: 'Скидка\n10₪', en: '10₪\noff', he: 'הנחה\n10₪', ar: 'خصم\n10₪' }
  },
  {
    ru: '🍑 100 г кураги в подарок',
    en: '🍑 100g dried apricots free',
    he: '🍑 100 גרם משמשים יבשים במתנה',
    ar: '🍑 100 غرام مشمش مجاني',
    label: { ru: '100г\nкураги', en: '100g\napric.', he: '100 גרם\nמשמשים', ar: '100 غرام\nمشمش' }
  },
  {
    ru: '🎁 100 г микс в подарок',
    en: '🎁 100g mix free',
    he: '🎁 100 גרם מיקס במתנה',
    ar: '🎁 100 غرام ميكس مجاني',
    label: { ru: '100г\nмикс', en: '100g\nmix', he: '100 גרם\nמיקס', ar: '100 غرام\nميكس' }
  },
  {
    ru: '🥝 100 г киви в подарок',
    en: '🥝 100g kiwi free',
    he: '🥝 100 גרם קיווי במתנה',
    ar: '🥝 100 غرام كيوي مجاني',
    label: { ru: '100г\nкиви', en: '100g\nkiwi', he: '100 גרם\nקיווי', ar: '100 غرام\nكيوي' }
  }
];

const WHEEL_UI = {
  ru: {
    pageTitle: 'Колесо удачи — YellowPages Info',
    backToCatalog: 'Назад к каталогу',
    storeName: 'פיצוחי פרץ',
    spin: '✨ Крутить колесо ✨',
    resultTitle: '🎉 Ваш приз 🎉',
    close: 'Закрыть',
    adLabel: 'Реклама',
    adAutoNote: 'Реклама от Google отображается на странице автоматически.'
  },
  en: {
    pageTitle: 'Lucky wheel — YellowPages Info',
    backToCatalog: 'Back to catalog',
    storeName: 'פיצוחי פרץ',
    spin: '✨ Spin the wheel ✨',
    resultTitle: '🎉 Your prize 🎉',
    close: 'Close',
    adLabel: 'Advertisement',
    adAutoNote: 'Ads by Google are displayed automatically on the page.'
  },
  he: {
    pageTitle: 'גלגל המזל — YellowPages Info',
    backToCatalog: 'חזרה לקטלוג',
    storeName: 'פיצוחי פרץ',
    spin: '✨ סובב את הגלגל ✨',
    resultTitle: '🎉 הפרס שלך 🎉',
    close: 'סגור',
    adLabel: 'פרסום',
    adAutoNote: 'פרסום של Google מוצג אוטומטית בדף.'
  },
  ar: {
    pageTitle: 'عجلة الحظ — YellowPages Info',
    backToCatalog: 'العودة إلى الدليل',
    storeName: 'פיצוחי פרץ',
    spin: '✨ دوّر العجلة ✨',
    resultTitle: '🎉 جائزتك 🎉',
    close: 'إغلاق',
    adLabel: 'إعلان',
    adAutoNote: 'إعلانات Google تُعرض تلقائياً على الصفحة.'
  }
};

// Иконки Font Awesome для призов
const PRIZE_ICONS = [
  'fa-solid fa-seedling',      // фисташки
  'fa-solid fa-tags',           // скидка
  'fa-solid fa-lemon',          // курага
  'fa-solid fa-gift',           // микс
  'fa-solid fa-leaf'            // киви
];

// Веса: индекс 1 (скидка 10 ₪) реже. [2,1,2,2,2] → скидка ~11%
const PRIZE_WEIGHTS = [2, 1, 2, 2, 2];
const SEGMENT_DEG = 360 / 5;

function t(key) {
  return WHEEL_UI[currentLang]?.[key] ?? WHEEL_UI.ru[key] ?? key;
}
/** Текст приза для попапа результата — из единого объекта PRIZES */
function getPrizeText(index) {
  const p = PRIZES[index];
  return p ? (p[currentLang] ?? p.ru) : '';
}
/** Подпись на сегменте колеса — из того же объекта PRIZES (поле label) */
function getPrizeLabel(index) {
  const p = PRIZES[index];
  if (!p) return '';
  const lab = p.label && p.label[currentLang] != null ? p.label[currentLang] : p[currentLang] ?? p.ru;
  return lab;
}

function applyLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = RTL_LANGS.includes(currentLang) ? 'rtl' : 'ltr';
}

function applyUI() {
  document.title = t('pageTitle');
  const backText = document.getElementById('back-text');
  const store = document.getElementById('wheel-store-name');
  const spinBtn = document.getElementById('btn-spin');
  const resultTitle = document.getElementById('result-title');
  const closeBtn = document.getElementById('btn-close');
  const adLabel = document.getElementById('ad-label');
  const adNote = document.getElementById('ad-auto-note');
  
  if (backText) backText.textContent = t('backToCatalog');
  if (store) store.textContent = t('storeName');
  if (spinBtn) {
    spinBtn.innerHTML = `<i class="fas fa-star"></i> ${t('spin')}`;
  }
  if (resultTitle) resultTitle.textContent = t('resultTitle');
  if (closeBtn) closeBtn.textContent = t('close');
  if (adLabel) adLabel.textContent = t('adLabel');
  if (adNote) adNote.textContent = t('adAutoNote');
}

/** Выбор приза по весам (индекс 1 реже) */
function pickPrizeIndex() {
  const total = PRIZE_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZE_WEIGHTS.length; i++) {
    r -= PRIZE_WEIGHTS[i];
    if (r <= 0) return i;
  }
  return 0;
}

/** Центр сегмента index в градусах (0° = верх, где указатель). */
function segmentCenterAngle(index) {
  return index * SEGMENT_DEG + SEGMENT_DEG / 2;
}

/**
 * При rotate(-T) под указателем оказывается сегмент с центром (T mod 360).
 * Чтобы под указателем был сегмент index, нужно currentTotalRotation mod 360 = segmentCenterAngle(index).
 */
let currentTotalRotation = 0;

const el = {
  wheelInner: document.getElementById('wheel-inner'),
  wheelCenter: document.getElementById('wheel-center'),
  btnSpin: document.getElementById('btn-spin'),
  result: document.getElementById('wheel-result'),
  resultPrize: document.getElementById('result-prize'),
  btnClose: document.getElementById('btn-close')
};

function isRtlLang() {
  return currentLang === 'he' || currentLang === 'ar';
}

/** Создание сегментов с современной графикой */
function buildWheelSegments() {
  if (!el.wheelInner) return;
  el.wheelInner.innerHTML = '';
  const rtl = isRtlLang();
  
  // Создаем только подписи с иконками
  for (let i = 0; i < 5; i++) {
    const label = document.createElement('div');
    label.className = 'wheel-segment-label' + (rtl ? ' wheel-segment-label-rtl' : '');
    label.setAttribute('aria-hidden', 'true');
    
    const angle = i * SEGMENT_DEG + SEGMENT_DEG / 2;
    label.style.transform = `rotate(${angle}deg)`;
    
    const span = document.createElement('span');
    span.style.transform = 'rotate(0deg)'; /* по радиусу, без обратного поворота */
    
    // Добавляем иконку
    const icon = document.createElement('i');
    icon.className = PRIZE_ICONS[i];
    span.appendChild(icon);
    
    // Добавляем текст (из того же PRIZES, что и в попапе)
    const text = document.createElement('div');
    text.textContent = getPrizeLabel(i);
    text.style.whiteSpace = 'pre-line';
    text.style.textAlign = 'center';
    span.appendChild(text);
    
    label.appendChild(span);
    el.wheelInner.appendChild(label);
  }
}

function spin() {
  if (!el.wheelInner || !el.btnSpin || !el.result || !el.resultPrize || !el.btnClose) return;
  const index = pickPrizeIndex();
  const prizeText = getPrizeText(index);
  const fullTurns = 6;
  const targetAngle = segmentCenterAngle(index);
  const currentMod = ((currentTotalRotation % 360) + 360) % 360;
  const delta = (targetAngle - currentMod + 360) % 360;
  currentTotalRotation += fullTurns * 360 + delta;

  el.btnSpin.disabled = true;
  el.result.classList.remove('visible');

  // Анимация кнопки при старте
  el.btnSpin.style.transform = 'scale(0.95)';
  setTimeout(() => {
    el.btnSpin.style.transform = '';
  }, 100);

  el.wheelInner.classList.add('spinning');
  el.wheelInner.style.transform = `rotate(${-currentTotalRotation}deg)`;

  // Звуковой эффект (опционально)
  // playSpinSound();

  setTimeout(() => {
    el.wheelInner.classList.remove('spinning');
    el.resultPrize.textContent = prizeText;
    el.result.classList.add('visible');
    el.btnClose.focus();
    el.btnSpin.disabled = false;
    
    // Конфетти эффект (опционально)
    // triggerConfetti();
  }, 5100);
}

function closeResult() {
  if (el.result) el.result.classList.remove('visible');
}

applyLang();
applyUI();
buildWheelSegments();

if (el.btnSpin) el.btnSpin.addEventListener('click', spin);
if (el.btnClose) el.btnClose.addEventListener('click', closeResult);

// Анимация центра при наведении
if (el.wheelCenter) {
  el.wheelCenter.addEventListener('mouseenter', () => {
    el.wheelCenter.style.transform = 'scale(1.1)';
  });
  el.wheelCenter.addEventListener('mouseleave', () => {
    el.wheelCenter.style.transform = '';
  });
}
