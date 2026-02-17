/**
 * YellowPages Info — Cloud Functions
 * createCoupon(storeId): создать одноразовый купон, срок 20 минут
 * redeemCoupon(couponId, pin): погасить купон по PIN продавца
 */
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();

const EXPIRY_MINUTES = 20;

/** Генерация уникального ID купона (YP-XXXXX) */
function generateCouponId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'YP-';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * createCoupon — создаёт запись в coupons, возвращает couponId.
 * Вызывается с клиента: { storeId: string }
 */
export const createCoupon = onCall({ region: 'europe-west1' }, async (request) => {
  const { storeId } = request.data || {};
  if (!storeId || typeof storeId !== 'string') {
    throw new HttpsError('invalid-argument', 'storeId is required');
  }

  const storeRef = db.collection('stores').doc(storeId);
  const storeSnap = await storeRef.get();
  if (!storeSnap.exists) {
    throw new HttpsError('not-found', 'Store not found');
  }

  let couponId = generateCouponId();
  const couponsRef = db.collection('coupons');
  // Убедиться, что ID уникален
  let exists = true;
  while (exists) {
    const doc = await couponsRef.doc(couponId).get();
    if (!doc.exists) break;
    couponId = generateCouponId();
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + EXPIRY_MINUTES * 60 * 1000);

  await couponsRef.doc(couponId).set({
    storeId,
    status: 'active',
    createdAt: FieldValue.serverTimestamp(),
    expiresAt,
    usedAt: null
  });

  return { couponId };
});

/**
 * redeemCoupon — проверяет PIN, статус и срок, помечает купон использованным.
 * Вызывается с клиента: { couponId: string, pin: string }
 */
export const redeemCoupon = onCall({ region: 'europe-west1' }, async (request) => {
  const { couponId, pin } = request.data || {};
  if (!couponId || typeof couponId !== 'string') {
    throw new HttpsError('invalid-argument', 'couponId is required');
  }
  if (!pin || typeof pin !== 'string' || pin.length !== 4) {
    return { success: false, message: 'Введите 4 цифры PIN' };
  }

  const couponRef = db.collection('coupons').doc(couponId);
  const couponSnap = await couponRef.get();
  if (!couponSnap.exists) {
    return { success: false, message: 'Купон не найден' };
  }

  const coupon = couponSnap.data();
  const { storeId, status } = coupon;
  const expiresAt = coupon.expiresAt?.toMillis ? coupon.expiresAt.toMillis() : 0;
  const now = Date.now();

  if (status === 'used') {
    return { success: false, message: 'Купон уже использован' };
  }
  if (status === 'expired' || expiresAt < now) {
    await couponRef.update({ status: 'expired' });
    return { success: false, message: 'Купон просрочен' };
  }

  const storeRef = db.collection('stores').doc(storeId);
  const storeSnap = await storeRef.get();
  if (!storeSnap.exists) {
    return { success: false, message: 'Магазин не найден' };
  }

  const storePin = storeSnap.data().pin;
  if (storePin !== pin) {
    return { success: false, message: 'Неверный PIN' };
  }

  await couponRef.update({
    status: 'used',
    usedAt: FieldValue.serverTimestamp()
  });

  return { success: true };
});

/**
 * seedStores — один раз создаёт 4 магазина в Firestore, если их ещё нет.
 * PIN по умолчанию: 1234 (поменять можно в Firebase Console).
 */
const STORES_TO_SEED = [
  { id: 'dr_mobale', name: 'dr_mobale', couponText: 'Скидка 15%' },
  { id: 'hanita_dogs', name: 'חניתה דוגס', couponText: '20% скидка' },
  { id: 'florista', name: 'Florista', couponText: '10% скидка' },
  { id: 'pizuhe_perez', name: 'פיצוחי פרץ', couponText: 'Скидка по купону' }
];

const DEFAULT_PIN = '1234';

export const seedStores = onCall({ region: 'europe-west1' }, async () => {
  const storesRef = db.collection('stores');
  for (const s of STORES_TO_SEED) {
    const ref = storesRef.doc(s.id);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        name: s.name,
        pin: DEFAULT_PIN,
        couponText: s.couponText
      });
    }
  }
  return { success: true, message: 'Магазины созданы. PIN по умолчанию: 1234 (смените в Firebase Console).' };
});
