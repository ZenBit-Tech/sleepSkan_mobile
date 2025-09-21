import React, { FC, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';
import {  useSelector } from 'react-redux';

import { Button, Screen, Text } from 'src/components';
import {
  CompleteProfileStack,
} from 'src/constants';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import MainHeader from 'src/components/mainHeader';
import { IProfile } from 'src/models';
import { getUser, updateUser } from 'src/db';
import { useAppDispatch } from 'src/store';
import { auth, profileInfo } from 'src/store/selectors';
import { getScore } from 'src/utils';

import * as S from './styles';
import { setProfile } from '../reducer';

export const FirstQuestionaryResult: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.FIRST_QUESTIONARY_RESULT>
> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profile } = useSelector(profileInfo);
  const {uid} = useSelector(auth);

useEffect(() => {
  getUser(uid as string);
}, [uid]);

const handleNext = async () => {
  if (profile) {
    const {BMI, score} = getScore(profile);

    await updateUser(uid as string, {
      BMI: BMI,
      score: score,
    });
    dispatch(setProfile({
      ...profile, 
      score,
      BMI
    }));
  }
  navigation.navigate(CompleteProfileStack.SECOND_QUESTIONARY, {
    beginning: true,
  });
};

const handleBack = () => {
  navigation.navigate(CompleteProfileStack.FIRST_QUESTIONARY, {
    beginning: false,
  })
}

  return (
    <Screen
      withText
      customHeader={<MainHeader withBack handleGoBack={handleBack}/>}
     >
      <View style={S.CONTAINER}>
        <Text preset="middleBold" style={S.TEXT_CENTER} tx="profile.firstQuestionaryResult" />
        <View style={S.BTNS_CTR}>
          <Button onPress={handleNext} preset="transparent" tx="common.next" />
        </View>
      </View>
     </Screen>
  );
};
