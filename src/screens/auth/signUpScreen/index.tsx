import React, { FC, useCallback, useEffect, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { t } from 'i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button, Input,  Text, Checkbox, Screen, MainHeader } from 'src/components';
import {
  AuthStack,
  TAC_LINK,
} from 'src/constants';
import { colors } from 'src/theme';
import { Patterns} from 'src/utils';
import { AuthStackList } from 'src/navigation';
import { useAppDispatch } from 'src/store';
import { registerWithEmail } from 'src/services';

import * as S from './styles';
import { setUid } from '../reducer';
import { setEmailAndFullName } from 'src/screens/profile/reducer';



type Form = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  isConfirmTerms: boolean
}

export const SignUpScreen: FC<
  StackScreenProps<AuthStackList, AuthStack.SIGN_UP>
> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
  const [isHidePasswordConfirm, setIsHidePasswordConfirm] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitted, touchedFields },
  } = useForm<Form>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      isConfirmTerms: false,
    },
  });

    const showErr = (name: keyof Form) =>
      !!errors[name] && (touchedFields[name]);
    

  const password = watch('password');
  const confirm = watch('isConfirmTerms');

  useEffect(() => {
    // Only re-validate confirmation after the user has touched it (prevents early messages)
    if (touchedFields.passwordConfirmation) {
      void trigger('passwordConfirmation');
    }
    trigger()
  }, [password, touchedFields.passwordConfirmation, trigger]);
  

  const toggleHidePassword = useCallback(() => {
    return setIsHidePassword((prev) => !prev);
  }, []);

  const toggleHidePasswordConfirm = useCallback(() => {
    return setIsHidePasswordConfirm((prev) => !prev);
  }, []);

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    try {
      const { email, password, name } = data;
      const res = await registerWithEmail(email, password, name);
      res.user.uid && dispatch(setUid(res.user.uid));
      res.user.uid && dispatch(setEmailAndFullName({name, email}));

    } catch (error) {
      console.log(error);
      
      Toast.show({
        type: 'error',
        //@ts-ignore
        text1: t(error?.message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navToLogin = () => navigation.navigate(AuthStack.LOGIN);

  const openTermsLink = () => {
    Linking.openURL(TAC_LINK); 
  };

  return (
    <Screen customHeader={<MainHeader />} preset='scroll'>
      <KeyboardAwareScrollView indicatorStyle="white" contentContainerStyle={S.CONTAINER}>
        <View style={S.TOP_TEXT_CTR}>
          {/* <Text text={t('loginScreen.subTitle')} preset="header" /> */}
          <Text text={t('loginScreen.createNewAcc')} preset="headerBold" />
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
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    placeholder={`${t('loginScreen.typeEmail')}`}
                    value={value}
                    onBlur={onBlur}  
                    // leftIcon={'message'}
                    onChangeText={onChange}
                    errorMessage={showErr('email') ? errors.email?.message : undefined}
                    textContentType="oneTimeCode"
                    autoCorrect={false}
                    spellCheck={false}
                    keyboardType="email-address"
                  />
                )}
              />
              <Controller
                name={'name'}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t('errors.emptyField'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    placeholder={`${t('registerScreen.name')}`}
                    value={value}
                    onBlur={onBlur}  
                    onChangeText={onChange}
                    // leftIcon={'user'}
                    errorMessage={showErr('name') ? errors.name?.message : undefined}
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
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    secureTextEntry={isHidePassword}
                    placeholder={`${t('registerScreen.password')}`}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}  
                    errorMessage={showErr('password') ? errors.password?.message : undefined}
                    rightIcon={isHidePassword ? 'eyeCrossed' : 'eye'}
                    onPressRightIcon={toggleHidePassword}
                  />
                )}
              />
              <Controller
                name={'passwordConfirmation'}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t('errors.emptyField'),
                  },
                  validate: (v) =>
                    v === password || `${t('errors.passwordsDoNotMatch')}`,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input
                    secureTextEntry={isHidePasswordConfirm}
                    placeholder={`${t('registerScreen.reenterPassword')}`}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}  
                    errorMessage={showErr('passwordConfirmation') ? errors.passwordConfirmation?.message : undefined}
                    rightIcon={isHidePasswordConfirm ? 'eyeCrossed' : 'eye'}
                    onPressRightIcon={toggleHidePasswordConfirm}
                  />
                )}
              />
              <Controller
                name={'isConfirmTerms'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={S.CHECKBOX_CTR}>
                    <Checkbox value={value} onChange={() => onChange(!value)} />
                    <TouchableOpacity onPress={openTermsLink} style={{flexDirection: 'row'}}>
                      <Text
                        preset='small'
                        tx="registerScreen.confirmTerms"
                        style={S.CHECKBOX_TEXT_CTR}
                      />
                      
                      <Text
                        preset="smallBold"
                        tx="registerScreen.confirmTerms2"
                        style={S.CHECKBOX_TEXT_2_CTR}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
          </View>
        </View>
          <View>
            <View style={S.BTN_CTR}>
              <Button
                onPress={handleSubmit(onSubmit)}
                preset="transparent"
                tx="common.signUp"
                style={S.BUTTON}
                disabled={isLoading || !isValid || !confirm}
                pending={isLoading}
              />
            </View>
            <Text style={S.NAV_TEXT}>
              <Text preset='small' tx='registerScreen.alreadyHave' />
              <Text
                preset='small' 
                style={S.LINK_TEXT}
                text={`${t('loginScreen.title')} `}
                onPress={navToLogin}
              />
            </Text>
          </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

