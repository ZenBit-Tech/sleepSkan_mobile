import { createSlice } from '@reduxjs/toolkit';

import { IProfile, IProfileState } from 'src/models';
import { PayloadAction } from '@reduxjs/toolkit';


const initialState: IProfileState = {
  error: null,
  loading: false,
  profile: null,
  // reminderTime: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearState(state) {
      state.error = null;
      state.loading = false;
      state.profile = null;
    },
    setEmailAndFullName(state, { payload }: PayloadAction<{name: string, email: string}>) {
      state.profile = {
        name: payload.name,
        email: payload.email,
      };
    },
    setProfile(state, { payload }: PayloadAction<IProfile>) {
      state.profile = payload;
    },
    setRecording(state, { payload }: PayloadAction<boolean>) {
      if (state.profile) {
        state.profile.recording = payload;
      }
    }
  },
  extraReducers: () => {
  },
});

export const { clearState, setEmailAndFullName, setProfile, setRecording } = profileSlice.actions;

export default profileSlice.reducer;
