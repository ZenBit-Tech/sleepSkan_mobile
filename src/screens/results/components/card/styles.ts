import { TextStyle, ViewStyle } from "react-native";
import { SCREEN_WIDTH } from "src/constants";

const CARD_SIDE = (SCREEN_WIDTH - 36 - 18) / 2; 

export const STAT_CARD: ViewStyle = {
    width: CARD_SIDE,
    height: 128,
    borderRadius: 16,
    gap: 7,
    justifyContent: 'center',
}

export const TEXT_WIDTH: TextStyle = {
  width: CARD_SIDE - 30,
  alignSelf: 'center',
}

export const CENTER_TEXT: TextStyle = {
    textAlign: 'center'
  }