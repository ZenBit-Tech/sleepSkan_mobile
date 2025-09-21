import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { createUser, getUser } from 'src/db';
import { logout } from 'src/screens/auth/reducer';
import { setProfile } from 'src/screens/profile/reducer';
import { store } from 'src/store';
import { handleFirebaseAuthError } from 'src/utils';

export const registerWithEmail = async (email: string, password: string, name: string) => {
  try {
    const authCredentials = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password,
    );

    const {
      user: { email: userEmail, uid },
    } = authCredentials;

    await createUser(uid, {
      email: userEmail,
      name: name,
      isProfileComplete: false,
    });

    return authCredentials;
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const auth = getAuth();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = await getUser(userCredential.user.uid);
    //@ts-ignore
    store.dispatch(setProfile(user));

    return userCredential;
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};

export const logoutFirebase = async () => {
  try {
    const auth = getAuth();

    await signOut(auth);

    await store.dispatch(logout());

    return true;
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    return { message: 'Password reset email sent successfully.' };
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};

export const deleteAccount = async (reAuthHandler?: () => Promise<boolean>) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('errors.noAuthenticatedUser');
    }

    try {
      await currentUser.delete();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        if (!reAuthHandler) {
          throw new Error('errors.requiresRecentLogin');
        }

        await reAuthHandler();

        await currentUser.delete();
      } else {
        throw error;
      }
    }

    // If deletion succeeded, delete user data
    // await deleteUser(currentUser.uid);
    return true;
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};
