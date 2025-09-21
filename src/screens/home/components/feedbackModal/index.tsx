import React from 'react';
import {
  View,
  StyleSheet,
  type View as RNView,
} from 'react-native';
import { SVGIcon, Text } from 'src/components';
import { ICard } from '../..';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  card?: ICard,
};

export const FeedbackModal = ({
  card,
}: Props)=> {

  return (
      <ScrollView style={styles.modalCtr}>
        {card && <View key={card.label} style={styles.feedbackCard}>
          <SVGIcon name={card.icon} size={50} color={card.color} />
          <Text preset="middleBold" style={[styles.feedbackCardLabel, { color: card.color }]}>{card.label}</Text>
        </View>}
        <View>
          <Text preset='header3' style={styles.textStyle}>{card?.description}</Text>
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
  },
  textStyle: {
    textAlign: 'center'
  },
});
