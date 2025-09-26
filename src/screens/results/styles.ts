
import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from 'src/constants';
import { colors } from 'src/theme';

const CARD_SIDE = (SCREEN_WIDTH - 36 - 18) / 2; 

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 18
}

export const TABS_ROW: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 80,
  marginBottom: 10,
}
  
export const RISK_LEVEL: ViewStyle = {
  height: 9,
  borderRadius: 16,
  overflow: 'hidden',
  alignSelf: 'center',
  backgroundColor: colors.primary03,
}

export const RISK_LEVEL_FILL: ViewStyle = {
  height: '100%',
  borderRadius: 16,
}

export const STAT_CARD: ViewStyle = {
    width: CARD_SIDE,
    height: 128,
    borderRadius: 16,
    padding: 9,
    gap: 7,
    justifyContent: 'center',
}

export const GRID: ViewStyle = {
    marginTop: 26,
    marginBottom: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
}

export const TITLE: TextStyle = {
  marginTop: 10,
  textAlign: 'center'
}

export const CENTER_TEXT: TextStyle = {
  textAlign: 'center'
}