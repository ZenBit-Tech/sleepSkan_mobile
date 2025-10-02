import React from 'react';
import {
  View,
} from 'react-native';

import { TxKeyPath } from 'src/i18n';
import { Button, SVGIcon, Text } from 'src/components';

import * as S from './styles';

type Props = {
    desiredService: 'doctor_appointment' | 'prescription' | undefined
    onClose: () => void
};


export const NoticeModal = ({
    desiredService,
    onClose,
}: Props)=> {

  return (
   
      <View style={S.MODAL_CTR}>
        <View style={S.CENTER_ITEMS}>
        <SVGIcon name='info' size={41} />
        <Text style={S.CENTER_TEXT} preset='middleBold' tx='recording.notice' />
        
        <View style={S.TEXT_CTR}>
        <Text style={S.CENTER_TEXT} preset='middleBold' tx='results.construction' />
          <Text 
            style={S.CENTER_TEXT} 
            preset='header3' 
            tx={desiredService === 'prescription' ? 'results.prescription' : 'results.docAppointment'} />
        </View>
        <View style={S.BTNS_CTR}>
          <Button 
            preset='transparent'
            tx='results.noticeBtn'
            onPress={onClose}
          />
        </View>
        </View>
      </View>
  );
};

