import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_HEIGHT } from 'src/constants';


export const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: 36,
  paddingVertical: SCREEN_HEIGHT > 750 ? 0 : 30
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
};

export const BTNS_CTR: ViewStyle = {
  height: 50,
  gap: 15,
  width: 170,
  alignSelf: 'center',
};

export const PROGRESS_WRAP: ViewStyle = {
  width: 120,
};

export const CTR_HEIGHT: ViewStyle = {
  height: 280,
  justifyContent: 'flex-end'
}