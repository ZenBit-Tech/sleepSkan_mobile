import { AppDispatch } from 'src/store'
import { RootState } from 'src/store/rootReducer'

export interface IThunkAPI {
  dispatch: AppDispatch
  state: RootState
  rejectValue: string | null
}

export interface IOnboardingState {
  isFirstLoggin: boolean
}

export interface ICommonState {
  recordingStart: boolean
}

export interface IGlobalState {
  isConnected: boolean
  isInternetReachable: boolean
}

export enum RISK {
  LOW = 'LOW',
  HIGH = 'HIGH',
  MODERATE = 'MODERATE'
}