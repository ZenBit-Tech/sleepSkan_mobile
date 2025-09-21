
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from 'src/constants';
import { colors, typography } from 'src/theme';

const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;

  export const CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
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
  }

  export const INSTRUCTION: TextStyle = {
    textAlign: 'center',
    color: 'white',
  }

  export const IMG_CTR: ViewStyle = {
    alignItems: 'center', 
    gap: 50
  }

  export const BUTTON: ViewStyle =  {
    backgroundColor: colors.primary,
    width: 179,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  }
  export const BTN_TEXT: TextStyle = {
    color: 'white',
    fontSize: 15,
  }

  export const IMAGE_CTR: ImageStyle = {
    width: 271,
    height: 148
  }

  export const MODAL_CTR: ViewStyle =  {
    paddingHorizontal: 41,
    borderRadius: 16,
    maxHeight: '90%'
  }