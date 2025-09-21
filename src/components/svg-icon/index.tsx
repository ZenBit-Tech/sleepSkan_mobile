import * as React from 'react';
import { ImageStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { colors } from 'src/theme';

import { icons, IconTypes } from './icons';

export interface IconProps extends SvgProps {
  size?: number
  width?: number
  height?: number
  color?: string
  fill?: string
  name: IconTypes
  style?: ImageStyle
}

export function SVGIcon({
  name,
  size = 24,
  width,
  height,
  color = colors.white,
  fill = colors.white,
  ...props
}: IconProps): React.JSX.Element {
  const Icon = icons[name] || icons.user;

  return (
    <Icon
      width={width || size}
      height={height || size}
      color={color}
      fill={fill}
      {...props}
    />
  );
}
