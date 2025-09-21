import React, { JSX } from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import { colors } from '../../theme';

interface ILoaderProps extends ActivityIndicatorProps {
  color?: string
}

export const Loader = ({
  color = colors.blueLight,
  ...rest
}: ILoaderProps): JSX.Element => {
  return <ActivityIndicator size="large" color={color} {...rest} />;
};
