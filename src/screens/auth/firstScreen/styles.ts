import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'src/constants';

import { spacing, typography } from 'src/theme';

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 50,
  justifyContent: 'space-around',
  // borderColor: 'green',
  // borderWidth: 1
};

export const BUTTON: ViewStyle = {
  width: 170,
}

export const BUTTON_CTR: ViewStyle = {
  alignItems: 'center', 
  height: 120,
  gap: 15
}

// export const BACK_CTR: ViewStyle = {
//   alignSelf: 'flex-end',
// };

export const HEADING_CTR: ViewStyle = {
  marginTop: spacing[2],
  marginBottom: 20,
  alignItems: 'center',
};

export const INPUTS_CTR: ViewStyle = {
  gap: 32,
};

export const TOP_CTR: ViewStyle = {
  alignItems: 'center', 
  justifyContent: 'center', 
  alignSelf: 'center',
  marginTop: SCREEN_HEIGHT/5,
  // height: SCREEN_HEIGHT - 450,
  // borderColor: 'green',
  // borderWidth: 1
}

export const LOGO_TEXT: TextStyle = {
  fontFamily: typography.secondary
}

export const IMAGE: ImageStyle = {
  width: SCREEN_WIDTH - 150, 
  height: (SCREEN_WIDTH - 150) * 0.45
}