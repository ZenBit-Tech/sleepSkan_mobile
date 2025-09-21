import React, { FC } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { MainHeader, Screen } from 'src/components';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import {
  CompleteProfileStack,
  ONBOARDING_STEP_2_IMG,
} from 'src/constants';

import { Steps } from '../components';
import * as S from './styles'


export const Step2Screen: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.STEP2>
> = ({ navigation }) => {
  const navToStep3 = () => {
    // amplitude.track(AmplitudeEvents.FINISHED_ONBOARDING_SCREEN_2)
    navigation.navigate(CompleteProfileStack.STEP3);
  };

  return (
    <Screen
      customHeader={ <MainHeader withBack withLogout />}
    >
      <Steps
        image={ONBOARDING_STEP_2_IMG}
        currentStep={2}
        text1="onboarding.step2Title"
        text2="onboarding.step2SubTitle"
        percents="95%"
        preText1="onboarding.first"
        imageStyle={S.IMAGE_STYLE}
        pressNext={navToStep3}
      />
    </Screen>
  );
};
