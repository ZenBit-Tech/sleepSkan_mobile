import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ICommonState } from 'src/models';

// import { Factors } from 'src/constants'

const initialState: ICommonState = {
  recordingStart: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setRecordingStart(state, { payload }: PayloadAction<boolean>) {
      state.recordingStart = payload;
    },
   
    clearUserFormModalResponse() {
      AsyncStorage.setItem('userFormModalResponse', 'false').catch((error) => {
        console.error('Failed to update AsyncStorage:', error);
      });
    },
  },
});

export const {
  setRecordingStart,
  clearUserFormModalResponse,
} = commonSlice.actions;
export default commonSlice.reducer;
