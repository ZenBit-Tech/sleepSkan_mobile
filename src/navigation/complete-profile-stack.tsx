import React, { useMemo } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { CompleteProfileStack } from 'src/constants';
import { StartScreen } from 'src/screens/profile';
import { FirstQuestionary } from 'src/screens/profile/firstQuestionary';
import { FirstQuestionaryResult } from 'src/screens/profile/FirstQuestionaryResult';
import { SecondaryQuestionary } from 'src/screens/profile/secondaryQuestionary';
import { profileInfo } from 'src/store/selectors';
import { Step1Screen, Step2Screen, Step3Screen, Step4Screen } from 'src/screens';
import { SLOW_CLOSE, SLOW_OPEN, softCardInterpolator } from 'src/utils/navigation';

export type CompleteProfileStackList = {
  [CompleteProfileStack.START]: undefined
  [CompleteProfileStack.FIRST_QUESTIONARY]: { beginning: boolean }
  [CompleteProfileStack.FIRST_QUESTIONARY_RESULT]: undefined
  [CompleteProfileStack.SECOND_QUESTIONARY]: { beginning: boolean }
  [CompleteProfileStack.STEP1]: undefined
  [CompleteProfileStack.STEP2]: undefined
  [CompleteProfileStack.STEP3]: undefined
  [CompleteProfileStack.STEP4]: undefined
}

const Stack = createStackNavigator<CompleteProfileStackList>();


export const Complete_profile_stack = () => {

  const { profile } = useSelector(profileInfo);

  const initialScreen = useMemo(() => {
    if (!profile?.first_questionary || profile?.first_questionary < 1) {
      return CompleteProfileStack.START;
    } else if (profile?.first_questionary === 8) {
      return CompleteProfileStack.SECOND_QUESTIONARY;
    } else if (profile?.first_questionary && profile?.first_questionary < 8) {
      return CompleteProfileStack.FIRST_QUESTIONARY;
    } else {
      return CompleteProfileStack.START;
    }
  }, [profile]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
         // @ts-ignore
        orientation: 'portrait',
        cardShadowEnabled: true,
        gestureEnabled: true,
        gestureResponseDistance: 160,
        gestureVelocityImpact: 0.6, 
        transitionSpec: { open: SLOW_OPEN, close: SLOW_CLOSE },
        // cardStyleInterpolator: softCardInterpolator,

      }}
      initialRouteName={initialScreen}
    >
      <Stack.Screen name={CompleteProfileStack.START} component={StartScreen} />
      <Stack.Screen name={CompleteProfileStack.FIRST_QUESTIONARY} component={FirstQuestionary} />
      <Stack.Screen name={CompleteProfileStack.FIRST_QUESTIONARY_RESULT} component={FirstQuestionaryResult} />
      <Stack.Screen name={CompleteProfileStack.SECOND_QUESTIONARY} component={SecondaryQuestionary} />
      <Stack.Screen name={CompleteProfileStack.STEP1} component={Step1Screen} />
      <Stack.Screen name={CompleteProfileStack.STEP2} component={Step2Screen} />
      <Stack.Screen name={CompleteProfileStack.STEP3} component={Step3Screen} />
      <Stack.Screen name={CompleteProfileStack.STEP4} component={Step4Screen} />
    </Stack.Navigator>
  );
};
