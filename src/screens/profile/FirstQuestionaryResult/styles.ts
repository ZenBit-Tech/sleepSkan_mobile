import { ImageStyle, TextStyle, ViewStyle } from 'react-native';


export const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  alignItems: 'center',
  paddingHorizontal: 36,
};

export const IMAGE: ImageStyle = {
  width: 174,
  height: 230,
  alignSelf: 'center',
};

export const MAIN: ViewStyle = {
  // flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
  width: 320,
};

export const BTNS_CTR: ViewStyle = {
  height: 50,
  gap: 15,
  width: 170,
  alignSelf: 'center',
};
