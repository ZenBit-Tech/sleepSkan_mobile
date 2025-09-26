import {TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT } from 'src/constants';

import { colors, spacing } from 'src/theme';

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 50,
  justifyContent: 'space-evenly',
};

export const BUTTON: ViewStyle = {
  width: 170,
}

export const BUTTON_CTR: ViewStyle = {
  alignItems: 'center', 
  height: 87,
  paddingBottom: 37
}

export const BACK_CTR: ViewStyle = {
  alignSelf: 'flex-end',
};

export const HEADING_CTR: ViewStyle = {
  alignItems: 'center',
};

export const INPUTS_CTR: ViewStyle = {
  gap: 16,
  height: 273,
  justifyContent: 'center',
};

export const CENTER_TEXT: TextStyle = {
  textAlign: 'center'
}

export const CTR: ViewStyle = {
  height: SCREEN_HEIGHT > 750 ? 323 : 273,
}