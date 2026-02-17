/**
 * Страница купона: загрузка из Firestore, таймер 20 мин, погашение по PIN
 */
import { db, doc, getDoc, redeemCoupon } from './firebase.js';

const COUPON_ID = new URLSearchParams(window.location.search).get('id');
const EXPIRY_MINUTES = 20;

let couponData = null;
let storeData = null;
let timerInterval = null;

const el = {
  loading: document.getElementById('coupon-loading'),
  error: document.getElementById('coupon-error'),
  content: document.getElementById('coupon-content'),
  storeName: document.getElementById('coupon-store-name'),
  couponText: document.getElementById('coupon-text'),
  couponCode: document.getElementById('coupon-code'),
  couponTimer: document.getElementById('coupon-timer'),
  couponStatus: document.getElementById('coupon-status'),
  btnRedeem: document.getElementById('btn-redeem'),
  pinModal: document.getElementById('pin-modal'),
  pinInput: document.getElementById('pin-input'),
  pinError: document.getElementById('pin-error'),
  pinCancel: document.getElementById('pin-cancel'),
  pinConfirm: document.getElementById('pin-confirm')
};

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
    statusEl.textContent = 'Купон уже использован';
    statusEl.classList.add('used');
    btn.classList.add('hidden');
    btn.disabled = true;
  } else if (status === 'expired') {
    statusEl.textContent = 'Купон просрочен';
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
    el.couponTimer.textContent = `Осталось: ${minutes}:${String(seconds).padStart(2, '0')}`;
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
    showError('Не указан код купона.');
    return;
  }

  try {
    const couponRef = doc(db, 'coupons', COUPON_ID);
    const couponSnap = await getDoc(couponRef);
    if (!couponSnap.exists()) {
      showError('Купон не найден.');
      return;
    }

    couponData = couponSnap.data();
    const { storeId, status, createdAt, expiresAt, usedAt } = couponData;

    // Загрузить данные магазина (название, текст скидки)
    const storeRef = doc(db, 'stores', storeId);
    const storeSnap = await getDoc(storeRef);
    if (!storeSnap.exists()) {
      showError('Магазин не найден.');
      return;
    }
    storeData = storeSnap.data();

    showContent();
    el.storeName.textContent = storeData.name || storeId;
    el.couponText.textContent = storeData.couponText || 'Скидка по купону';
    el.couponCode.textContent = COUPON_ID;

    const exp = expiresAt?.toMillis ? expiresAt.toMillis() : (expiresAt || 0);
    const now = Date.now();
    const isExpired = exp <= now;

    if (status === 'used') {
      updateStatus('used');
      el.couponTimer.textContent = 'Использован';
    } else if (isExpired || status === 'expired') {
      updateStatus('expired');
      el.couponTimer.textContent = 'Время истекло';
      el.couponTimer.classList.add('expired');
    } else {
      updateStatus('active');
      startTimer(expiresAt);
    }

    // Обработчики кнопки и модалки PIN
    el.btnRedeem.addEventListener('click', openPinModal);
    el.pinCancel.addEventListener('click', closePinModal);
    el.pinConfirm.addEventListener('click', submitPin);
    el.pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitPin(); });
  } catch (err) {
    console.error(err);
    var msg = 'Ошибка загрузки. Попробуйте позже.';
    if (err && err.code === 'permission-denied') {
      msg = 'Нет доступа к базе. Задеплойте правила Firestore: firebase deploy --only firestore:rules';
    } else if (err && err.message) {
      msg = 'Ошибка: ' + err.message;
    }
    showError(msg);
  } finally {
    showLoading(false);
  }
}

function openPinModal() {
  el.pinError.textContent = '';
  el.pinInput.value = '';
  el.pinModal.classList.remove('hidden');
  el.pinInput.focus();
}

function closePinModal() {
  el.pinModal.classList.add('hidden');
}

async function submitPin() {
  const pin = el.pinInput.value.trim();
  if (pin.length !== 4) {
    el.pinError.textContent = 'Введите 4 цифры PIN';
    return;
  }

  el.pinConfirm.disabled = true;
  el.pinError.textContent = '';

  try {
    const result = await redeemCoupon(COUPON_ID, pin);
    if (result.success) {
      closePinModal();
      updateStatus('used');
      el.couponTimer.textContent = 'Использован';
      if (timerInterval) clearInterval(timerInterval);
    } else {
      el.pinError.textContent = result.message || 'Неверный PIN или купон уже использован';
    }
  } catch (err) {
    el.pinError.textContent = 'Ошибка. Попробуйте снова.';
  } finally {
    el.pinConfirm.disabled = false;
  }
}

// Запуск
loadCoupon();
