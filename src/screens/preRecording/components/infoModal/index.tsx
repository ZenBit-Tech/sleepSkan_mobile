import React from 'react';
import {
  View,
  StyleSheet,
  type View as RNView,
  Image,
} from 'react-native';
import { SVGIcon, Text } from 'src/components';
import { ICard } from '../..';
import { ScrollView } from 'react-native-gesture-handler';
import { PILLOW_IMG } from 'src/constants';

import * as S from './styles'
import { TxKeyPath } from 'src/i18n';

type Props = {
  card?: ICard,
};

const list: TxKeyPath[] = ['recording.reason1', 'recording.reason2', 'recording.reason3', 'recording.reason4', 'recording.reason5']

export const InfoModal = ({
  card,
}: Props)=> {

  const renderItem = (item: TxKeyPath, index: number) => {
    return <Text key={index} style={S.CENTER_TEXT}>•<Text preset='header4' tx={item}  /></Text>
  }

  return (
      <ScrollView style={styles.modalCtr}>
        <View style={{alignItems: 'center'}}>
        <Image
          style={S.IMAGE_CTR}
          resizeMode="contain"
          source={PILLOW_IMG}
        />
        <Text preset='headerBold' tx='recording.important' />
        {/* <View key={card.label} style={styles.feedbackCard}>
          <SVGIcon name={card.icon} size={50} color={card.color} />
          <Text preset="middleBold" style={[styles.feedbackCardLabel, { color: card.color }]}>{card.label}</Text>
        </View> */}
        <View style={{alignItems: 'center', gap: 15, marginTop: 20}}>
          <Text preset='header4' tx='recording.postpone' style={S.CENTER_TEXT} />
          {list.map((item, index) => renderItem(item, index))}
        </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalCtr: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingBottom: 63
  },
  feedbackCard: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 42
  },
  feedbackCardLabel: {
    marginTop: 8,
    fontWeight: '600',
  }
});
