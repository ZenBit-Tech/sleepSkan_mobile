import * as React from 'react'
import { Text as ReactNativeText } from 'react-native'
import { useTranslation } from 'react-i18next'

import { presets } from './presets'
import { TextProps } from './props'

export function Text(props: TextProps) {
  const {
    preset = 'default',
    tx,
    color,
    text,
    children,
    style: styleOverride,
    ...rest
  } = props
  const { t } = useTranslation()

  const i18nText = tx && t(tx)
  const content = i18nText || text || children

  const style = presets[preset] || presets.default
  const styles = [style, styleOverride, color ? { color: color } : null]

  return (
    <ReactNativeText allowFontScaling={false} {...rest} style={styles} testID="test_text">
      {content}
    </ReactNativeText>
  )
}
