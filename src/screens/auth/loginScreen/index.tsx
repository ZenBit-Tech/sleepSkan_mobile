import React, { FC, useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';

import { t } from 'i18next';
import { Button, Input, Screen, Text } from 'src/components';
import { AuthStack } from 'src/constants';
import { colors } from 'src/theme';
import { Patterns } from 'src/utils';
// import { useAppDispatch } from 'src/store'
// import { useHasAccess } from 'src/hooks'

import * as S from './styles';
// import { login } from '../reducer/actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmail } from 'src/services';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from 'src/store';
import { setUid } from '../reducer';
import { AuthStackList } from 'src/navigation';
import MainHeader from 'src/components/mainHeader';

type Form = {
  email: string
  password: string
}
export const LoginScreen: FC<
  StackScreenProps<AuthStackList, AuthStack.LOGIN>
> = ({ navigation }) => {

  const dispatch = useAppDispatch();

  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Form>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toggleHidePassword = useCallback(() => {
    return setIsHidePassword((prev) => !prev);
  }, []);

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const res = await signInWithEmail(email, password);
      res.user.uid && dispatch(setUid(res.user.uid));
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('errors.loginFailed'),
        text2: t(
          error instanceof Error ? error.message : 'errors.wrong',
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navToSignUp = () => navigation.navigate(AuthStack.SIGN_UP);

  const navToForgotPas = () => navigation.navigate(AuthStack.FORGOT_PAS);

  return (
    <Screen customHeader={<MainHeader />}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.CONTAINER}>
          <View style={S.HEADING_CTR}>
            <View style={{gap: 11, alignItems: 'center'}}>
              {/* <Text text={t('loginScreen.subTitle')} preset="header" /> */}
              <Text text={t('loginScreen.title')} preset="headerBold" />
            </View>
          </View>
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
                  value={value}
                  onChangeText={onChange}
                  placeholder={`${t('loginScreen.typeEmail')}`}
                  errorMessage={errors.email?.message}
                  textContentType="oneTimeCode"
                  autoCorrect={false}
                  spellCheck={false}
                  keyboardType="email-address"
                />
              )}
            />
            <Controller
              name={'password'}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('errors.emptyField'),
                },
                minLength: {
                  message: t('errors.validPassword'),
                  value: 5,
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  secureTextEntry={isHidePassword}
                  placeholder={`${t('loginScreen.typePassword')}`}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  rightIcon={isHidePassword ? 'eyeCrossed' : 'eye'}
                  onPressRightIcon={toggleHidePassword}
                />
              )}
            />
            <TouchableOpacity
              style={S.FORGOT_PASS_CTR}
              onPress={navToForgotPas}
            >
            <Text
              preset="small"
              tx="loginScreen.forgotPass"
              color={colors.white}
            />
          </TouchableOpacity>


          </View>
          <View>
          <View style={S.BUTTON_CTR}>
            <Button
              onPress={handleSubmit(onSubmit)}
              preset="transparent"
              tx="common.signIn"
              style={S.BUTTON}
              disabled={isLoading || !isValid}
              pending={isLoading}
            />

          </View>
          <Text style={S.NAV_TEXT}>
              <Text preset='small' tx='loginScreen.dontHaveAcc'/>
              <Text
                preset='small' 
                text={`${t('loginScreen.createNewAcc')} `}
                style={S.LINK_TEXT}
                onPress={navToSignUp}
              />
            </Text>
            </View>
          {/* <View style={S.CREATE_ACC_CTR}>
            
          </View> */}
        </KeyboardAwareScrollView>
      </Screen>
  );
};
