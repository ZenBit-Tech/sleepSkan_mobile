import { ViewStyle } from 'react-native';
import { colors } from 'src/theme';

export const CONTAINER: ViewStyle = {
  width: 20,
  height: 20,
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  borderBlockColor: colors.dark,
  borderWidth: 1,
  backgroundColor: colors.white
};
