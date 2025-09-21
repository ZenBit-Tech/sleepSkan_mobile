import React, { useEffect, useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
// import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { createNavigationContainerRef } from '@react-navigation/native';

import { MainStack} from '../constants';

import { MainHomeScreen } from 'src/screens/home';
import { SLOW_CLOSE, SLOW_OPEN, softCardInterpolator } from 'src/utils/navigation';
import { RecordingScreen } from 'src/screens';
import { PreRecordingScreen } from 'src/screens/preRecording';

export type MainStackList = {
  [MainStack.HOME]: undefined
  [MainStack.RECORDING]: undefined
  [MainStack.PRE_RECORDING]: undefined
}

const Stack = createStackNavigator<MainStackList>();

export const navigationRef = createNavigationContainerRef<MainStackList>();


export const Main_Stack = () => {

  // const isProfileCompleted = useSelector(common.isProfileCompleted)
  // const profile = useSelector(profileSelector.profile)



  // useEffect(() => {
  //   if (profile?.email) {
  //     amplitude.setUserId(profile.email)

  //     const identify = new Identify()

  //     identify.set('email', profile.email)
  //     amplitude.identify(identify)
  //   }
  // }, [profile?.email])


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        //@ts-ignore
        orientation: 'portrait',
        cardShadowEnabled: true,
        gestureEnabled: true,
        gestureResponseDistance: 160,
        gestureVelocityImpact: 0.6, 
        transitionSpec: { open: SLOW_OPEN, close: SLOW_CLOSE },
      }}
    >
      {/* {!isProfileCompleted && (
        <Stack.Screen
          name={MainStack.COMLETE_PROFILE_STACK}
          component={Complete_profile_stack}
        />
      )} */}
      <Stack.Screen name={MainStack.HOME} component={MainHomeScreen} />
      <Stack.Screen name={MainStack.RECORDING} component={RecordingScreen} />
      <Stack.Screen name={MainStack.PRE_RECORDING} component={PreRecordingScreen} />
    </Stack.Navigator>
  );
};
