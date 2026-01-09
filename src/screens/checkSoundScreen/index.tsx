import React, { useCallback, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Platform,
  NativeModules,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { getAuth } from '@react-native-firebase/auth';
import { activateKeepAwake } from '@sayem314/react-native-keep-awake';
import RNFS from 'react-native-fs';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';

import { Loader, MainHeader, Screen, Text } from 'src/components';
import { MainStack } from 'src/constants';
import { MainStackList } from 'src/navigation';
import * as S from './styles';
import { uploadAudioCalibrationToFirebase } from 'src/services';
import { useAudioRecorderCore } from '@asolerp/react-native-audio-chunk-recorder';
import { CommonActions } from '@react-navigation/native';
import { colors } from 'src/theme';

const auth = getAuth();

export const CheckSoundScreen = ({
  navigation,
}: StackScreenProps<MainStackList, MainStack.CHECK_SOUND>) => {
  const { t } = useTranslation();
  const user = auth.currentUser;
  const insets = useSafeAreaInsets();
  const { WakeLock, RecordAudioService } = NativeModules;

  // 1 = silent phase, 2 = loud phase
  const [screen, setScreen] = useState<1 | 2>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);

  // ====== PERMISSIONS ======
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const result = await check(PERMISSIONS.IOS.MICROPHONE);
          if (result !== RESULTS.GRANTED) {
            const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
            if (requestResult !== RESULTS.GRANTED) {
              throw new Error('Microphone permission not granted');
            }
          }
        } else {
          const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
          if (result !== RESULTS.GRANTED) {
            await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          }
        }
      } catch (err) {
        console.warn('Mic permission error', err);
      }
    };
    requestMicPermission();
  }, []);

  // ====== ANDROID RECORDING (chunks via @asolerp/react-native-audio-chunk-recorder) ======
  const {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission: hasRecorderPermission,
  } = useAudioRecorderCore({
    autoStartRecording: false,
    defaultRecordingOptions: {
      chunkSeconds: 600,
      maxRecordingDuration: 50400
    },
    onMaxDurationReached: () => {
      stopRecording().catch(() => {});
    },
    onChunkReady: async (chunk) => {
      if (!user?.uid) return;
      const fileName = `${screen === 1 ? 'silent' : 'loud'}.wav`;
      try {
        await uploadAudioCalibrationToFirebase(chunk.path, fileName, user.uid);
      } catch (error) {
        console.error('Upload failed', error);
      }
    },
    onError: (error) => {
      console.error('❌ Recording error:', error);
      Alert.alert('Error', error.message);
    },
  });

  // ====== iOS native chunk events ======
  useEffect(() => {
    if (Platform.OS !== 'ios' || !user?.uid) return;

    try {
      const emitter = new NativeEventEmitter(NativeModules.RecordAudioEvents);

      const onState = emitter.addListener(
        'RecordAudioState',
        ({ state, reason }) => {
          if (state === 'stopped') {
            Toast.show({
              type: 'info',
              text1:  t('recording.recStop'),
            });
          } else if (state === 'recording') {
            Toast.show({
              type: 'success',
              text1: t('recording.recStart'),
            });
          }
        },
      );

      const onStopped = emitter.addListener(
        'RecordAudioStopped',
        ({ reason }) => {
          console.log('RecordAudioStopped event:', reason);
        },
      );

      const sub = emitter.addListener(
        'RecordAudioChunk',
        async ({ path, index, success }) => {
          if (!success || !user?.uid) return;
          const fileName = `${screen === 1 ? 'silent' : 'loud'}.m4a`;
          await uploadAudioCalibrationToFirebase(path, fileName, user.uid);
        },
      );

      return () => {
        sub.remove();
        onState.remove();
        onStopped.remove();
      };
    } catch (error) {
      console.log('Error from iOS chunk events useEffect', error);
    }
  }, [user?.uid, screen]);

  // ====== START NATIVE RECORDING (both platforms) ======
  const handleStartNativeRecording = useCallback(async () => {
    await activateKeepAwake();

    if (Platform.OS === 'android') {
      if (!hasRecorderPermission) {
        console.warn('Recorder permission not granted');
      }
      await WakeLock?.acquire?.();
      await startRecording();
    }

    if (Platform.OS === 'ios') {
      try {
        const dir = `${RNFS.DocumentDirectoryPath}/recordings`;
        await RNFS.mkdir(dir);
        const filePath = `${dir}/sleep_${Date.now()}.m4a`;
        RecordAudioService.StartAudioService(filePath);
      } catch (error) {
        console.log('Error starting iOS recording', error);
      }
    }
  }, [hasRecorderPermission, startRecording, WakeLock, RecordAudioService]);

  const handleStopNativeRecording = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        await stopRecording();
      } catch (e) {
        console.log('Error stopping Android recording', e);
      }
      await WakeLock?.release?.();
    }

    if (Platform.OS === 'ios') {
      try {
        RecordAudioService.StopAudioService?.();
      } catch (e) {
        console.log('Error stopping iOS recording', e);
      }
    }
    setStarted(false)
    if (screen === 1) {
      setTimeout(async () => {
        setScreen(2);
        // setStarted(true)
        // await handleStartNativeRecording();
      }, 500)
    }
  }, [stopRecording, screen, WakeLock, RecordAudioService]);

  // ====== START BUTTON: start recording + init timer ======
  const handleStartRecording = useCallback(async () => {
    // start native recording first
    await handleStartNativeRecording();

    // then set UI state
    // setScreen(1);        // silent phase
    screen === 1 && setSecondsLeft(15);  // 30s countdown
    console.log('HERE 1')
    setStarted(true);
  }, [handleStartNativeRecording]);

  // ====== SINGLE EFFECT: countdown + auto-switch silent -> loud ======
  useEffect(() => {
    // Only run timer if we've started and are on silent phase
    if (!started || screen !== 1) return;

    // If time is over, switch to loud phase (keep recording running)
    if  (secondsLeft <= 0) {
      handleStopNativeRecording()
    
      return;
    }

    const id = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [started, screen, secondsLeft]);

  // ====== STOP AFTER LOUD PHASE ======
  const handleStopLoudPhase = useCallback(async () => {
    try {
      await handleStopNativeRecording();

      navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: MainStack.HOME,
          },
          {
            name: MainStack.RECORDING,
          },
        ],
      })
    );
    } catch (e) {
      console.warn('Failed to stop loud recording or navigate', e);
    } finally {
      setSecondsLeft(0);
      setStarted(false);
    }
  }, [handleStopNativeRecording, navigation]);

  const startLoudRecording = async() => {
    console.log('HERE 2')
        setStarted(true)
        await handleStartNativeRecording();
  }

  console.log("STARTED", started)
  
  // ====== RENDER ======
  return (
    <Screen customHeader={<MainHeader withLogout withBack />}>
      <View style={{ marginVertical: 40, marginHorizontal: 40 }}>
        {screen === 1 ? (
          <View>
            <Text
              style={S.GOODNIGHT}
              tx='recording.soundCheckTitle'
            />

            {!started && (
              <TouchableOpacity style={S.BUTTON} onPress={handleStartRecording}>
                <Text tx="common.start" style={S.BTN_TEXT} />
              </TouchableOpacity>
            )}

            {started && (
              <View style={S.CIRCLE}>
                <View>
                  <Text style={S.TIMER}>{secondsLeft} {t('common.sec')}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={{ gap: 30 }}>
            {/* {started ? ( */}
              <View style={{gap: 40}}>
                <Text
                  style={S.GOODNIGHT}
                  tx='recording.soundCheckDistance'
                />
                <View style={{borderColor: colors.beige, borderWidth: 1, borderRadius: 20, padding: 10}}>
                  <Text
                    style={S.GOODNIGHT}
                    tx='recording.soundCheckText'
                  />
                </View>

                
              </View>

            {!started 
              ? <TouchableOpacity style={S.BUTTON} onPress={startLoudRecording}>
                <Text tx="common.start" style={S.BTN_TEXT} />
              </TouchableOpacity> 
              : <TouchableOpacity style={S.BUTTON} onPress={handleStopLoudPhase}>
                <Text tx="common.stop" style={S.BTN_TEXT} />
              </TouchableOpacity>}
          </View>
        )}
      </View>
    </Screen>
  );
};