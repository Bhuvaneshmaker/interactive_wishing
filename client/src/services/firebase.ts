import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import type { Employee, InsertEmployee } from '@shared/schema';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDWf5ufZip3ZV-QaM98D97G8EM3lcfli68",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "birthday-wish-a09aa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "birthday-wish-a09aa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "birthday-wish-a09aa.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "917216787421",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:917216787421:web:d50d24c4d98f2da1249434",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LDH40RDQ0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const employeeService = {
  async addEmployee(employee: InsertEmployee): Promise<Employee> {
    try {
      const id = String(employee.id || Date.now());
      const docRef = doc(db, 'employees', id);
      const newEmployee = {
        ...employee,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newEmployee);
      return newEmployee as Employee;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw new Error('Failed to add employee. Please try again.');
    }
  },

  async getEmployees(): Promise<Employee[]> {
    try {
      const q = query(collection(db, 'employees'), orderBy('id'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Employee));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to load employees. Please check your connection.');
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'employees', id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee. Please try again.');
    }
  }
};
