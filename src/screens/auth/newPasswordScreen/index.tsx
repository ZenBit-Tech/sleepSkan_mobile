import React, { FC, useCallback, useState } from 'react'
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { useForm, Controller } from 'react-hook-form'
import { CommonActions } from '@react-navigation/native'

import { t } from 'i18next'
import {
  Button,
  InfoModal,
  Input,
  MainLayout,
  Modal,
  SVGIcon,
  Text,
} from 'src/components'
import { AuthStackList } from 'src/navigation'
import { AuthStack, LOGIN_BG } from 'src/constants'
import { colors, spacing } from 'src/theme'
// import { useAppDispatch } from 'src/store'
// import { useHasAccess } from 'src/hooks'

// import { resetPas } from '../reducer/actions'
import * as S from './styles'

type Form = {
  password: ''
  passwordConfirmation: ''
}

export const NewPasswordScreen: FC<
  StackScreenProps<AuthStackList, AuthStack.NEW_PAS>
> = ({ navigation, route }) => {
  const { token } = route.params
  const insets = useSafeAreaInsets()
  // const dispatch = useAppDispatch()
  // const { hasAcess } = useHasAccess()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [isHidePassword, setIsHidePassword] = useState<boolean>(true)
  const [isHidePasswordConfirm, setIsHidePasswordConfirm] =
    useState<boolean>(true)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  })

  const password = watch('password')

  const toggleHidePassword = useCallback(() => {
    return setIsHidePassword((prev) => !prev)
  }, [])

  const toggleHidePasswordConfirm = useCallback(() => {
    return setIsHidePasswordConfirm((prev) => !prev)
  }, [])

  const onSubmit = (data: Form) => {
    // if (hasAcess) {
    //   return dispatch(
    //     resetPas({
    //       password: data.password,
    //       token,
    //       onSuccess: () => setShowModal(true),
    //     }),
    //   )
    // }
  }

  const handleBack = () => navigation.goBack()

  const closeModal = () => {
    setShowModal(false)

    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: AuthStack.LOGIN,
          },
        ],
      }),
    )
  }

  return (
    <ImageBackground
      resizeMode="stretch"
      style={[S.CONTAINER, { paddingTop: insets.top }]}
      source={LOGIN_BG}
    >
      <TouchableOpacity
        style={S.BACK_CTR}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={handleBack}
      >
        <SVGIcon name="chevronLeft" color={colors.white} />
      </TouchableOpacity>
      <View style={S.LAYOUT_CTR}>
        <MainLayout
          style={[S.LAYOUT, { paddingBottom: insets.bottom + spacing[6] }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              preset="largeBold"
              color={colors.white}
              tx="newPasswordScreen.title"
            />
            <View style={S.MAIN}>
              <Text color={colors.white} tx="newPasswordScreen.subTitle" />

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
                    value: 8,
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    secureTextEntry={isHidePassword}
                    label={`${t('common.password')}`}
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                    leftIcon={'lock'}
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
                render={({ field: { onChange, value } }) => (
                  <Input
                    secureTextEntry={isHidePasswordConfirm}
                    label={`${t('common.passwordRep')}`}
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.passwordConfirmation?.message}
                    leftIcon={'lock'}
                    rightIcon={isHidePasswordConfirm ? 'eyeCrossed' : 'eye'}
                    onPressRightIcon={toggleHidePasswordConfirm}
                  />
                )}
              />
              <Button
                onPress={handleSubmit(onSubmit)}
                tx="newPasswordScreen.savePass"
              />
            </View>
          </ScrollView>
        </MainLayout>
      </View>
      <Modal isVisible={showModal}>
        <InfoModal
          onPress={closeModal}
          title="modals.successResetPas.title"
          btnText="modals.successResetPas.btn"
        />
      </Modal>
    </ImageBackground>
  )
}
