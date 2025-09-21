import React, { FC, JSX } from 'react'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import RNModal, { ModalProps as RNModalProps } from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from '@react-native-community/blur'
import Toast from 'react-native-toast-message'
import LinearGradient from 'react-native-linear-gradient';

import * as S from './styles'
import { toastConfig } from '../toastConfig'
import { colors } from 'src/theme'

type ModalProps = {
  children: React.ReactNode
  style?: ViewStyle
  onClose: () => void
} & Partial<RNModalProps>

export const Modal: FC<ModalProps> = ({
  children,
  style = {},
  onClose,
  ...rest
}): JSX.Element => {
  const insets = useSafeAreaInsets()
  const containerStyles = [S.MODAL, style]

  return (
    <RNModal
      style={containerStyles}
      animationIn="fadeIn"
      animationOut="fadeOut"  
      backdropColor={colors.darkGrey}
      backdropOpacity={0.1} 
      backdropTransitionOutTiming={0}
      onBackdropPress={onClose}
      testID="test_modal"
      {...rest}
    >
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
        <BlurView
          style={S.BLUR_CTR}
          blurType="dark"
          blurAmount={4}
          reducedTransparencyFallbackColor="wight"
          // pointerEvents="none"             
        />
      </Pressable>
      <Toast topOffset={insets.top + 14} config={toastConfig} />
      <LinearGradient
        colors={['rgba(52,108,148,0.6)', 'rgba(16,33,46,0.6)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}  
        style={{ paddingTop: insets.top, borderRadius: 16 }}
      >{children}</LinearGradient>
    </RNModal>
  )
}
