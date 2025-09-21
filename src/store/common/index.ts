import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ICommonState } from 'src/models';

// import { Factors } from 'src/constants'

const initialState: ICommonState = {
  loadingLastRecording: false,
  progessLoadingLastRecording: 0,
  isShowPlacementScreen: true,
  isProfileCompleted: false,
  isOnboardingEnd: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLastRecordingProgress(state, { payload }: PayloadAction<number>) {
      state.progessLoadingLastRecording = payload;
    },
    toggleIsShowPlacementScreen(state, { payload }: PayloadAction<boolean>) {
      state.isShowPlacementScreen = payload;
    },
    completeProfile(state) {
      state.isProfileCompleted = true;
    },
    reCompleteProfile(state) {
      state.isProfileCompleted = false;
    },
    endOnboarding(state) {
      state.isOnboardingEnd = true;
    },
    clearLastRecording(state) {
      state.loadingLastRecording = false;
      state.progessLoadingLastRecording = 0;
    },
    clearUserFormModalResponse() {
      AsyncStorage.setItem('userFormModalResponse', 'false').catch((error) => {
        console.error('Failed to update AsyncStorage:', error);
      });
    },
  },
});

export const {
  toggleIsShowPlacementScreen,
  completeProfile,
  reCompleteProfile,
  endOnboarding,
  setLastRecordingProgress,
  clearLastRecording,
  clearUserFormModalResponse,
} = commonSlice.actions;
export default commonSlice.reducer;
