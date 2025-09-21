import React, { FC, memo, useState, useEffect } from 'react'
import { TouchableOpacity, View, Animated } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Text } from 'src/components'
import { SCREEN_WIDTH, TABS, TabType } from 'src/constants'
import { colors } from 'src/theme'

import * as S from './styles'

interface ITabsProps {
  activeTypeTab: TabType
  spacing: number
  onChange: (tab: TabType) => void
}

const Tabs: FC<ITabsProps> = ({
  activeTypeTab,
  spacing = 0,
  onChange = () => {},
}): JSX.Element => {
  const [animationValue] = useState(new Animated.Value(0))
  const tabs = Object.keys(TABS)
  const tabWidth = (SCREEN_WIDTH - spacing) / tabs.length

  useEffect(() => {
    Animated.spring(animationValue, {
      toValue: tabs.indexOf(activeTypeTab),
      useNativeDriver: false,
    }).start()
  }, [activeTypeTab, animationValue, tabs])

  const renderTabs = () =>
    tabs.map((tab) => {
      return (
        <TouchableOpacity
          style={[S.TAB_CTR, { width: tabWidth }]}
          key={tab}
          onPress={() => onChange(tab as TabType)}
        >
          <Text
            preset="header5"
            color={colors.white}
            style={[S.TEXT_CENTER]}
            text={tab}
          />
        </TouchableOpacity>
      )
    })

  return (
    <View style={S.CONTAINER}>
      {renderTabs()}
      <Animated.View
        style={[
          S.ACTIVE_CTR,
          {
            width: tabWidth,
            left: 0,
            transform: [
              {
                translateX: animationValue.interpolate({
                  inputRange: [0, tabs.length],
                  outputRange: [0, SCREEN_WIDTH - spacing],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.blueDark, colors.blueLight]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={S.GRADIENT_CTR}
        />
      </Animated.View>
    </View>
  )
}

export default memo(Tabs)
