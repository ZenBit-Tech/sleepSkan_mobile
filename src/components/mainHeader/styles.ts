import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'src/constants';

import { colors, typography } from 'src/theme';

export const BACK_CTR: ViewStyle = {
  width: 30,
  marginLeft: 18,
  position: 'absolute',
  left: 0,
  top: 30
};

export const LOGOUT_CTR: ViewStyle = {
  width: 30,
  position: 'absolute',
  right: 10,
  top: 30
};

export const CONTAINER: ViewStyle = {
  width: SCREEN_WIDTH,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: SCREEN_HEIGHT > 750 ? 30 : 10
};

export const CONTAINER_WITH_ICON: ViewStyle = {
  justifyContent: 'space-between',
};

export const TEXT: TextStyle = {
  fontFamily: typography.secondary, 
  fontSize: SCREEN_HEIGHT > 750 ? 30 : 25, 
  color: colors.beige
}

export const CENTER_CTR: ViewStyle = {
  alignItems: 'center'
}

export const IMAGE_CTR: ImageStyle = {
  width: SCREEN_WIDTH * 0.5, 
  height: SCREEN_WIDTH * 0.5/3
}
