import React, { FC, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';

import { Button, MainHeader, Screen, Text } from 'src/components';
import {
  CompleteProfileStack,
} from 'src/constants';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';

import * as S from './styles';
import { useSelector } from 'react-redux';
import { auth, profileInfo } from 'src/store/selectors';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'src/store';
import { getUserInfo } from 'src/services/user';

export const StartScreen: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.START>
> = ({ navigation }) => {

  const {t} = useTranslation();
  const {profile} = useSelector(profileInfo);
  const dispatch = useAppDispatch()
  const authInfo = useSelector(auth);

  const onboardingNav = () => navigation.navigate<any>(CompleteProfileStack.STEP1);
  const startTest = () => navigation.navigate<any>(CompleteProfileStack.FIRST_QUESTIONARY, {
    beginning: true,
  });

    useEffect(() => {
      authInfo.uid && getUserInfo(authInfo.uid)
    }, [authInfo])

  return (
    <Screen
       customHeader={ <MainHeader withLogout />}
     >
      <View style={S.CONTAINER}>
        <Text preset="middleBold" text={t('profile.startTitle', {name: profile?.name})} style={S.TEXT_CENTER}/>
        <View style={S.TEXT_CTR}>
          <Text preset="header4" tx="profile.startText" style={S.TEXT_CENTER} />
        </View>

        <View style={S.BTNS_CTR}>
          <Button onPress={startTest} preset="transparent" tx="profile.testBtn"/>
          <Button onPress={onboardingNav} tx="profile.moreInfoBtn" />
        </View>
      </View>
     </Screen>
  );
};
