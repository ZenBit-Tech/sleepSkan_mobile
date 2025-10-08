import LinearGradient from "react-native-linear-gradient";

import { Text } from "src/components";
import { TxKeyPath } from "src/i18n";
import { colors } from "src/theme";

import * as S from './styles'

export const StatCard = ({ title, value }: { title: TxKeyPath; value: string }) => {
  return (
    <LinearGradient
      colors={[colors.primary03, colors.primary03]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[S.STAT_CARD, { borderColor: colors.primary03 }]}
    >
      <Text tx={title} preset='header4bold' style={[S.CENTER_TEXT, S.TEXT_WIDTH]} />
      <Text preset='largeBold' style={S.CENTER_TEXT}>{value}</Text>
    </LinearGradient>
  );
};