import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';

import dayjs from 'dayjs';
import { setProfile } from 'src/screens/profile/reducer';
import { store } from 'src/store';

// import { Profile } from "../types";

type CreateUserData = {
  email: string | null;
  name: string | null;
  isProfileComplete: boolean
};

type UserData = {
  email?: string;
  name?: string;
  createdAt?: string;
  isProfileComplete?: boolean;
  first_questionary?: number
  second_questionary?: number
  dob?: string;
  gender?: 'male' | 'female';
  height?: number;
  weight?: number;
  neck?: boolean;
  tired?: boolean;
  stop_breathing?: boolean;
  loud_snore?: boolean;
  blood_pressure?: boolean;
  score?: number;
  BMI?: number
};

export const defaultProfile: Omit<{email: string, name: string, createdAt: string}, 'id'> = {
  name: '',
  email: '',
  createdAt: '',
};

export const createUser = async (userId: string, data: CreateUserData) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'users', userId);

    const userData = {
      ...defaultProfile,
      ...data,
      createdAt: dayjs().toISOString(),
      isProfileComplete: false,
    };
    await setDoc(docRef, userData);
  } catch (error) {
    console.error('Error setting user data:', error);

    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      store.dispatch(setProfile(data))

      return { id: userId, ...data };
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const updateUser = async (
  userId: string,
  updatedData: Partial<UserData>,
) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error('Error updating profile:', error,);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'users', userId);

    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const fetchPrivacyPolicy = async () => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'legalDocuments', 'privacyPolicy');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Privacy policy not found');
    }
  } catch (error) {
    throw error;
  }
};
export const fetchTermsAndConditions = async () => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'legalDocuments', 'termsAndConditions');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Privacy policy not found');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchTips = async () => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'content', 'tips');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Tips not found');
    }
  } catch (error) {
    throw error;
  }
};
