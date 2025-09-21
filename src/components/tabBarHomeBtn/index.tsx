import React, { FC } from 'react'
import { GestureResponderEvent, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { colors } from 'src/theme'

import { SVGIcon } from '../svg-icon'
import * as S from './styles'

interface ITabBarHomeBtnProps {
  onPress: (
    event:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | GestureResponderEvent,
  ) => void
}

export const TabBarHomeBtn: FC<ITabBarHomeBtnProps> = ({
  onPress = () => {},
}): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPress} style={S.CIRCLE_CTR}>
      <LinearGradient
        colors={['#0E6685', '#35ADDA']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={S.GRADIENT_CTR}
      >
        <SVGIcon size={32} name={'sofa'} color={colors.white} />
      </LinearGradient>
    </TouchableOpacity>
  )
}
