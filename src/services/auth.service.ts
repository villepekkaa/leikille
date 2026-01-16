import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  // Rekisteröi uusi käyttäjä
  register: async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Kirjaudu sisään
  login: async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Kirjaudu ulos
  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  // Kuuntele autentikoinnin tilaa
  onAuthStateChange: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Hae nykyinen käyttäjä
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },
};
