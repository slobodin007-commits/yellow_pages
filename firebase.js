/**
 * YellowPages Info — инициализация Firebase (Firestore + Functions)
 * Подключается на index.html и coupon.html
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-functions.js';

const firebaseConfig = {
  apiKey: 'AIzaSyB23fFpvOQI7hmARiuJ4hY8VKXbaTHO8m0',
  authDomain: 'yellowpages-info.firebaseapp.com',
  projectId: 'yellowpages-info',
  storageBucket: 'yellowpages-info.firebasestorage.app',
  messagingSenderId: '744986718090',
  appId: '1:744986718090:web:48869dff9944cddccc6273'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app, 'europe-west1');

/**
 * Создать одноразовый купон для магазина (Cloud Function).
 * @param {string} storeId - id магазина в Firestore (коллекция stores)
 * @returns {Promise<{ couponId: string }>}
 */
export async function createCoupon(storeId) {
  const fn = httpsCallable(functions, 'createCoupon');
  const result = await fn({ storeId });
  return result.data;
}

/**
 * Погасить купон (Cloud Function). Без PIN — один клик «Подтвердить».
 * @param {string} couponId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function redeemCoupon(couponId) {
  const fn = httpsCallable(functions, 'redeemCoupon');
  const result = await fn({ couponId });
  return result.data;
}

/**
 * Для главной страницы (без модулей): вызов createCoupon и редирект.
 * Вызывается из script.js при клике «Показать купон» у магазина с firestoreId.
 */
export async function createCouponAndRedirect(storeId) {
  const { couponId } = await createCoupon(storeId);
  window.location.href = 'coupon.html?id=' + encodeURIComponent(couponId);
}

/**
 * Создать магазины в Firestore автоматически (один раз после деплоя).
 * PIN по умолчанию: 1234.
 */
export async function seedStores() {
  const fn = httpsCallable(functions, 'seedStores');
  const result = await fn({});
  return result.data;
}

export { db, doc, getDoc };

// Глобальный объект для доступа с главной страницы (script.js без type="module")
window.ypFirebase = {
  createCoupon,
  redeemCoupon,
  createCouponAndRedirect,
  seedStores,
  db,
  app
};
