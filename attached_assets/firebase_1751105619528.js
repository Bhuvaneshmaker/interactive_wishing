import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWf5ufZip3ZV-QaM98D97G8EM3lcfli68",
  authDomain: "birthday-wish-a09aa.firebaseapp.com",
  projectId: "birthday-wish-a09aa",
  storageBucket: "birthday-wish-a09aa.appspot.com", // fixed typo
  messagingSenderId: "917216787421",
  appId: "1:917216787421:web:d50d24c4d98f2da1249434",
  measurementId: "G-LDH40RDQ0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Service
export const employeeService = {
  // Add new employee with custom ID
  async addEmployee(employee) {
    try {
      const id = String(employee.id || Date.now()); //callback if id is missing
      const docRef = doc(db, 'employees', id);
      await setDoc(docRef, {
        ...employee,
        createdAt: new Date().toISOString()
      });
      return { id, ...employee };
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  // Get all employees
  async getEmployees() {
    try {
      const q = query(collection(db, 'employees'), orderBy('id'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }
};
