import { ImageStyle, TextStyle, ViewStyle } from "react-native"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "src/constants"
import { IS_ANDROID } from "src/constants/common"
import { colors, typography } from "src/theme"

export const CONTAINER: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80
  }

  export const RISK_SECTION: ViewStyle = {
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT > 750 ? 34 : 20,
    marginTop: SCREEN_HEIGHT > 750 ? 34 : 10,
    paddingHorizontal: 40
  }

  export const RISK_ICON: ImageStyle = {
    marginBottom: 12,
  }
  
  export const RISK_TITLE:TextStyle = {
    textAlign: 'center',
    marginBottom: 8,
  }

  export const RISK_DESCRIPTION:TextStyle = {
    color: colors.white07,
    textAlign: 'center',
    // marginBottom: 16,
    maxWidth: 320,
  }

  export const FEEDBACK_TITLE_ROW: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 27,
  }

  export const FEEDBACK_TITLE: TextStyle = {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 6,
  }

  export const FEEDBACK_INFO_ICON: ImageStyle = {
    marginTop: 2,
  }

  export const LIST_COMPONENT: ViewStyle = {
    gap: 15,
    marginBottom: 40,
  }

  export const FEEDBACK_GRID: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 34
  }

  export const FEEDBACK_CARD: ViewStyle = {
    width: 130,
    maxHeight: 72,
    height: ((SCREEN_WIDTH - 120 - 15)/2) * 0.65,
    backgroundColor: colors.primary03,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  }

  export const FEEDBACK_LABEL: TextStyle = {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  }

  export const BOTTOM_BTN_AREA: ViewStyle = {
    borderColor: colors.white,
    borderWidth: 1,
    // marginBottom: 20,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
  }

  export const OUTLINED_BTN_TEXT: TextStyle = {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginHorizontal: 20,
    fontFamily: typography.primaryBold
  }

  export const MODAL_CTR: ViewStyle = {
    paddingHorizontal: 41,
    borderRadius: 16,
    maxHeight: SCREEN_HEIGHT,
    justifyContent: 'center',
    marginBottom: IS_ANDROID ? 0 : '10%'
  }
  
  export const LIST_CTR: ViewStyle = {
    justifyContent: 'center', 
    gap: 15,
  }
