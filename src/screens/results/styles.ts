
import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from 'src/constants';
import { colors } from 'src/theme';

const CARD_SIDE = (SCREEN_WIDTH - 36 - 18) / 2; 

export const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: 18
}

export const TAB: TextStyle = {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
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

export const DESCR_CTR: ViewStyle = {
  marginTop: 12, 
  paddingHorizontal: 18
}

export const CHART_CTR: ViewStyle = {
  // flex: 1, 
  backgroundColor: colors.greyLight, 
  marginTop: 10, 
  borderTopLeftRadius: 16, 
  borderBottomLeftRadius: 16, 
  marginRight: -15,
  height: 376, 
  justifyContent: 'center',
  marginBottom: 45
}

export const CHART_TITLE: TextStyle = {
  textAlign: 'center', 
  marginVertical: 11
}

export const MODAL_WRAPPER: ViewStyle = {
  paddingHorizontal: 41,
  borderRadius: 16,
  maxHeight: '90%',
  paddingVertical: 32
}

export const TEST_BTN: ViewStyle = {
  borderWidth: 1, 
  paddingHorizontal: 10, 
  paddingVertical: 3, 
  borderRadius: 10,
  borderColor: colors.blue
}

export const TEST_CTR: ViewStyle = {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  marginTop: 20
}