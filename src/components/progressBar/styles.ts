import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT } from 'src/constants';

import { colors } from 'src/theme';


export const MAIN_CONTAINER: ViewStyle = {
  marginTop: SCREEN_HEIGHT > 750 ? 50 : 30,
  marginHorizontal: 36
};

export const CONTAINER: ViewStyle = {
  width: '100%',
  height: 8,
  backgroundColor: colors.greyDark,
  borderRadius: 10,
};

export const PROGRESS: ViewStyle = {
  width: '100%',
  height: 8,
  backgroundColor: colors.primary,
  borderRadius: 10,
};

export const PROGRESS_TEXT: TextStyle = {
  textAlign: 'right',
  marginTop: 6
};
