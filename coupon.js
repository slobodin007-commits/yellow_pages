/**
 * Страница купона: загрузка из Firestore, таймер 20 мин, погашение по кнопке (без PIN).
 * Язык привязан к главной: localStorage 'yp-lang' (ru, en, he, ar).
 */
import { db, doc, getDoc, redeemCoupon } from './firebase.js';

const LANGS = ['ru', 'en', 'he', 'ar'];
const RTL_LANGS = ['he', 'ar'];
const currentLang = localStorage.getItem('yp-lang') || 'ru';

const COUPON_UI = {
  ru: {
    pageTitle: 'Купон — YellowPages Info',
    backToCatalog: '← Назад к каталогу',
    loading: 'Загрузка купона…',
    yourCoupon: 'Ваш купон',
    confirm: 'Подтвердить',
    adLabel: 'Реклама',
    couponUsed: 'Купон уже использован',
    couponExpired: 'Купон просрочен',
    timeLeftFormat: 'Осталось: %1:%2',
    used: 'Использован',
    timeExpired: 'Время истекло',
    noCouponId: 'Не указан код купона.',
    couponNotFound: 'Купон не найден.',
    storeNotFound: 'Магазин не найден.',
    discountByCoupon: 'Скидка по купону',
    redeemFailed: 'Не удалось погасить',
    errorTryAgain: 'Ошибка. Попробуйте снова.',
    errorLoad: 'Ошибка загрузки. Попробуйте позже.',
    errorPermission: 'Нет доступа к базе. Задеплойте правила Firestore: firebase deploy --only firestore:rules'
  },
  en: {
    pageTitle: 'Coupon — YellowPages Info',
    backToCatalog: '← Back to catalog',
    loading: 'Loading coupon…',
    yourCoupon: 'Your coupon',
    confirm: 'Confirm',
    adLabel: 'Advertisement',
    couponUsed: 'Coupon already used',
    couponExpired: 'Coupon expired',
    timeLeftFormat: 'Time left: %1:%2',
    used: 'Used',
    timeExpired: 'Time expired',
    noCouponId: 'Coupon code not specified.',
    couponNotFound: 'Coupon not found.',
    storeNotFound: 'Store not found.',
    discountByCoupon: 'Discount with coupon',
    redeemFailed: 'Could not redeem',
    errorTryAgain: 'Error. Please try again.',
    errorLoad: 'Loading error. Try again later.',
    errorPermission: 'No database access. Deploy Firestore rules: firebase deploy --only firestore:rules'
  },
  he: {
    pageTitle: 'קופון — YellowPages Info',
    backToCatalog: '← חזרה לקטלוג',
    loading: 'טוען קופון…',
    yourCoupon: 'הקופון שלך',
    confirm: 'אישור',
    adLabel: 'פרסום',
    couponUsed: 'הקופון כבר נוצל',
    couponExpired: 'הקופון פג תוקף',
    timeLeftFormat: 'נותר: %1:%2',
    used: 'נוצל',
    timeExpired: 'הזמן אזל',
    noCouponId: 'קוד קופון לא צוין.',
    couponNotFound: 'הקופון לא נמצא.',
    storeNotFound: 'החנות לא נמצאה.',
    discountByCoupon: 'הנחה עם קופון',
    redeemFailed: 'לא ניתן לפדות',
    errorTryAgain: 'שגיאה. נסה שוב.',
    errorLoad: 'שגיאת טעינה. נסה שוב מאוחר יותר.',
    errorPermission: 'אין גישה למסד. פרוס כללי Firestore: firebase deploy --only firestore:rules'
  },
  ar: {
    pageTitle: 'قسيمة — YellowPages Info',
    backToCatalog: '← العودة إلى الدليل',
    loading: 'جاري تحميل القسيمة…',
    yourCoupon: 'قسيمتك',
    confirm: 'تأكيد',
    adLabel: 'إعلان',
    couponUsed: 'تم استخدام القسيمة مسبقاً',
    couponExpired: 'انتهت صلاحية القسيمة',
    timeLeftFormat: 'المتبقي: %1:%2',
    used: 'مُستخدم',
    timeExpired: 'انتهى الوقت',
    noCouponId: 'لم يُحدد رمز القسيمة.',
    couponNotFound: 'القسيمة غير موجودة.',
    storeNotFound: 'المتجر غير موجود.',
    discountByCoupon: 'خصم بالقسيمة',
    redeemFailed: 'تعذر استبدال القسيمة',
    errorTryAgain: 'خطأ. حاول مرة أخرى.',
    errorLoad: 'خطأ في التحميل. حاول لاحقاً.',
    errorPermission: 'لا يوجد وصول لقاعدة البيانات. نشر قواعد Firestore: firebase deploy --only firestore:rules'
  }
};

function t(key) {
  return COUPON_UI[currentLang]?.[key] ?? COUPON_UI.ru[key] ?? key;
}

function applyCouponLang() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = RTL_LANGS.includes(currentLang) ? 'rtl' : 'ltr';
}

const COUPON_ID = new URLSearchParams(window.location.search).get('id');
const EXPIRY_MINUTES = 20;

let couponData = null;
let storeData = null;
let timerInterval = null;

