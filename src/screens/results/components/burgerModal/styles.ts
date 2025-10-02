import { TextStyle, ViewStyle } from "react-native"

import { colors } from "src/theme"

export const MODAL_TEXT: TextStyle = {
    textAlign: 'center'
  }
  
  export const MODAL_TEXT_CTR: ViewStyle = {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    alignItems: 'center',
  }
  
  export const MODAL_WRAPPER: ViewStyle = {
    margin: 0,
    justifyContent: 'flex-end',
  }
  
  export const LINE: ViewStyle = {
    alignSelf: 'center', 
    width: 68, 
    height: 5, 
    backgroundColor:colors.primary03, 
    borderRadius: 16
  }
  
  export const MODAL_CTR: ViewStyle =  {
    height: 280,
    paddingHorizontal: 20,
    paddingTop: 25,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.white,
    gap: 20
  }