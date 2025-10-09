import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { TxKeyPath } from 'src/i18n';
import { ChunkData } from '@asolerp/react-native-audio-chunk-recorder';
import Toast from 'react-native-toast-message';
import { deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { useTranslation } from 'react-i18next';

import { SVGIcon, Text } from 'src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { finishSession, uploadAudioToFirebase } from 'src/services';
import { useAppDispatch } from 'src/store';
import { setRecordingStart } from 'src/store/common';

import * as S from './styles'
import { CountdownTimer } from '../countDown';


type Props = {
  chunks: ChunkData[]
  userUid: string
  setMyChunks: (chunks: ChunkData[]) => void
  navHome: () => void
};

const list: TxKeyPath[] = ['recording.reason1', 'recording.reason2', 'recording.reason3', 'recording.reason4', 'recording.reason5']

export const LoadingModal = ({
  chunks, 
  userUid,
  setMyChunks,
  navHome
}: Props)=> {

  const dispatch = useAppDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    try {
        if (chunks.length > 0) {
        try {
          chunks.map(chunk => {
            const fileName = Platform.OS === 'ios' 
              ? `chunk_${chunk.sequence || Date.now()}.m4a` 
              : chunk.path.split('/').pop() || `audio_${Date.now()}.m4a`;
              uploadAudioToFirebase(
                chunk.path, 
                fileName, 
                userUid,
                () => setMyChunks(chunks.filter(c => c.path !== chunk.path))
              )
          })
        } catch (error) {
          console.log('Error chunks', error)
        }
        
      } else if (chunks.length === 0) {
        setTimeout(async() => {
          await finishSession(
            userUid, 
            'devsession-1', 
            () => {
              Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro.',
              });
            },
            () => {
              Toast.show({
                type: 'success',
                text1: `${t('recording.success')}`,})
            }
          )
          deactivateKeepAwake()
          dispatch(setRecordingStart(false))
          navHome()
        }, 1000)
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `${t('errors.wrong')}`,})
      deactivateKeepAwake()
      navHome()
      console.log("Error from loading", error)
    } 
    
  }, [chunks])

  return (
      <ScrollView style={S.MODAL_CTR}>
        <View style={S.CONTAINER}>
          <SVGIcon name='flashDrive' size={88} />
          
          <View style={S.TEXT_CTR}>
          <Text style={S.CENTER_TEXT} preset='middleBold' tx='recording.loading' />
            <Text style={S.CENTER_TEXT} preset='header4' tx='recording.keepOpen' />
            <Text style={S.CENTER_TEXT} preset='header4' tx='recording.left' />
            <CountdownTimer initialMinutes={10} onFinish={() => navHome()} />
          </View>
      
        </View>
      </ScrollView>
  );
};
