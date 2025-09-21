import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { colors, typography } from 'src/theme';


export const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: 36,
};

export const IMAGE: ImageStyle = {
  alignSelf: 'center',
};

export const MAIN: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
};

export const PROGRESS_WRAP: ViewStyle = {
  width: 120,
};

export const BUTTON_CTR: ViewStyle = {
  height: 50,
  width: 170,
  alignSelf: 'center',
};

export const PRE_TEXT: TextStyle = {
  fontSize: 20, 
  color: colors.white, 
  fontFamily: typography.primaryBold
};
