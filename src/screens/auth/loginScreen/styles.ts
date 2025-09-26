import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT } from 'src/constants';

import { spacing } from 'src/theme';

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 50,
  justifyContent: 'space-evenly',
};

export const IMAGE_CTR: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: spacing[6],
};

export const IMAGE: ImageStyle = {
  width: 80,
  height: 52,
  marginBottom: 60,
  alignSelf: 'center',
};

export const LAYOUT_CTR: ViewStyle = {
  justifyContent: 'flex-end',
};

export const LAYOUT: ViewStyle = {
  height: '90%',
  paddingTop: spacing[6],
  paddingHorizontal: spacing[5],
};

export const HEADING_CTR: ViewStyle = {
  alignItems: 'center',
};

export const CTR: ViewStyle = {
  height: SCREEN_HEIGHT > 750 ? 323 : 273,
}

export const INPUTS_CTR: ViewStyle = {
  gap: 16,
  height: 273,
  justifyContent: 'center',
};

export const FORGOT_PASS_CTR: ViewStyle = {
  alignSelf: 'flex-end',
};

export const CREATE_ACC_CTR: ViewStyle = {
  alignItems: 'flex-end',
  marginTop: 10,
  alignSelf: 'flex-end',
};

export const TERMS_OF_USE_CTR: ViewStyle = {
  flex: 1,
  marginTop: spacing[5],
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
};

export const BUTTON: ViewStyle = {
  width: 170
}

export const BUTTON_CTR: ViewStyle = {
  alignItems: 'center', 
  height: 50
}

export const LINK_TEXT: TextStyle = {
 textDecorationLine: 'underline'
}

export const NAV_TEXT: TextStyle = {
  textAlign: 'center', 
  marginTop: 19
}