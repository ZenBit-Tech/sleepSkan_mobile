import React, { useState, useEffect, useRef } from 'react';
import {  Pressable, View, Platform, Alert, NativeModules, AppState, NativeEventEmitter, AppStateStatus } from 'react-native';
import { useTranslation } from 'react-i18next';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { StackScreenProps } from '@react-navigation/stack';
import { ChunkData, useAudioRecorderCore } from '@asolerp/react-native-audio-chunk-recorder';
import { activateKeepAwake } from '@sayem314/react-native-keep-awake';
import { getAuth } from '@react-native-firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundService from 'react-native-background-actions';
import RNFS from 'react-native-fs'
import BackgroundFetch from 'react-native-background-fetch'
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

import { Loader, Modal, Screen, Text } from 'src/components';
import { MainStackList } from 'src/navigation';
import { MainStack, SCREEN_HEIGHT } from 'src/constants';
import Header from 'src/components/header';
import { uploadAudioToFirebase } from 'src/services';
import IdleBlackout from 'src/utils/IdleBlackout';
import { useAppDispatch } from 'src/store';
import { setRecordingStart } from 'src/store/common';

import * as S from './styles'
import { StopModal } from './components/stopModal';
import { LoadingModal } from './components';


const auth = getAuth();

const bgOptions = {
  taskName: 'SleepScan',
  taskTitle: 'Recording in progress',
  taskDesc: 'Recording audio and uploading chunks',
  taskIcon: { name: 'ic_launcher', type: 'mipmap' },
  color: '#346C94',
  parameters: {

  },
  // Android 14 service types
  linkingURI: 'sleepscan://recording',
};

