import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from 'src/constants';


export const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  alignItems: 'center',
  paddingHorizontal: 36,
};


export const MAIN: ViewStyle = {
  // flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
  width: SCREEN_WIDTH - 80,
};

export const BTNS_CTR: ViewStyle = {
  height: 50,
  gap: 15,
  width: 170,
  alignSelf: 'center',
};

export const CTR_HEIGHT: ViewStyle = {
  height: 300
}