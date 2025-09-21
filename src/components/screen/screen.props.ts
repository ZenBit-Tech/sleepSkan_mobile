import React from 'react'
import { RefreshControlProps, StyleProp, ViewStyle } from 'react-native'

import { KeyboardOffsets, ScreenPresets } from './screen.presets'

export interface ScreenProps {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  styleOuter?: StyleProp<ViewStyle>

  /**
   * One of the different types of presets.
   */
  preset?: ScreenPresets

  /**
   * An optional background color
   */

  bgColorSafeArea?: string

  bgImage?: string
  small?: boolean
  withBottomInsets?: boolean
  withoutTopInsets?: boolean
  withBottomNavSpacing?: boolean
  withText?: boolean
  withCloud?: boolean
  /**
   * An optional status bar setting. Defaults to light-content.
   */
  statusBar?: 'light-content' | 'dark-content'

  /**
   * Should we not wrap in SafeAreaView? Defaults to false.
   */
  unsafe?: boolean

  /**
   * By how much should we offset the keyboard? Defaults to none.
   */
  keyboardOffset?: KeyboardOffsets

  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never'

  customHeader?: React.ReactNode

  refreshControl?: React.ReactElement<RefreshControlProps>
}
