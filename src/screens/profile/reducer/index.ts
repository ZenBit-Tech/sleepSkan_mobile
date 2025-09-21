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
  },
  extraReducers: () => {
    // //delete profile
    // builder.addCase(deleteProfile.fulfilled, (state) => {
    //   state.profile = null;
    //   state.loading = false;
    // });
    // //setNotificationReminderTime
    // builder.addCase(
    //   setNotificationReminderTime.fulfilled,
    //   (state, { payload }) => {
    //     state.reminderTime = payload;

    //     state.loading = false;
    //   },
    // );
    // //getNotificationReminderTime
    // builder.addCase(
    //   getNotificationReminderTime.fulfilled,
    //   (state, { payload }) => {
    //     state.reminderTime = payload;

    //     state.loading = false;
    //   },
    // );

    // builder.addCase(submitMarketingForm.fulfilled, (state) => {
    //   state.loading = false;
    // });

    // builder.addMatcher(
    //   isAnyOf(
    //     fetchProfile.pending,
    //     deleteProfile.pending,
    //     updateProfile.pending,
    //     setNotificationReminderTime.pending,
    //     getNotificationReminderTime.pending,
    //     submitMarketingForm.pending,
    //   ),
    //   (state) => {
    //     state.loading = true;
    //   },
    // );
    // builder.addMatcher(
    //   isAnyOf(fetchProfile.fulfilled, updateProfile.fulfilled),
    //   (state, { payload }) => {
    //     state.loading = false;
    //     state.profile = payload;
    //   },
    // );
    // builder.addMatcher(
    //   isAnyOf(
    //     fetchProfile.rejected,
    //     updateProfile.rejected,
    //     deleteProfile.rejected,
    //     setNotificationReminderTime.pending,
    //     getNotificationReminderTime.pending,
    //     submitMarketingForm.rejected,
    //   ),
    //   (state, { payload }) => {
    //     state.loading = false;
    //     state.error = payload || null;
    //   },
    // );
  },
});

export const { clearState, setEmailAndFullName, setProfile } = profileSlice.actions;

export default profileSlice.reducer;
