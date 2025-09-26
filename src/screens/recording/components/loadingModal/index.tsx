import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { TxKeyPath } from 'src/i18n';
import { ChunkData } from '@asolerp/react-native-audio-chunk-recorder';
import Toast from 'react-native-toast-message';

import { SVGIcon, Text } from 'src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { finishSession, uploadAudioToFirebase } from 'src/services';

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

  const [loading, setLoading] = useState<boolean>(true)

  const handleFinish = async () => {
    await finishSession(userUid, 'devsession-1');
  };

  useEffect(() => {
    if (chunks.length > 0) {
      chunks.map(chunk => {
        const fileName = chunk.path.split('/').pop() || `audio_${Date.now()}.aac`;
          uploadAudioToFirebase(
            chunk.path, 
            fileName, 
            userUid,
            () => setMyChunks(chunks.filter(c => c.path !== chunk.path))
          )
      })
    } else if (chunks.length === 0) {
      setTimeout(() => {
        handleFinish()
        Toast.show({
          type: 'success',
          text1: 'Your data was successfully downloaded',
        });
        navHome()
      }, 1000)
      
    }
  }, [chunks, loading])

  return (
      <ScrollView style={styles.modalCtr}>
        <View style={{alignItems: 'center'}}>
        <SVGIcon name='flashDrive' size={88} />
        
        <View style={{alignItems: 'center', gap: 12, marginTop: 20, paddingHorizontal: 20}}>
        <Text style={S.CENTER_TEXT} preset='middleBold' tx='recording.loading' />
          <Text style={S.CENTER_TEXT} preset='header4' tx='recording.keepOpen' />
          <Text style={S.CENTER_TEXT} preset='header4' tx='recording.left' />
          <CountdownTimer initialMinutes={10} onFinish={handleFinish} />
        </View>
      
        </View>
      </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   modalCtr: {
//     marginHorizontal: 16,
//     borderRadius: 16,
//     paddingBottom: 63
//   },
//   feedbackCard: {
//     marginTop: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 42
//   },
//   feedbackCardLabel: {
//     marginTop: 8,
//     fontWeight: '600',
//   }
// });
