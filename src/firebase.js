import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBwoZFzkz2zO58EBe43OEFULVh4R75bv5U",
  authDomain: "you-just-lost-the-game-5d1d4.firebaseapp.com",
  projectId: "you-just-lost-the-game-5d1d4",
  storageBucket: "you-just-lost-the-game-5d1d4.firebasestorage.app",
  messagingSenderId: "435485092174",
  appId: "1:435485092174:web:22363bf5f5a0437556961f",
  measurementId: "G-EJ9SXQV268"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)
