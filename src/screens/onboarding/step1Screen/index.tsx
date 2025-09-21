import React, { FC } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { MainHeader, Screen } from 'src/components';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import {
  CompleteProfileStack,
  ONBOARDING_STEP_1_IMG,
} from 'src/constants';

import { Steps } from '../components';
import * as S from './styles'


export const Step1Screen: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.STEP1>
> = ({ navigation }) => {

  const navToStep2 = () => {
    navigation.navigate(CompleteProfileStack.STEP2);
  };

  return (
    <Screen
      customHeader={ <MainHeader withBack withLogout />}
    >
      <Steps
        image={ONBOARDING_STEP_1_IMG}
        currentStep={1}
        text1="onboarding.step1Title"
        text2="onboarding.step1SubTitle"
        percents="79%"
        postText1="onboarding.preText1"
        imageStyle={S.IMAGE_STYLE}
        pressNext={navToStep2}
      />
    </Screen>
  );
};
