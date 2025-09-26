import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from '@react-navigation/stack';
// import { useSelector } from 'react-redux'
// import { useAppDispatch } from 'src/store'

import { AuthStack } from '../constants';
import {
  // CodeScreen,
  ForgotPasswordScreen,
  LoginScreen,
  NewPasswordScreen,
  SignUpScreen,
} from '../screens';
import { FirstScreen } from 'src/screens/auth/firstScreen';
import { SLOW_CLOSE, SLOW_OPEN, softCardInterpolator } from 'src/utils/navigation';
// import { onboarding } from 'src/store/selectors'
// import { finishOnboarding } from 'src/screens/onboarding/reducer'

export type AuthStackList = {
  [AuthStack.FIRST]: undefined
  [AuthStack.LOGIN]: undefined
  [AuthStack.SIGN_UP]: undefined
  // [AuthStack.CODE]: {
  //   email: string
  //   token: string | null
  //   screenType: CodeScreenType
  // }
  [AuthStack.FORGOT_PAS]: undefined
  [AuthStack.NEW_PAS]: { token: string }
}

const Stack = createStackNavigator<AuthStackList>();

export const Auth_stack = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
         // @ts-ignore
        orientation: 'portrait',
        cardShadowEnabled: true,
        gestureEnabled: true,
        gestureResponseDistance: 160,
        gestureVelocityImpact: 0.6, 
        transitionSpec: { open: SLOW_OPEN, close: SLOW_CLOSE },
      }}
    >
      <Stack.Screen name={AuthStack.FIRST} component={FirstScreen} />
      <Stack.Screen name={AuthStack.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AuthStack.SIGN_UP} component={SignUpScreen} />
      {/* <Stack.Screen name={AuthStack.CODE} component={CodeScreen} /> */}
      <Stack.Screen
        name={AuthStack.FORGOT_PAS}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
