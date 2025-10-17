import React from 'react';
import {
  View,
} from 'react-native';

import { TxKeyPath } from 'src/i18n';
import { Button, SVGIcon, Text } from 'src/components';

import * as S from './styles';
import { submitFeedback } from 'src/db';

type Props = {
    desiredService: 'doctor_appointment' | 'prescription' | 'investigation' | undefined
    userUid: string 
    onClose: () => void
};


export const NoticeModal = ({
    desiredService,
    userUid,
    onClose,
}: Props)=> {

  const desiredServiceOptions = (): TxKeyPath | undefined =>{
    if (desiredService === 'doctor_appointment') {
      return 'results.docAppointment';
    } else if (desiredService === 'prescription') {
      return 'results.prescription';
    } else if (desiredService === 'investigation') {
      return 'results.investigation';
    } else {
      return undefined;
    }
  }

  const handleSendFeedback = async() => {
    if (desiredService) {
      const input = {
      type: desiredService,
      uid: userUid,
    }
    await submitFeedback(input)
    onClose()
  }
  }

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
          tx={desiredServiceOptions()} />
      </View>
      <View style={S.BTNS_CTR}>
        <Button 
          preset='transparent'
          tx='results.noticeBtn'
          onPress={handleSendFeedback}
        />
      </View>
      </View>
    </View>
  );
};

