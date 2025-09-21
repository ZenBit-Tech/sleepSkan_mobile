import { TextStyle, ViewStyle } from 'react-native';

import { spacing, typography } from 'src/theme';

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 50,
  justifyContent: 'space-evenly',
  paddingBottom: 30
};

export const LAYOUT_CTR: ViewStyle = {
  justifyContent: 'flex-end',
  flex: 1,
};

export const LAYOUT: ViewStyle = {
  height: '90%',
  paddingTop: spacing[6],
};

// export const SCROLL: ViewStyle = {
//   paddingHorizontal: spacing[5],
// };

export const SUB_TITLE_CTR: ViewStyle = {
  marginTop: spacing[2],
  marginBottom: 20,
};

export const INPUTS_CTR: ViewStyle = {
  gap: 16,
};

export const CREATE_ACC_CTR: ViewStyle = {
  marginTop: 10,
  alignSelf: 'flex-end',
};

export const CHECKBOX_CTR: ViewStyle = {
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  alignContent: 'center',
  marginVertical: 25,
};

export const CHECKBOX_TEXT_CTR: TextStyle = {
  // width: '95%',
  alignSelf: 'flex-start',
};

export const CHECKBOX_TEXT_2_CTR: TextStyle = {
  // width: '95%',
  alignSelf: 'flex-start',
  textDecorationLine: 'underline',
  fontFamily: typography.link
};

export const TEXT_CENTER_CTR: ViewStyle = {
  alignSelf: 'center',
  marginTop: 20,
  marginBottom: spacing[6],
};

export const TERMS_OF_USE_CTR: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const SKIP_WRAP: ViewStyle = {
  flex: 1,
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  paddingRight: spacing[5],
  paddingBottom: spacing[4],
};

export const LINK_TEXT: TextStyle = {
  textDecorationLine: 'underline'
 }

 export const NAV_TEXT: TextStyle = {
  textAlign: 'center', 
  marginTop: 19
}

export const TOP_TEXT_CTR: ViewStyle = {
  gap: 11, 
  alignItems: 'center'
}

export const CENTER_CTR: TextStyle = {
  alignItems: 'center'
}

export const BTN_CTR: ViewStyle = {
  height: 50,
  width: 170
}