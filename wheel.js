/**
 * Колесо удачи для pizuhe_perez. Отдельная страница, призы без сохранения в базу.
 * Язык из localStorage 'yp-lang'. Скидка 10 ₪ выпадает реже.
 */
const LANGS = ['ru', 'en', 'he', 'ar'];
const RTL_LANGS = ['he', 'ar'];
const currentLang = localStorage.getItem('yp-lang') || 'ru';

const WHEEL_UI = {
  ru: {
    pageTitle: 'Колесо удачи — YellowPages Info',
    backToCatalog: 'Назад к каталогу',
    storeName: 'פיצוחי פרץ',
    spin: '✨ Крутить колесо ✨',
    resultTitle: '🎉 Ваш приз 🎉',
    close: 'Закрыть',
    adLabel: 'Реклама',
    adAutoNote: 'Реклама от Google отображается на странице автоматически.',
    prize0: '🥜 100 г фисташек',
    prize1: '💰 Скидка 10 шекелей',
    prize2: '🍑 100 г кураги в подарок',
    prize3: '🎁 100 г микс в подарок',
    prize4: '🥝 100 г киви в подарок',
    wheelPrize0: '100г\nфисташек',
    wheelPrize1: 'Скидка\n10₪',
    wheelPrize2: '100г\nкураги',
    wheelPrize3: '100г\nмикс',
    wheelPrize4: '100г\nкиви'
  },
  en: {
    pageTitle: 'Lucky wheel — YellowPages Info',
    backToCatalog: 'Back to catalog',
    storeName: 'פיצוחי פרץ',
    spin: '✨ Spin the wheel ✨',
    resultTitle: '🎉 Your prize 🎉',
    close: 'Close',
    adLabel: 'Advertisement',
    adAutoNote: 'Ads by Google are displayed automatically on the page.',
    prize0: '🥜 100g pistachios',
    prize1: '💰 10 NIS discount',
    prize2: '🍑 100g dried apricots free',
    prize3: '🎁 100g mix free',
    prize4: '🥝 100g kiwi free',
    wheelPrize0: '100g\npist.',
    wheelPrize1: '10₪\noff',
    wheelPrize2: '100g\napric.',
    wheelPrize3: '100g\nmix',
    wheelPrize4: '100g\nkiwi'
  },
  he: {
    pageTitle: 'גלגל המזל — YellowPages Info',
    backToCatalog: 'חזרה לקטלוג',
    storeName: 'פיצוחי פרץ',
    spin: '✨ סובב את הגלגל ✨',
    resultTitle: '🎉 הפרס שלך 🎉',
    close: 'סגור',
    adLabel: 'פרסום',
    adAutoNote: 'פרסום של Google מוצג אוטומטית בדף.',
    prize0: '🥜 100 גרם פיסטוקים',
    prize1: '💰 הנחה 10 שקל',
    prize2: '🍑 100 גרם משמשים יבשים במתנה',
    prize3: '🎁 100 גרם מיקס במתנה',
    prize4: '🥝 100 גרם קיווי במתנה',
    wheelPrize0: '100 גרם\nפיסטוקים',
    wheelPrize1: 'הנחה\n10₪',
    wheelPrize2: '100 גרם\nמשמשים',
    wheelPrize3: '100 גרם\nמיקס',
    wheelPrize4: '100 גרם\nקיווי'
  },
  ar: {
    pageTitle: 'عجلة الحظ — YellowPages Info',
    backToCatalog: 'العودة إلى الدليل',
    storeName: 'פיצוחי פרץ',
    spin: '✨ دوّر العجلة ✨',
    resultTitle: '🎉 جائزتك 🎉',
    close: 'إغلاق',
    adLabel: 'إعلان',
    adAutoNote: 'إعلانات Google تُعرض تلقائياً على الصفحة.',
    prize0: '🥜 100 غرام فستق',
    prize1: '💰 خصم 10 شيكل',
    prize2: '🍑 100 غرام مشمش مجاني',
    prize3: '🎁 100 غرام ميكس مجاني',
    prize4: '🥝 100 غرام كيوي مجاني',
    wheelPrize0: '100 غرام\nفستق',
    wheelPrize1: 'خصم\n10₪',
    wheelPrize2: '100 غرام\nمشمش',
    wheelPrize3: '100 غرام\nميكس',
    wheelPrize4: '100 غرام\nكيوي'
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
/** Короткая подпись для сегмента (ru/en), иначе полный приз */
function tWheel(index) {
  const k = 'wheelPrize' + index;
  return WHEEL_UI[currentLang]?.[k] != null ? WHEEL_UI[currentLang][k] : t('prize' + index);
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

/** Угол (в градусах), на который нужно повернуть колесо, чтобы центр сегмента index был под указателем (сверху). conic from -90deg → верх = 90deg. */
function angleToSegmentCenter(index) {
  const segmentCenter = index * SEGMENT_DEG + SEGMENT_DEG / 2;
  return (90 - segmentCenter + 360) % 360;
}

/** Накопленный поворот колеса (градусы). Каждый новый спин добавляет полные обороты + угол до сегмента. */
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
    span.style.transform = `rotate(${-angle}deg)`;
    
    // Добавляем иконку
    const icon = document.createElement('i');
    icon.className = PRIZE_ICONS[i];
    span.appendChild(icon);
    
    // Добавляем текст
    const text = document.createElement('div');
    text.textContent = tWheel(i);
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
  const prizeText = t('prize' + index);
  const fullTurns = 6; // Больше оборотов для драматичности
  const toSegment = angleToSegmentCenter(index);
  currentTotalRotation += fullTurns * 360 + toSegment;

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
