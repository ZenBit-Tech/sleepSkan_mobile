import React, { memo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Loader, SVGIcon, Text } from 'src/components';
import { colors, spacing } from '../../theme';

import { viewPresets, textPresets, bgPresets } from './presets';
import { ButtonProps } from './props';

export const WRAP: ViewStyle = {
  flex: 1,
  margin: 1.5,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing[3],
  paddingHorizontal: 20,
};

const Button = ({
  preset = 'primary',
  tx,
  text,
  color,
  style: styleOverride,
  textStyle: textStyleOverride,
  children,
  disabled = false,
  pending = false,
  withIcon = false,
  ...rest
}: ButtonProps) => {
  const viewStyle = viewPresets[preset] || viewPresets.primary;
  const viewStyles = [viewStyle, styleOverride];
  const textStyle = textPresets[preset] || textPresets.primary;
  const textStyles = [textStyle, textStyleOverride];

  const content = children || (
    <Text tx={tx} text={text} style={[textStyles]} color={color} />
  );

  return (
      <TouchableOpacity
        style={[
          WRAP,
          viewStyles, disabled && { opacity: 0.5 },
          { backgroundColor: bgPresets[preset], opacity: disabled ? 0.5 : 1 },
        ]}
        {...rest}
        disabled={disabled}
      >
        {withIcon && <SVGIcon name="check" size={24} color={colors.white} style={{marginRight: 10}} />}
        {pending ? <View><Loader /></View> : content}
      </TouchableOpacity>
  );
};

export default memo(Button);
