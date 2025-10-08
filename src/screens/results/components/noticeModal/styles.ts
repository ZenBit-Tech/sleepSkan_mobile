import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { IS_ANDROID } from "src/constants/common";

 export const IMAGE_CTR: ImageStyle = {
    width: 50,
    height: 50
  }

  export const CENTER_TEXT: TextStyle = {
    textAlign: 'center'
  }

  export const BTNS_CTR: ViewStyle = {
    alignItems: 'center', 
    marginTop: 42, 
    minHeight: 65, 
    marginBottom: IS_ANDROID ? 0 : 63,
    width: 220
  }

  export const TEXT_CTR: ViewStyle = {
    alignItems: 'center', 
    gap: 20, 
    marginTop: 42
  }

  export const MODAL_CTR: ViewStyle = {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingBottom: 63,
    paddingTop: 37
  }

  export const CENTER_ITEMS: ViewStyle = {
    alignItems: 'center'
  }