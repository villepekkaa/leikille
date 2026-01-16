import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Playdate, User } from '../types';

export const firestoreService = {
  // Käyttäjät
  users: {
    create: async (userId: string, userData: Partial<User>) => {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    },

    get: async (userId: string): Promise<User | null> => {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    },

    update: async (userId: string, userData: Partial<User>) => {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: Timestamp.now(),
      });
    },
  },

  // Leikkitreffit
  playdates: {
    create: async (playdateData: Omit<Playdate, 'id' | 'createdAt' | 'updatedAt'>) => {
      const docRef = await addDoc(collection(db, 'playdates'), {
        ...playdateData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    },

    get: async (playdateId: string): Promise<Playdate | null> => {
      const docSnap = await getDoc(doc(db, 'playdates', playdateId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Playdate;
      }
      return null;
    },

    // Hae päivän leikkitreffit
    getTodaysPlaydates: async (): Promise<Playdate[]> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        collection(db, 'playdates'),
        where('date', '>=', Timestamp.fromDate(today)),
        where('date', '<', Timestamp.fromDate(tomorrow)),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Playdate[];
    },

    update: async (playdateId: string, playdateData: Partial<Playdate>) => {
      await updateDoc(doc(db, 'playdates', playdateId), {
        ...playdateData,
        updatedAt: Timestamp.now(),
      });
    },

    delete: async (playdateId: string) => {
      await deleteDoc(doc(db, 'playdates', playdateId));
    },

    // Liity leikkiin
    joinPlaydate: async (playdateId: string, userId: string, childrenCount: number) => {
      const playdate = await firestoreService.playdates.get(playdateId);
      if (!playdate) throw new Error('Playdate not found');

      const participants = playdate.participants || [];
      participants.push({
        userId,
        user: {} as User, // Tämä täytetään UI:ssa
        childrenCount,
        joinedAt: new Date(),
      });

      await firestoreService.playdates.update(playdateId, { participants });
    },
  },
};
