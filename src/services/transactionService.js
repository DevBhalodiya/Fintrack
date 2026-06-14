import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Add a new transaction to Firestore for a specific user.
 * @param {string} userId - The unique ID of the user.
 * @param {Object} transactionData - The data of the transaction.
 */
export const addTransaction = async (userId, transactionData) => {
  const transactionsRef = collection(db, 'transactions');
  const parsedAmount = parseFloat(transactionData.amount) || 0;
  
  const docRef = await addDoc(transactionsRef, {
    userId,
    amount: parsedAmount,
    type: transactionData.type,
    category: transactionData.category,
    description: transactionData.description || '',
    date: transactionData.date || new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp()
  });
  
  return { 
    id: docRef.id, 
    ...transactionData,
    amount: parsedAmount 
  };
};

/**
 * Fetch all transactions for a specific user from Firestore.
 * @param {string} userId - The unique ID of the user.
 */
export const getTransactions = async (userId) => {
  const transactionsRef = collection(db, 'transactions');
  const q = query(transactionsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const transactions = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    transactions.push({ 
      id: doc.id, 
      ...data,
      amount: Number(data.amount) || 0 // Explicitly ensure amount is a number
    });
  });

  // Sort by date (descending) then by createdAt (descending)
  // Doing it client-side avoids requiring a composite index in Firestore immediately
  return transactions.sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA); // Newer date first
    }
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA; // Newer creation first
  });
};

/**
 * Delete a transaction from Firestore.
 * @param {string} transactionId - The ID of the transaction to delete.
 */
export const deleteTransaction = async (transactionId) => {
  const docRef = doc(db, 'transactions', transactionId);
  await deleteDoc(docRef);
};
