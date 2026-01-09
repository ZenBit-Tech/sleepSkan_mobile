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
import { RecordingScreen, SleepReportScreen } from 'src/screens';
import { PreRecordingScreen } from 'src/screens/preRecording';
import { CheckSoundScreen } from 'src/screens/checkSoundScreen';

export type MainStackList = {
  [MainStack.HOME]: undefined
  [MainStack.RECORDING]: undefined
  [MainStack.PRE_RECORDING]: undefined
  [MainStack.REPORT]: undefined
  [MainStack.CHECK_SOUND]: undefined
}

const Stack = createStackNavigator<MainStackList>();

export const navigationRef = createNavigationContainerRef<MainStackList>();


export const Main_Stack = () => {



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
      <Stack.Screen name={MainStack.HOME} component={MainHomeScreen} />
      <Stack.Screen 
        name={MainStack.RECORDING}
        component={RecordingScreen}
        options={{
          gestureEnabled: false,          
        }} />
      <Stack.Screen 
        name={MainStack.PRE_RECORDING} 
        component={PreRecordingScreen} 
        options={{
          gestureEnabled: false,          
        }}
      />
      <Stack.Screen 
        name={MainStack.CHECK_SOUND} 
        component={CheckSoundScreen} 
        options={{
          gestureEnabled: false,          
        }}
      />
      <Stack.Screen 
        name={MainStack.REPORT} 
        component={SleepReportScreen} 
        options={{
          gestureEnabled: false,          
        }}
      />
    </Stack.Navigator>
  );
};
