import React, { FC, ReactNode, memo } from 'react'
import { View, ViewStyle } from 'react-native'

import * as S from './styles'

interface IMainLayoutProps {
  children: ReactNode
  style?: ViewStyle | ViewStyle[]
}

const MainLayout: FC<IMainLayoutProps> = ({
  children,
  style = {},
}): JSX.Element => {
  return <View style={[S.CONTAINER, style]}>{children}</View>
}

export default memo(MainLayout)
