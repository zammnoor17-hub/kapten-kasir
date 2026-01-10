import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Masukkan konfigurasi Firebase Anda di sini
const firebaseConfig = {
  apiKey: "AIzaSyCpFw1yfsUBv73BaT9J6Qj1kKcCmfksFkE",
  authDomain: "warung-kapten.firebaseapp.com",
  databaseURL: "https://warung-kapten-default-rtdb.firebaseio.com/", // Penting untuk RTDB
  projectId: "warung-kapten",
  storageBucket: "warung-kapten.firebasestorage.app",
  messagingSenderId: "980165799650",
  appId: "1:980165799650:web:5e608a429e0781f72ab8bbd"
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);
// Export the database instance for use in other parts of the application
export const db = getDatabase(app);