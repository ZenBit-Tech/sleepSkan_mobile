import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { IS_ANDROID } from "src/constants/common";


  export const CENTER_TEXT: TextStyle = {
    textAlign: 'center'
  }

  export const BTNS_CTR: ViewStyle = {
    marginBottom: 30,
    marginTop: 60, 
    gap: 20, 
    alignItems: 'center', 
  }

  export const TEXT_CTR: ViewStyle = {
    alignItems: 'center', 
    gap: 20, 
    marginTop: 42
  }

  export const MODAL_CTR: ViewStyle = {
    marginHorizontal: 16,
    paddingBottom: IS_ANDROID ? 30 : 60,
  }

  export const CENTER_ITEMS: ViewStyle = {
    alignItems: 'center',
    marginTop: IS_ANDROID ? 32 : 0,
  }