import React, { useCallback, useState } from 'react';
import {  Image, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { Loader, MainHeader, Modal, Screen, Text } from 'src/components';
import { IconTypes } from 'src/components/svg-icon/icons';
import { auth, profileInfo } from 'src/store/selectors';
import { clearFirebaseFolder } from 'src/services';
import { BED_IMG, MainStack } from 'src/constants';
import { MainStackList } from 'src/navigation';

import * as S from './styles'
import { InfoModal } from './components/infoModal';

export interface ICard {
  label: string; 
  icon: IconTypes; 
  color: string, 
  description: string,
  name: 'tobacco' | 'sleep' | 'coffee' | 'alcohol' | 'medicine' | 'weight'
}

export const PreRecordingScreen = ({navigation}: StackScreenProps<MainStackList, MainStack.PRE_RECORDING>) => {
  const {t} = useTranslation();
  const authInfo = useSelector(auth);
  const user = useSelector(profileInfo)
  const insets = useSafeAreaInsets();

  const [showModal, setShowModal] = useState<boolean>(false)
  const [clearLoading, setClearLoading] = useState<boolean>(true)

  useFocusEffect(useCallback(() => {
    setTimeout(() => setShowModal(true), 500) 
  }, []))

  const handleNext = useCallback(async() => {
    setClearLoading(true)
    authInfo.uid && await clearFirebaseFolder(
      authInfo.uid, 
      () => {
        setClearLoading(false)
        navigation.navigate(MainStack.RECORDING)}
    )
  }, [authInfo.uid, navigation])

  
  return (
    <Screen customHeader={<MainHeader withLogout withBack/>} >
      <View style={[S.CONTAINER, { paddingTop: insets.top }]}>


      <View style={S.IMG_CTR}>
        <Image
          style={S.IMAGE_CTR}
          resizeMode="contain"
          source={BED_IMG}
        />

        <Text preset='header4' style={S.INSTRUCTION} tx='recording.checkCharger' />
      </View>

      <TouchableOpacity style={S.BUTTON} onPress={handleNext}>
        {!clearLoading ? <Loader /> : <Text tx='common.ok' style={S.BTN_TEXT}/>}
      </TouchableOpacity>
    </View>
    
      <Modal 
        isVisible={showModal}
        style={S.MODAL_CTR}
        onClose={() => setShowModal(false)}
      >
        <InfoModal/>
      </Modal>
      <Modal 
        isVisible={showModal}
        style={S.MODAL_CTR}
        onClose={() => setShowModal(false)}
      >
        <InfoModal/>
      </Modal>
    </Screen>
  );
};