const el = {
  backLink: document.getElementById('back-link'),
  loading: document.getElementById('coupon-loading'),
  error: document.getElementById('coupon-error'),
  content: document.getElementById('coupon-content'),
  couponTitle: document.getElementById('coupon-title'),
  storeName: document.getElementById('coupon-store-name'),
  couponText: document.getElementById('coupon-text'),
  couponCode: document.getElementById('coupon-code'),
  couponTimer: document.getElementById('coupon-timer'),
  couponStatus: document.getElementById('coupon-status'),
  btnRedeem: document.getElementById('btn-redeem'),
  adLabel: document.getElementById('ad-label')
};

function applyCouponUI() {
  document.title = t('pageTitle');
  if (el.backLink) el.backLink.textContent = t('backToCatalog');
  if (el.loading) el.loading.textContent = t('loading');
  if (el.couponTitle) el.couponTitle.textContent = t('yourCoupon');
  if (el.btnRedeem) el.btnRedeem.textContent = t('confirm');
  if (el.adLabel) el.adLabel.textContent = t('adLabel');
}

applyCouponLang();
applyCouponUI();

function showLoading(show) {
  el.loading.classList.toggle('hidden', !show);
}

function showError(message) {
  el.error.textContent = message;
  el.error.classList.remove('hidden');
  el.content.classList.add('hidden');
}

function showContent() {
  el.error.classList.add('hidden');
  el.loading.classList.add('hidden');
  el.content.classList.remove('hidden');
}

/** Обновить отображение статуса и кнопки */
function updateStatus(status, usedAt = null) {
  const statusEl = el.couponStatus;
  const btn = el.btnRedeem;
  statusEl.textContent = '';
  statusEl.className = 'coupon-status';

  if (status === 'used') {
    statusEl.textContent = t('couponUsed');
    statusEl.classList.add('used');
    btn.classList.add('hidden');
    btn.disabled = true;
  } else if (status === 'expired') {
    statusEl.textContent = t('couponExpired');
    statusEl.classList.add('expired');
    btn.classList.add('hidden');
    btn.disabled = true;
  } else {
    btn.classList.remove('hidden');
    btn.disabled = false;
  }
}

/** Таймер обратного отсчёта (секунды до expiresAt) */
function startTimer(expiresAt) {
  function tick() {
    const now = Date.now();
    const end = expiresAt.toMillis ? expiresAt.toMillis() : expiresAt;
    const left = Math.max(0, Math.floor((end - now) / 1000));

    const minutes = Math.floor(left / 60);
    const seconds = left % 60;
    el.couponTimer.textContent = t('timeLeftFormat').replace('%1', minutes).replace('%2', String(seconds).padStart(2, '0'));
    el.couponTimer.classList.toggle('expired', left === 0);

    if (left === 0) {
      clearInterval(timerInterval);
      updateStatus('expired');
    }
  }
  tick();
  timerInterval = setInterval(tick, 1000);
}

/** Загрузить купон и магазин из Firestore */
async function loadCoupon() {
  if (!COUPON_ID) {
    showError(t('noCouponId'));
    return;
  }

  try {
    const couponRef = doc(db, 'coupons', COUPON_ID);
    const couponSnap = await getDoc(couponRef);
    if (!couponSnap.exists()) {
      showError(t('couponNotFound'));
      return;
    }

    couponData = couponSnap.data();
    const { storeId, status, createdAt, expiresAt, usedAt } = couponData;

    // Загрузить данные магазина (название, текст скидки)
    const storeRef = doc(db, 'stores', storeId);
    const storeSnap = await getDoc(storeRef);
    if (!storeSnap.exists()) {
      showError(t('storeNotFound'));
      return;
    }
    storeData = storeSnap.data();

    showContent();
    el.storeName.textContent = storeData.name || storeId;
    el.couponText.textContent = storeData.couponText || t('discountByCoupon');
    el.couponCode.textContent = COUPON_ID;

    const exp = expiresAt?.toMillis ? expiresAt.toMillis() : (expiresAt || 0);
    const now = Date.now();
    const isExpired = exp <= now;

    if (status === 'used') {
      updateStatus('used');
      el.couponTimer.textContent = t('used');
    } else if (isExpired || status === 'expired') {
      updateStatus('expired');
      el.couponTimer.textContent = t('timeExpired');
      el.couponTimer.classList.add('expired');
    } else {
      updateStatus('active');
      startTimer(expiresAt);
    }

    el.btnRedeem.addEventListener('click', doRedeem);
  } catch (err) {
    console.error(err);
    let msg = t('errorLoad');
    if (err && err.code === 'permission-denied') {
      msg = t('errorPermission');
    } else if (err && err.message) {
      msg = t('errorLoad') + ' ' + err.message;
    }
    showError(msg);
  } finally {
    showLoading(false);
  }
}

async function doRedeem() {
  el.btnRedeem.disabled = true;
  el.btnRedeem.textContent = '…';

  try {
    const result = await redeemCoupon(COUPON_ID);
    if (result.success) {
      updateStatus('used');
      el.couponTimer.textContent = t('used');
      if (timerInterval) clearInterval(timerInterval);
    } else {
      el.couponStatus.textContent = result.message || t('redeemFailed');
      el.couponStatus.classList.add('expired');
      el.btnRedeem.disabled = false;
      el.btnRedeem.textContent = t('confirm');
    }
  } catch (err) {
    el.couponStatus.textContent = t('errorTryAgain');
    el.couponStatus.classList.add('expired');
    el.btnRedeem.disabled = false;
    el.btnRedeem.textContent = t('confirm');
  }
}

// Запуск
loadCoupon();