export const RecordingScreen = ({navigation}: StackScreenProps<MainStackList, MainStack.RECORDING>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch()
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const pendingNext = useRef<null | 'loading'>(null);
  
  const { WakeLock, RecordAudioService, BatteryOptimizations } = NativeModules;

  const [start, setStart] = useState<boolean>(false)
  const [showStopModal, setShowStopModal] = useState<boolean>(false)
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false)
  const [iosTimer, setIosTimer] = useState<number>(0);
  const [myChunks, setMyChunks] = useState<ChunkData[]>([]);
  const [clearFolder, setClearFolder] = useState<boolean>(false)
  const [appStateVisible, setAppStateVisible] = useState<AppStateStatus>(
    appState.current,
  )

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const recordingStartDate = useRef<string>('')

  const user = auth.currentUser

  // ======permissions=====
  const ensureBatteryWhitelist = async() => {
    if (Platform.OS !== 'android' || !BatteryOptimizations) return;
    try {
      const ignored = await BatteryOptimizations.isIgnoring();
      if (!ignored) {
        // Show your own explanation UI first, then:
        await BatteryOptimizations.requestIgnore();
      }
    } catch (e) {
      console.warn('Battery optimization check failed:', e);
    }
  }

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
        await ensureBatteryWhitelist();
        permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
        const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        await request(permission);
      }
      }
      
    };
    requestMicPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // ======background service======
  const bgTask = async () => {
    await new Promise(() => {}); // never resolves until stop()
  };

  const startBgService = async() => {
    if (!(await BackgroundService.isRunning())) {
      await BackgroundService.start(bgTask, bgOptions);
    }
  }

  const stopBgService = async() => {
    if (await BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  }

  // ======= end ========


useEffect(() => {
  console.log('My chunks', myChunks)
}, [myChunks])

  // const sleep = (time: any) => new Promise((resolve) => setTimeout(() => resolve(), time));

//   const veryIntensiveTask = async (taskDataArguments: any) => {
//     // Example of an infinite loop task
//     const { delay } = taskDataArguments;
//     await new Promise( async (resolve) => {
//         for (let i = 0; BackgroundService.isRunning(); i++) {
//             await sleep(delay);
//         }
//     });
// };

  // ======IOS timer=====
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    
    const startD = dayjs(recordingStartDate.current);
    
    if (appStateVisible === 'active' && start) {
      const recodingTimeInMs = startD.isValid() ? dayjs().diff(
        startD,
        'millisecond',
      ) : 0

      !isNaN(recodingTimeInMs) && setIosTimer(recodingTimeInMs)

      interval = setInterval(() => {
        setIosTimer((prevTime) => prevTime + 1000)
      }, 1000)
    } else {
      if (interval) {
        clearInterval(interval)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [appStateVisible, start])

// =======Android timer=======
  const startTimestamp = React.useRef<number | null>(null);
  const [, force] = useState(0);
  let raf: number | null = null;

  function tickTimer() {
    if (raf) cancelAnimationFrame(raf);
    const loop = () => {
      force(x => x + 1); // just rerender
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  useEffect(() => {
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, []);

  const seconds = startTimestamp.current
    ? Math.max(0, Math.floor((Date.now() - startTimestamp.current) / 1000))
    : 0;

  const timer = Platform.OS === 'ios' ? new Date(iosTimer).toISOString().substr(11, 8) : new Date(seconds * 1000).toISOString().substr(11, 8);

  //========iOS native chunk events=======
  useEffect(() => {
    try {
      if (Platform.OS !== 'ios' || !user?.uid) return;
      
      const emitter = new NativeEventEmitter(NativeModules.RecordAudioEvents);

      const onState = emitter.addListener('RecordAudioState', ({ state, reason }) => {
        console.log('RecordAudioState event:', state, reason);
        if (state === 'stopped') {
          console.log('Recording stopped. Reason:', reason);
          Toast.show({
            type: 'error',
            text1: 'Recording stopped.',
          })
          // stop UI timers, navigate, etc…
        } else if (state === 'recording') {
          Toast.show({
            type: 'success',
            text1: 'Recording started.',
          })
          // stop UI timers, navigate, etc…
        }
      });

      const onStopped = emitter.addListener('RecordAudioStopped', ({ reason }) => {
        // Optional dedicated event
        console.log('RecordAudioStopped event:', reason);
      });
      
      const sub = emitter.addListener('RecordAudioChunk', async ({ path, index, success }) => {
        console.log('Received chunk event', path, index, success)
        const chunk = {
          path,
          timestamp: Date.now(),
          sequence: index
        }
        setMyChunks(prev => [...prev, chunk])
        console.log('success', success, 'index', index, 'path', path)
        if (!success) return;
        const fileName = `chunk_${index}.m4a`;
        await uploadAudioToFirebase(
          path, 
          fileName,
          user?.uid,
          () => setMyChunks(prev => prev.filter(c => c.path !== path))
        )
      });
    
      return () => {sub.remove(); onState.remove(); onStopped.remove();};
    } catch (error) {
      console.log('Error from useEffect', error)
    }
   
  }, [user?.uid]);

// ======= Android recording and uploading chunks =====
  const { isRecording, startRecording, stopRecording, chunks, hasPermission } =
  useAudioRecorderCore({
    autoStartRecording: false,
    defaultRecordingOptions: {
      chunkSeconds: 600,
      maxRecordingDuration: 43200
    },
    onChunkReady: async (chunk) => {
      setMyChunks(prev => [...prev, chunk])
      const fileName = chunk.path.split('/').pop() || `audio_${Date.now()}.wav`;
      if (!user?.uid) return;
      try {
        uploadAudioToFirebase(
          chunk.path, 
          fileName,
          user?.uid,
          () => setMyChunks(prev => prev.filter(c => c.path !== chunk.path))
        )
      } catch (error) {
        console.error('Upload failed', error);
      } 
    },
    onError: (error) => {
      console.error("❌ Recording error:", error);
      Alert.alert("Error", error.message);
    },
  });

  const handleStart = async() => {
    setClearFolder(true)
    setClearFolder(false)
    if (Platform.OS === 'android') {
      await WakeLock.acquire();
      await startBgService()
      await startRecording();
      startTimestamp.current = Date.now()
      tickTimer()
    }
    if (Platform.OS === 'ios') {
      try {
        const dir = `${RNFS.DocumentDirectoryPath}/recordings`;
        await RNFS.mkdir(dir);
        const filePath = `${dir}/sleep_${Date.now()}.m4a`;

        RecordAudioService.StartAudioService(filePath)
        recordingStartDate.current = dayjs().toISOString()
      } catch (error) {
        console.log("Error", error)
      }
    }
    dispatch(setRecordingStart(true))
  }

  // useEffect(() => {
  //   if (isRecording ) {
  //   // if (isRecording && myChunks.length > 0) {
  //     const uploadExistingChunk = async () => {
  //       console.log('Here')
  //     }

  //     BackgroundFetch.configure(
  //       {
  //         minimumFetchInterval: 31,
  //         stopOnTerminate: false,
  //         startOnBoot: true,
  //         requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
  //       },
  //       async (taskId) => {
  //         console.log('[BackgroundFetch] taskId: ', taskId)
  //         await uploadExistingChunk()
  //         BackgroundFetch.finish(taskId)
  //       },
  //       (error) => {
  //         console.log('[BackgroundFetch] configure error:', error)
  //       },
  //     )

  //     BackgroundFetch.status((status) => {
  //       switch (status) {
  //         case BackgroundFetch.STATUS_RESTRICTED:
  //           console.log('BackgroundFetch restricted')
  //           break

  //         case BackgroundFetch.STATUS_DENIED:
  //           console.log('BackgroundFetch denied')
  //           break

  //         case BackgroundFetch.STATUS_AVAILABLE:
  //           console.log('BackgroundFetch is enabled')
  //           break
  //       }
  //     })

  //     return () => {
  //       BackgroundFetch.stop()
  //     }
  //   }
  // }, [isRecording, myChunks])

  useEffect(() => {
    if (start) {
       activateKeepAwake()
       handleStart()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // setSeconds(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [start]);

  const openLoadingModal = async() => {
    setStart(false);
    setShowLoadingModal(true)
    if (Platform.OS === 'android') {
      stopRecording();
      BackgroundFetch.stop()
      await WakeLock.release()
      stopBgService()
    } else if (Platform.OS === 'ios') {
      try {
        await RecordAudioService.StopAudioService()
      } catch (error) {
        console.log('Error', error)
      }
    }
  };

  const handleStartRecording = async () => {
    if (!start) {
      setStart(true);
    } else {
      setShowStopModal(true);
    }
  };

  const navHome = () => {
    setTimeout(() => {setShowLoadingModal(false)
    setShowStopModal(false)
    navigation.navigate(MainStack.HOME)}, 2000)
  }
  
  const Content = (
    <Screen 
      customHeader={<Header withLogout={!start} withBack={!start} withTitle title='recording.charge' />}  
      preset={SCREEN_HEIGHT > 750 ? 'fixed' : 'scroll'}
    >
      <View style={[S.CONTAINER, { paddingTop: insets.top }]}>

        <View>
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
        onClose={!showLoadingModal ? () => setShowStopModal(false) : () => {}}
      >
        {showLoadingModal 
        ? (user?.uid && <LoadingModal 
          chunks={myChunks}
          userUid={user?.uid}
          setMyChunks={setMyChunks}
          navHome={navHome}
        /> )
        : <StopModal 
          onClose={() => setShowStopModal(false)} 
          openLoadingModal={openLoadingModal}
        />}
      </Modal>
      {/* <Modal 
        isVisible={showLoadingModal}
        style={S.MODAL_CTR}
        onClose={() => {}}
        // TODO: Only for testing purpuses can be closed
        // onClose={() => setShowLoadingModal(false)}
      >
        {user?.uid && <LoadingModal 
          chunks={myChunks}
          userUid={user?.uid}
          setMyChunks={setMyChunks}
          navHome={navHome}
        />}
      </Modal> */}
    </Screen>
  )

  return start ? (
    <IdleBlackout idleMs={15_000}>{Content}</IdleBlackout>
  ) : (
    Content
  );
};
