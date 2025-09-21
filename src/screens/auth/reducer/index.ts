import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IAuthState } from 'src/models';

const initialState: IAuthState = {
  error: null,
  loading: false,
  uid: null,
  // profileComplete: false,
  fcmToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUid(state, { payload }: PayloadAction<string>) {
      state.uid = payload;
    },
    // setProfileComplete(state, { payload }: PayloadAction<boolean>) {
    //   state.profileComplete = payload;
    // },

    clearError(state) {
      state.error = null;
      state.loading = false;
    },
    logout(state) {
      state.error = null;
      state.loading = false;
      state.uid = null;
    },
  },
  extraReducers: () => {},
});

export const { clearError, logout, setUid } =
  authSlice.actions;

export default authSlice.reducer;
