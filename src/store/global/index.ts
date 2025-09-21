import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IGlobalState } from 'src/models';


const initialState: IGlobalState = {
  isConnected: true,
  isInternetReachable: true,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setInternetConnections(
      state,
      {
        payload,
      }: PayloadAction<{
        isConnected: boolean
        isInternetReachable: boolean
      }>,
    ) {
      state.isConnected = payload.isConnected;
      state.isInternetReachable = payload.isInternetReachable;
    },
  },
});

export const { setInternetConnections } = globalSlice.actions;
export default globalSlice.reducer;
