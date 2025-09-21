import React, { FC } from 'react'
import { View } from 'react-native'

import { colors } from 'src/theme'
import { TxKeyPath } from 'src/i18n'

import { SVGIcon } from '../svg-icon'
import { IconTypes } from '../svg-icon/icons'
import { Text } from '../text'
import * as S from './styles'

interface ITabBarBtnProps {
  isSelected: boolean
  icon: IconTypes
  label: TxKeyPath
}

export const TabBarBtn: FC<ITabBarBtnProps> = ({
  isSelected,
  icon,
  label,
}): JSX.Element => {
  const color = isSelected ? colors.primary : colors.greyLight
  const fillColor = isSelected ? colors.primary : colors.greyLight

  return (
    <View style={S.TAB_BAR_CTR}>
      <View style={[S.ICON_CTR, isSelected && S.ACTIVE_TAB_BAR_CTR]}>
        <SVGIcon size={24} name={icon} fill={fillColor} color={color} />
      </View>
      <View style={[S.TEXT_CTR]}>
        <Text
          preset="smallest"
          style={S.TEXT}
          tx={label}
          color={colors.greyLight}
          numberOfLines={1}
        />
      </View>
    </View>
  )
}
