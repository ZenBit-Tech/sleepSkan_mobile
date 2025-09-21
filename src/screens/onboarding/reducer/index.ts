import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IOnboardingState } from 'src/models'

const initialState: IOnboardingState = {
  isFirstLoggin: false,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    finishOnboarding(state, { payload }: PayloadAction<boolean>) {
      state.isFirstLoggin = payload
    },
  },
})

export const { finishOnboarding } = onboardingSlice.actions

export default onboardingSlice.reducer
