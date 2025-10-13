import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  View,
} from 'react-native';

import { TxKeyPath } from 'src/i18n';
import { Button, SVGIcon, Text } from 'src/components';

import { BTNS_CTR, CENTER_ITEMS, CENTER_TEXT, MODAL_CTR, TEXT_CTR } from './styles';

type Props = {
  onClose: () => void
  openLoadingModal: () => void
};

const list: TxKeyPath[] = ['recording.reason1', 'recording.reason2', 'recording.reason3', 'recording.reason4', 'recording.reason5']

export const StopModal = ({
  onClose,
  openLoadingModal
}: Props)=> {

  return (
      <ScrollView style={MODAL_CTR}>
        <View style={CENTER_ITEMS}>
        <SVGIcon name='info' size={41} />
        <Text style={CENTER_TEXT} preset='middleBold' tx='recording.notice' />
        <View style={TEXT_CTR}>
          <Text style={CENTER_TEXT} preset='header3' tx='recording.interrupt' />
          {/* <Text style={CENTER_TEXT} preset='header3' tx='recording.lost' /> */}
        </View>
        <View style={BTNS_CTR}>
          <Button 
            tx='recording.continue'
            onPress={onClose}
          />
          <Button 
            preset='transparent'
            tx='recording.back'
            onPress={openLoadingModal}
          />
        </View>
        </View>
      </ScrollView>
  );
};

