export type FirebaseAuthError = {
  code: string;
  message: string;
};

export const handleFirebaseAuthError = (error: unknown): Error => {
  if (!error || typeof error !== "object") {
    return new Error("errors.wrong");
  }

  const firebaseError = error as FirebaseAuthError;

  switch (firebaseError.code) {
    case "auth/user-not-found":
      return new Error("errors.userNotFound");

    case "auth/invalid-credential":
      return new Error("errors.invalidCredentials");

    case "auth/email-already-in-use":
      return new Error("errors.emailInUse");

    case "auth/invalid-email":
      return new Error("errors.invalidEmail");

    case "auth/user-disabled":
      return new Error("errors.accountDisabled");

    case "auth/account-exists-with-different-credential":
      return new Error("errors.emailInUse");

    case "auth/requires-recent-login":
      return new Error("errors.requiresRecentLogin");

    case "auth/weak-password":
      return new Error("errors.weakPassword");

    case "auth/user-mismatch":
      return new Error("errors.userMismatch");

    //Network errors
    case "auth/network-request-failed":
      return new Error("errors.networkError");

    case "auth/operation-not-allowed":
      return new Error("errors.operationNotAllowed");

    default:
      return new Error("errors.wrong");
  }
};
