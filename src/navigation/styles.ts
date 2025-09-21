import { ViewStyle } from 'react-native';
import { BOTTOM_TAB_HEIGHT } from 'src/constants';
import { colors } from 'src/theme';

export const BOTTOM_BAR: ViewStyle = {
  height: BOTTOM_TAB_HEIGHT,
  backgroundColor: colors.greyDark,
  borderTopWidth: 0,
  elevation: 0,
  shadowOpacity: 0,
  shadowRadius: 0,
  position: 'absolute',
};

export const TAB_BAR_CTR: ViewStyle = {
  flex: 1,
  height: 50,
};

export const CONTAINER: ViewStyle = {
  justifyContent: 'center', 
  height: '100%'
}
