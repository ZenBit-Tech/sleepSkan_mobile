import { getUser } from "src/db";
import { setProfile } from "src/screens/profile/reducer";
import { store } from "src/store";
import { handleFirebaseAuthError } from "src/utils";

export const getUserInfo = async (uid: string) => {
  try {
    const user = await getUser(uid);
    store.dispatch(setProfile(user));

    return user;
  } catch (error) {
    throw handleFirebaseAuthError(error);
  }
};