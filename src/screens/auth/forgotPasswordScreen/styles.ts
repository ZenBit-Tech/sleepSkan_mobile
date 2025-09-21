import { TextStyle, ViewStyle } from 'react-native';

import { colors, spacing } from 'src/theme';

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 50,
  justifyContent: 'space-evenly',
};

export const BUTTON: ViewStyle = {
  width: 170
}

export const BUTTON_CTR: ViewStyle = {
  alignItems: 'center', 
  height: 50
}

export const BACK_CTR: ViewStyle = {
  alignSelf: 'flex-end',
  // marginVertical: spacing[4],
};

export const HEADING_CTR: ViewStyle = {
  marginTop: spacing[2],
  marginBottom: 20,
  alignItems: 'center',
};

export const INPUTS_CTR: ViewStyle = {
  gap: 16,
};

export const CENTER_TEXT: TextStyle = {
  textAlign: 'center'
}
