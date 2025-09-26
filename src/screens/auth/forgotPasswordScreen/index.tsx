import React, { FC, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { t } from 'i18next';

import { Button, Input, MainHeader, Screen, Text } from 'src/components';
import { AuthStack } from 'src/constants';
import { colors } from 'src/theme';
import { Patterns } from 'src/utils';
import { sendResetPasswordEmail } from 'src/services';
import { AuthStackList } from 'src/navigation';

import * as S from './styles';


type Form = {
  email: string
}

export const ForgotPasswordScreen: FC<
  StackScreenProps<AuthStackList, AuthStack.FORGOT_PAS>
> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors , isValid},
  } = useForm<Form>({
    defaultValues: {
      email: '',
    },
  });

  const navToLogin = () => navigation.navigate(AuthStack.LOGIN);

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    try {
      const { email } = data;
      await sendResetPasswordEmail(email);
      Toast.show({
        type: 'success',
        text1: t('newPasswordScreen.checkEmail'),
        text2: t('auth.sendSuccess'),
      });
      navToLogin();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('errors.wrong'),
        text2: t('errors.wrong'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen customHeader={<MainHeader />}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.CONTAINER}>
        <View style={S.HEADING_CTR}>
          <Text
            preset="headerBold"
            color={colors.white}
            style={S.CENTER_TEXT}
            tx="newPasswordScreen.forgotTitle"
          />
        </View>
        <View style={S.CTR}>
          <View style={S.INPUTS_CTR}>
            <Controller
              name={'email'}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('errors.emptyField'),
                },
                pattern: {
                  value: Patterns.email,
                  message: t('errors.validEmail'),
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={`${t('loginScreen.typeEmail')}`}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                  autoCorrect={false}
                  spellCheck={false}
                  keyboardType="email-address"
                />
              )}
            />
            <TouchableOpacity
              style={S.BACK_CTR}
              onPress={navToLogin}
            >
              <Text
                preset="small"
                tx="newPasswordScreen.backToLogin"
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={S.BUTTON_CTR}>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || !isValid}
            style={S.BUTTON}
            preset="transparent"
            pending={isLoading}
            tx="common.send" />
              
          </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};
