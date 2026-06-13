const { getDb } = require('../config/db');

module.exports = {
  findOne: async (query) => {
    const db = getDb();
    const usersRef = db.collection('users');
    if (query && query.email) {
      const snapshot = await usersRef.where('email', '==', query.email.toLowerCase()).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { _id: doc.id, ...doc.data() };
    }
    return null;
  },
  create: async (data) => {
    const db = getDb();
    const usersRef = db.collection('users');
    const docRef = await usersRef.add(data);
    const doc = await docRef.get();
    return { _id: docRef.id, ...doc.data() };
  },
};
