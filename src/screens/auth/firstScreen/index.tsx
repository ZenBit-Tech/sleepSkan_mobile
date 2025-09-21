import React, { FC } from 'react';
import { Image, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Screen, Text } from 'src/components';
import { AuthStack, LOGO_IMG } from 'src/constants';
import { AuthStackList } from 'src/navigation';

import * as S from './styles';



export const FirstScreen: FC<
  StackScreenProps<AuthStackList, AuthStack.FIRST>
> = ({ navigation }) => {

  const navToLogin = () => navigation.navigate(AuthStack.LOGIN);
  const navToRegister = () => navigation.navigate(AuthStack.SIGN_UP);
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[S.CONTAINER, {marginBottom: insets.bottom}]}>
          <View style={S.TOP_CTR}>
            <Image
              style={S.IMAGE}
              resizeMode="contain"
              source={LOGO_IMG}
            />
          </View>
        {/* </View> */}
        <View style={S.BUTTON_CTR}>
          <Button
            onPress={navToRegister}
            style={S.BUTTON}
            preset="transparent"
            tx="common.register" />
          <Button
            onPress={navToLogin}
            style={S.BUTTON}
            preset="primary"
            tx="common.login" />
        </View>
      </View>
    </Screen>
  );
};
