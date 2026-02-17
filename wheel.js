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
    backToCatalog: '← Назад к каталогу',
    storeName: 'פיצוחי פרץ',
    spin: 'Крутить',
    resultTitle: 'Ваш приз',
    close: 'Закрыть',
    adLabel: 'Реклама',
    adAutoNote: 'Реклама от Google отображается на странице автоматически.',
    prize0: '100 г фисташек',
    prize1: 'Скидка 10 шекелей',
    prize2: '100 г кураги в подарок',
    prize3: '100 г микс в подарок',
    prize4: '100 г киви в подарок',
    wheelPrize0: '100г фисташек',
    wheelPrize1: 'Скидка 10₪',
    wheelPrize2: '100г кураги',
    wheelPrize3: '100г микс',
    wheelPrize4: '100г киви'
  },
  en: {
    pageTitle: 'Lucky wheel — YellowPages Info',
    backToCatalog: '← Back to catalog',
    storeName: 'פיצוחי פרץ',
    spin: 'Spin',
    resultTitle: 'Your prize',
    close: 'Close',
    adLabel: 'Advertisement',
    adAutoNote: 'Ads by Google are displayed automatically on the page.',
    prize0: '100g pistachios',
    prize1: '10 NIS discount',
    prize2: '100g dried apricots free',
    prize3: '100g mix free',
    prize4: '100g kiwi free',
    wheelPrize0: '100g pist.',
    wheelPrize1: '10₪ off',
    wheelPrize2: '100g apric.',
    wheelPrize3: '100g mix',
    wheelPrize4: '100g kiwi'
  },
  he: {
    pageTitle: 'גלגל המזל — YellowPages Info',
    backToCatalog: '← חזרה לקטלוג',
    storeName: 'פיצוחי פרץ',
    spin: 'סובב',
    resultTitle: 'הפרס שלך',
    close: 'סגור',
    adLabel: 'פרסום',
    adAutoNote: 'פרסום של Google מוצג אוטומטית בדף.',
    prize0: '100 גרם פיסטוקים',
    prize1: 'הנחה 10 שקל',
    prize2: '100 גרם משמשים יבשים במתנה',
    prize3: '100 גרם מיקס במתנה',
    prize4: '100 גרם קיווי במתנה'
  },
  ar: {
    pageTitle: 'عجلة الحظ — YellowPages Info',
    backToCatalog: '← العودة إلى الدليل',
    storeName: 'פיצוחי פרץ',
    spin: 'دور',
    resultTitle: 'جائزتك',
    close: 'إغلاق',
    adLabel: 'إعلان',
    adAutoNote: 'إعلانات Google تُعرض تلقائياً على الصفحة.',
    prize0: '100 غرام فستق',
    prize1: 'خصم 10 شيكل',
    prize2: '100 غرام مشمش مجاني',
    prize3: '100 غرام ميكس مجاني',
    prize4: '100 غرام كيوي مجاني'
  }
};

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
  const back = document.getElementById('back-link');
  const store = document.getElementById('wheel-store-name');
  const spinBtn = document.getElementById('btn-spin');
  const resultTitle = document.getElementById('result-title');
  const closeBtn = document.getElementById('btn-close');
  const adLabel = document.getElementById('ad-label');
  const adNote = document.getElementById('ad-auto-note');
  if (back) back.textContent = t('backToCatalog');
  if (store) store.textContent = t('storeName');
  if (spinBtn) spinBtn.textContent = t('spin');
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

/** Подписи внутри колеса — крутятся вместе с ним. LTR: от края к центру, RTL: от центра наружу. */
function buildWheelSegments() {
  if (!el.wheelInner) return;
  el.wheelInner.innerHTML = '';
  const rtl = isRtlLang();
  for (let i = 0; i < 5; i++) {
    const seg = document.createElement('div');
    seg.className = 'wheel-segment-label' + (rtl ? ' wheel-segment-label-rtl' : '');
    seg.setAttribute('aria-hidden', 'true');
    const angle = i * SEGMENT_DEG + SEGMENT_DEG / 2;
    seg.style.transform = `rotate(${angle}deg) translateY(-5%)`;
    const span = document.createElement('span');
    span.style.transform = `rotate(${-angle}deg)`;
    span.textContent = rtl ? t('prize' + i) : tWheel(i);
    seg.appendChild(span);
    el.wheelInner.appendChild(seg);
  }
}

function spin() {
  if (!el.wheelInner || !el.btnSpin || !el.result || !el.resultPrize || !el.btnClose) return;
  const index = pickPrizeIndex();
  const prizeText = t('prize' + index);
  const fullTurns = 5;
  const toSegment = angleToSegmentCenter(index);
  currentTotalRotation += fullTurns * 360 + toSegment;

  el.btnSpin.disabled = true;
  el.result.classList.remove('visible');

  el.wheelInner.classList.add('spinning');
  el.wheelInner.style.transform = `rotate(${-currentTotalRotation}deg)`;

  setTimeout(() => {
    el.wheelInner.classList.remove('spinning');
    el.resultPrize.textContent = prizeText;
    el.result.classList.add('visible');
    el.btnClose.focus();
    el.btnSpin.disabled = false;
  }, 4100);
}

function closeResult() {
  if (el.result) el.result.classList.remove('visible');
}

applyLang();
applyUI();
buildWheelSegments();

if (el.btnSpin) el.btnSpin.addEventListener('click', spin);
if (el.btnClose) el.btnClose.addEventListener('click', closeResult);
