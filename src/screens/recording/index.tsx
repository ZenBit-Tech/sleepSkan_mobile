import React, { useState, useEffect, useRef } from 'react';
import {  Pressable, StyleSheet, View, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { StackScreenProps } from '@react-navigation/stack';
import { ChunkData, useAudioRecorderCore } from '@asolerp/react-native-audio-chunk-recorder';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { getAuth } from '@react-native-firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Loader, Modal, Screen, Text } from 'src/components';
import { IconTypes } from 'src/components/svg-icon/icons';
import { MainStackList } from 'src/navigation';
import { MainStack, SCREEN_HEIGHT } from 'src/constants';
import Header from 'src/components/header';
import { clearFirebaseFolder, uploadAudioToFirebase } from 'src/services';

import * as S from './styles'
import { StopModal } from './components/stopModal';
import { LoadingModal } from './components';


export interface ICard {
  label: string; 
  icon: IconTypes; 
  color: string, 
  description: string,
  name: 'tobacco' | 'sleep' | 'coffee' | 'alcohol' | 'medicine' | 'weight'
}

const auth = getAuth();

export const RecordingScreen = ({navigation}: StackScreenProps<MainStackList, MainStack.RECORDING>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const [start, setStart] = useState<boolean>(false)
  const [showStopModal, setShowStopModal] = useState<boolean>(false)
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0);
  const [myChunks, setMyChunks] = useState<ChunkData[]>([]);
  const [clearFolder, setClearFolder] = useState<boolean>(false)

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const user = auth.currentUser

  const navHome = () => {
    setShowLoadingModal(false)
    navigation.navigate(MainStack.HOME)
  }

  const { isRecording, startRecording, stopRecording, chunks, hasPermission } =
  useAudioRecorderCore({
    autoStartRecording: false,
    defaultRecordingOptions: {
      chunkSeconds: 600,
      maxRecordingDuration: 43200
    },
    onChunkReady: async (chunk) => {
      setMyChunks(prev => [...prev, chunk])
      const fileName = chunk.path.split('/').pop() || `audio_${Date.now()}.aac`;
      user?.uid && uploadAudioToFirebase(
        chunk.path, 
        fileName,
        user?.uid,
        () => setMyChunks(prev => prev.filter(c => c.path !== chunk.path))
      )
    },
    onError: (error) => {
      console.error("❌ Recording error:", error);
      Alert.alert("Error", error.message);
    },
  });

  useEffect(() => {
    const requestMicPermission = async () => {
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.MICROPHONE;
        const result = await check(permission);
        if (result !== RESULTS.GRANTED) {
          const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
          if (requestResult !== RESULTS.GRANTED) {
            throw new Error('Microphone permission not granted');
          }
        }
      } else {
        permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
        const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        await request(permission);
      }
      }
      
    };
    requestMicPermission();
  }, []);

  const handleStart = async() => {
    setClearFolder(true)
    user && await clearFirebaseFolder(user?.uid,)
    setClearFolder(false)
    await startRecording();
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  useEffect(() => {
    console.log('My chunks', myChunks)
  }, [myChunks])

  useEffect(() => {
    if (start) {
       activateKeepAwake()
       handleStart()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [start]);

  const openLoadingModal = () => {
    stopRecording();
    deactivateKeepAwake()
    setStart(false);
    setShowStopModal(false);
    // handleStopRecording()
    setTimeout(() => setShowLoadingModal(true), 1000);
  };

  const handleStartRecording = async () => {
    if (!start) {
      setStart(true);
    } else {
      setShowStopModal(true);
    }
  };

  const timer = new Date(seconds * 1000).toISOString().substr(11, 8);
  
  return (
    <Screen customHeader={<Header withLogout withBack withTitle title='recording.charge' />}  preset={SCREEN_HEIGHT > 750 ? 'fixed' : 'scroll'}>
      <View style={[S.CONTAINER, { paddingTop: insets.top }]}>

      <View>

      {/* {isRecording && <Text color='red' style={{textAlign: 'right'}} preset='headerBold' text='RECORDING' />} */}

        <View style={S.CIRCLE}>
          {!start 
          ? <Text style={S.GOODNIGHT} tx='recording.goodNight' /> 
          : <View>
              <Text preset='largeBold' style={S.SUB_TEXT} tx='recording.started' />
              {clearFolder ? <Loader /> : <Text style={S.TIMER} > {timer}</Text>}
              <Text preset='largeBold' style={S.SUB_TEXT} tx='recording.boa' />
            </View>
        }
        </View>

        <Text preset='header4bold' style={S.INSTRUCTION} tx='recording.putPhone' />
      </View> 
      <Pressable style={S.BUTTON} onPress={handleStartRecording}>
        <Text style={S.BTN_TEXT} tx={!start ? 'recording.startRecording' : 'recording.stopRecording'} />
      </Pressable>
    </View>

    <Modal 
      isVisible={showStopModal}
      style={S.MODAL_CTR}
      onClose={() => setShowStopModal(false)}
    >
      <StopModal 
        onClose={() => setShowStopModal(false)} 
        openLoadingModal={openLoadingModal}
      />
    </Modal>
    <Modal 
      isVisible={showLoadingModal}
      style={S.MODAL_CTR}
      // onClose={() => {}}
      // TODO: Only for testing purpuses can be closed
      onClose={() => setShowLoadingModal(false)}
    >
      {user?.uid && <LoadingModal 
        chunks={myChunks}
        userUid={user?.uid}
        setMyChunks={setMyChunks}
        navHome={navHome}
      />}
    </Modal>
    </Screen>
  );
};
