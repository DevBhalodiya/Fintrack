const { getDb } = require('../config/db');

module.exports = {
  find: async (query = {}, options = {}) => {
    const db = getDb();
    let ref = db.collection('transactions');
    if (query.userId) ref = ref.where('userId', '==', query.userId);
    if (options.sort && options.sort.date === -1) ref = ref.orderBy('date', 'desc');
    const snapshot = await ref.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
  findById: async (id) => {
    const db = getDb();
    const snap = await db.collection('transactions').doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },
  findByIdAndUpdate: async (id, update) => {
    const db = getDb();
    const docRef = db.collection('transactions').doc(id);
    await docRef.update(update);
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  },
  findByIdAndDelete: async (id) => {
    const db = getDb();
    await db.collection('transactions').doc(id).delete();
    return true;
  },
  create: async (data) => {
    const db = getDb();
    const docRef = await db.collection('transactions').add(data);
    const doc = await docRef.get();
    return { id: docRef.id, ...doc.data() };
  },
  aggregateSummaryByType: async (userId) => {
    const db = getDb();
    const snapshot = await db.collection('transactions').where('userId', '==', userId).get();
    const summary = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      summary[data.type] = (summary[data.type] || 0) + Number(data.amount || 0);
    });
    return summary;
  },
};
