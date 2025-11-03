import React from 'react';
import {
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Button, Loader, SVGIcon, Text } from 'src/components';

import * as S from './styles'

type Props = {
  loading: boolean
  clearStorage: () => void
  onClose: () => void
};

export const CleanStorage = ({
  loading,
  clearStorage=() => {},
  onClose=() => {}
}: Props)=> {

  return (
      <ScrollView style={S.MODAL_CTR}>
        <View style={S.CENTER_ITEMS}>
          <SVGIcon name='info' size={41} />
          <Text style={S.CENTER_TEXT} preset='middleBold' tx='recording.notice' />
        </View>
        {loading ? <View style={S.TEXT_CTR}>
          <Text preset='header3' tx='home.cleaning' style={S.CENTER_TEXT} />
            <Loader size={150} /> 
          </View> 
          : <View style={S.TEXT_CTR}>
            <Text preset='header3' tx='home.deleteDescr' style={S.CENTER_TEXT} />
            <Text preset='header3' tx='home.sureClean' style={S.CENTER_TEXT} />
          </View>}
        <View style={S.BTNS_CTR}>
          <Button 
            preset='secondary'
            onPress={clearStorage}
            style={{width: '90%'}}
            tx='home.delete'/>
          <Button 
            style={{width: '90%'}} 
            onPress={onClose}
            tx='common.cancel'/>
        </View>
      </ScrollView>
  );
};
