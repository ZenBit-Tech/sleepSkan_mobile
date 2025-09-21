import {  ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { colors } from 'src/theme';

export const BLOCK: ViewStyle = {
  width: 120,
  height: 80,
  borderRadius: 7,
  backgroundColor: colors.secondary,
  alignItems: 'center',
  justifyContent: 'center',
};

export const LIST_CTR: ViewStyle = {
  alignItems: 'center',
  gap: 15,
};

export const GAP: ViewStyle = {
  gap: 15,
};

export const IMAGE_STYLE: ImageStyle = {
  width: 231,
  height: 246,
};

export const CENTER_TEXT: TextStyle = {
  textAlign: 'center',
};

export const IMAGE: ImageStyle = {
  width: 25, 
  height: 25, 
  marginBottom: 10
}