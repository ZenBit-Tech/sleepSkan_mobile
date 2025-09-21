import { ImageStyle, TextStyle, ViewStyle } from 'react-native';


export const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 36,
  paddingBottom: 80
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
  marginBottom: 39
};

export const BTNS_CTR: ViewStyle = {
  height: 115, 
  gap: 15, 
  width: 170, 
  alignSelf: 'center',
  marginTop: 14
}

export const PROGRESS_WRAP: ViewStyle = {
  width: 120,
};

export const TEXT_CTR: ViewStyle = {
  width: 274, 
  alignSelf: 'center'
}