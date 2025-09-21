import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT } from 'src/constants';
import { colors } from 'src/theme';


export const IMAGE: ImageStyle = {
  width: 150,
  height: 100,
  alignSelf: 'center',
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
  width: 310,
  alignSelf: 'center',
};

export const INSTRUCTIONS_CONTAINER: ViewStyle = {
  alignItems: 'center',
  gap: 18,
  width: 318,
  minHeight: 458,
  borderRadius: 15,
  backgroundColor: colors.primary02,
  paddingHorizontal: 10,
  paddingVertical: 26,
  alignSelf: 'center',
  marginBottom: SCREEN_HEIGHT > 750 ? 0 : 20,
};

export const INSTRUCTIONS_TEXT: TextStyle = {
  lineHeight: 18,
  fontSize: 13,
  textAlign: 'left',
  alignSelf: 'flex-start',
};

export const LIST_STYLE: ViewStyle = {
  paddingHorizontal: 12, 
  gap: 10
}
