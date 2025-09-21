import React from 'react'
import { Pressable, View } from 'react-native'
import {
  ToastProps,
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message'

import { Text } from '../text'
import * as S from './styles'
import { colors } from 'src/theme'

type NotificationToastProps = {
  text1: string
  text2: string
  props: ToastProps
}

export const toastConfig: ToastConfig = {
  success: ({
    text1,
    onPress = () => {},
  }: ToastConfigParams<NotificationToastProps>) => (
    <Pressable style={S.CONTAINER} onPress={onPress}>
      <View style={S.MAIN}>
        <Text preset="header4bold" text={text1} color={colors.primary} />
      </View>
    </Pressable>
  ),
  error: ({
    text1,
    onPress = () => {},
  }: ToastConfigParams<NotificationToastProps>) => (
    <Pressable style={[S.CONTAINER, S.CTR_ERROR]} onPress={onPress}>
      <View style={S.MAIN}>
        <Text preset="header4bold" text={text1} color={colors.primary} />
      </View>
    </Pressable>
  ),
}
