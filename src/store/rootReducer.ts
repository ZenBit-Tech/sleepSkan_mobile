import { combineReducers } from '@reduxjs/toolkit'

//common
import onboardingReducer from 'src/screens/onboarding/reducer'
// auth
import authReducer from 'src/screens/auth/reducer'
//main
// import insightsReducer from 'src/screens/insightsScreen/reducer'
// import recordingReducer from 'src/screens/recordingScreen/reducer'
// import reportReducer from 'src/screens/reportScreen/reducer'
// import homeReducer from 'src/screens/homeScreen/reducer'
// import resultsReducer from 'src/screens/resultsScreen/reducer'
// import calendarReducer from 'src/screens/calendarScreen/reducer'
// import trendsReducer from 'src/screens/trendsScreen/reducer'
//profile
import profileReducer from 'src/screens/profile/reducer'

import commonReducer from './common'
import globalReducer from './global'

export const rootReducer = combineReducers({
  global: globalReducer,
  common: commonReducer,
  onboarding: onboardingReducer,
  auth: authReducer,
  // insights: insightsReducer,
  // recording: recordingReducer,
  // report: reportReducer,
  // home: homeReducer,
  // results: resultsReducer,
  // calendar: calendarReducer,
  profile: profileReducer,
  // trends: trendsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
