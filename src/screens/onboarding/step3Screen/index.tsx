import React, { FC } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { MainHeader, Screen } from 'src/components';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import {
  CompleteProfileStack,
  ONBOARDING_STEP_3_IMG,
} from 'src/constants';

import { Steps } from '../components';
import * as S from './styles'


export const Step3Screen: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.STEP3>
> = ({navigation}) => {

  const navToStep3 = () => {
    // amplitude.track(AmplitudeEvents.FINISHED_ONBOARDING_SCREEN_2)
    navigation.navigate(CompleteProfileStack.STEP4);
  };

  return (
    <Screen
          customHeader={ <MainHeader withBack withLogout />}
        >
          <Steps
            image={ONBOARDING_STEP_3_IMG}
            currentStep={3}
            withBubble
            text1="onboarding.step3Title"
            imageStyle={S.IMAGE_STYLE}
            pressNext={navToStep3}
          />
        </Screen>
  );
};
