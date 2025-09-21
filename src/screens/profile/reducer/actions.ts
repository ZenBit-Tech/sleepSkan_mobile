import { createAsyncThunk } from '@reduxjs/toolkit'
import { t } from 'i18next'
import Toast from 'react-native-toast-message'

import {
  IProfile,
  IProfileReq,
  IReminder,
  ISubmissionData,
  IThunkAPI,
} from 'src/models'
import {
  fetchProfileService,
  updateProfileService,
  deleteProfileService,
  setNotificationReminderTimeService,
  getNotificationReminderTimeService,
  submitMarketingFormService,
} from 'src/services/profile'

export const fetchProfile = createAsyncThunk<IProfile, undefined, IThunkAPI>(
  'fetchProfile',
  async (_, thunkAPI) => {
    try {
      const data = await fetchProfileService()

      return data
    } catch (e: any) {
      const errorMessage: string = e as string

      Toast.show({
        type: 'error',
        text1: errorMessage,
      })

      return thunkAPI.rejectWithValue(errorMessage)
    }
  },
)

export const updateProfile = createAsyncThunk<
  IProfile,
  IProfileReq & { onSuccess?: (obj?: any) => void },
  IThunkAPI
>(
  'updateProfile',
  async (
    {
      name,
      age,
      gender,
      backups,
      isNotificationsEnabled,
      acceptMarketingMaterials,
      onSuccess = () => {},
    },
    thunkAPI,
  ) => {
    try {
      const body = {
        ...(name && { name }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(backups !== undefined && { backups }),
        ...(isNotificationsEnabled !== undefined && { isNotificationsEnabled }),
        ...(acceptMarketingMaterials !== undefined && {
          acceptMarketingMaterials,
        }),
      }

      const data = await updateProfileService(body)

      onSuccess()

      return data
    } catch (e: any) {
      const errorMessage: string = e as string

      Toast.show({
        type: 'error',
        text1: errorMessage,
      })

      return thunkAPI.rejectWithValue(errorMessage)
    }
  },
)

export const deleteProfile = createAsyncThunk<
  undefined,
  { onSuccess: () => void },
  IThunkAPI
>('deleteProfile', async ({ onSuccess = () => {} }, thunkAPI) => {
  try {
    await deleteProfileService()

    onSuccess()
  } catch (e: any) {
    const errorMessage: string = e as string

    Toast.show({
      type: 'error',
      text1: errorMessage,
    })

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const setNotificationReminderTime = createAsyncThunk<
  IReminder,
  { body: IReminder; onSuccess?: () => void },
  IThunkAPI
>(
  'setNotificationReminderTime',
  async ({ body, onSuccess = () => {} }, thunkAPI) => {
    try {
      await setNotificationReminderTimeService(body)

      onSuccess()

      return body
    } catch (e: any) {
      const errorMessage: string = e as string

      Toast.show({
        type: 'error',
        text1: errorMessage,
      })

      return thunkAPI.rejectWithValue(errorMessage)
    }
  },
)

export const getNotificationReminderTime = createAsyncThunk<
  IReminder,
  void,
  IThunkAPI
>('getNotificationReminderTime', async (_, thunkAPI) => {
  try {
    const reminder = await getNotificationReminderTimeService()

    return reminder
  } catch (e: any) {
    const errorMessage: string = e as string

    Toast.show({
      type: 'error',
      text1: errorMessage,
    })

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const submitMarketingForm = createAsyncThunk<
  void,
  ISubmissionData & { onSuccess?: () => void },
  IThunkAPI
>(
  'submitMarketingForm',
  async ({ onSuccess = () => {}, ...submissionData }, thunkAPI) => {
    try {
      await submitMarketingFormService(submissionData)

      onSuccess()
    } catch (e: any) {
      const errorMessage: string = e as string

      Toast.show({
        type: 'error',
        text1: t('errors.createZohoTicket'),
      })

      return thunkAPI.rejectWithValue(errorMessage)
    }
  },
)
