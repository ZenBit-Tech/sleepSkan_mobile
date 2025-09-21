
import { TextStyle, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from 'src/constants';
import { colors, typography } from 'src/theme';

const CIRCLE_SIZE = 304;

  export const CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 40,
  }
  export const TITLE: TextStyle = {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  }
  export const CIRCLE: ViewStyle = {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 12,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 37
  }
  export const GOODNIGHT: TextStyle = {
    fontSize: 64,
    lineHeight: 70,
    textAlign: 'center',
    fontFamily: typography.primaryBold,
    color: 'white',
    fontWeight: '600',
  }

  export const TIMER: TextStyle = {
    fontSize: 50,
    lineHeight: 56,
    textAlign: 'center',
    fontFamily: typography.primaryBold,
    color: 'white',
    fontWeight: '600',
  }
  export const INSTRUCTION: TextStyle = {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  }
  export const BUTTON: ViewStyle =  {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  }
  export const BTN_TEXT: TextStyle = {
    color: 'white',
    fontSize: 16,
  }

  export const SUB_TEXT: TextStyle = {
    textAlign: 'center',
    lineHeight: 65,
    // borderColor: 'red',
    // borderWidth: 1
  }

  export const MODAL_CTR: ViewStyle =  {
    paddingHorizontal: 41,
    borderRadius: 16,
    maxHeight: '90%'
  }