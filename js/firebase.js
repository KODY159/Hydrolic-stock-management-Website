// ========================================
// Firebase Configuration & Initialization
// ========================================

// Import Firebase v9 (compat mode - ใช้งานง่ายกว่า)
// ใช้ Compat SDK เพราะทำงานแบบเดียวกับ v8 แต่ใช้ v9 ได้

// Firebase Config - ใส่ข้อมูลจริงของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyCiU7rPoPS2tJeMjxg6AR91ffPqFCJqIIw",
  authDomain: "hydrolic-stock.firebaseapp.com",
  projectId: "hydrolic-stock",
  storageBucket: "hydrolic-stock.appspot.com",
  messagingSenderId: "280050100494",
  appId: "1:280050100494:web:4262fe5ce3ef4348f18f5f",
};

// Initialize Firebase
let app, auth, db;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// ========================================
// Firestore Helper Functions
// ========================================

// Get all documents from a collection
async function getAllDocs(collection) {
  try {
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error getting ${collection}:`, error);
    return [];
  }
}

// Get single document
async function getDoc(collection, docId) {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document:`, error);
    return null;
  }
}

// Add document
async function addDoc(collection, data) {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error adding document:`, error);
    return { success: false, error: error.message };
  }
}

// Update document
async function updateDoc(collection, docId, data) {
  try {
    await db
      .collection(collection)
      .doc(docId)
      .update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    return { success: true };
  } catch (error) {
    console.error(`Error updating document:`, error);
    return { success: false, error: error.message };
  }
}

// Delete document
async function deleteDoc(collection, docId) {
  try {
    await db.collection(collection).doc(docId).delete();
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document:`, error);
    return { success: false, error: error.message };
  }
}

// Query with where clause
async function queryDocs(collection, field, operator, value) {
  try {
    const snapshot = await db
      .collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error querying ${collection}:`, error);
    return [];
  }
}

// Update stock (increment/decrement)
async function updateStock(collection, docId, amount) {
  try {
    await db
      .collection(collection)
      .doc(docId)
      .update({
        stock: firebase.firestore.FieldValue.increment(amount),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    return { success: true };
  } catch (error) {
    console.error(`Error updating stock:`, error);
    return { success: false, error: error.message };
  }
}

// ========================================
// Export to window (ไม่ใช้ ES6 modules)
// ========================================
if (typeof window !== "undefined") {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDB = db;
  window.getAllDocs = getAllDocs;
  window.getDoc = getDoc;
  window.addDoc = addDoc;
  window.updateDoc = updateDoc;
  window.deleteDoc = deleteDoc;
  window.queryDocs = queryDocs;
  window.updateStock = updateStock;

  console.log("✅ Firebase functions exported to window");
}
