import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {  Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, Text, Button, Modal, Loader } from 'src/components';
import { SVGIcon } from 'src/components/svg-icon';
import { colors, typography } from 'src/theme';
import { IconTypes } from 'src/components/svg-icon/icons';
import { auth, common, profileInfo } from 'src/store/selectors';
import { getUserInfo } from 'src/services/user';
import { MainStack, SCREEN_HEIGHT, SCREEN_WIDTH } from 'src/constants';
import Header from 'src/components/header';
import { MainStackList } from 'src/navigation';
import { clearFirebaseFolder, finishSession } from 'src/services';
import { updateUser } from 'src/db';

import { getAlcoholColor, getAlcoholDescr1, getAlcoholDescr2, getCoffeeColor, getCoffeeDescr, getRiskColor, getRiskSubText, getRiskText, getSleepColor, getSleepDescr, getTobaccoColor, getTobaccoDescr, getWeightColor, getWeightDescr } from './components/helpers';
import { InfoTooltip } from './components';
import { FeedbackModal } from './components/feedbackModal';
import { CleanStorage } from './components/cleanStorage';
import { useAppDispatch } from 'src/store';
import { setRecordingStart } from 'src/store/common';
import { useFocusEffect } from '@react-navigation/native';


export interface ICard {
  label: string; 
  icon: IconTypes; 
  color: string, 
  description: string,
  name: 'tobacco' | 'sleep' | 'coffee' | 'alcohol' | 'medicine' | 'weight'
}

export const MainHomeScreen = ({ navigation }: StackScreenProps<MainStackList, MainStack.HOME>) => {
  const {t} = useTranslation();
  const authInfo = useSelector(auth);
  const user = useSelector(profileInfo)
  const startedRecording = useSelector(common)
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch()

  const infoRef = useRef(null);
  const [showTip, setShowTip] = useState(false);

  const [showModal, setShowModal] = useState<'tobacco' | 'sleep' | 'coffee' | 'alcohol' | 'medicine' | 'weight' | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showCleanStorageModal, setShowCleanStorageModal] = useState<boolean>(false)

  const FEEDBACK_CARDS: ICard[] = [
    { label: t('home.tobacco'), name: 'tobacco', icon: 'tobacco', color: getTobaccoColor(user.profile?.tobacco), description: t(getTobaccoDescr(user.profile?.tobacco))},
    { label: t('home.sleep'), name: 'sleep',icon: 'clock', color: getSleepColor(user.profile?.sleep_hours), description: t(getSleepDescr(user.profile?.sleep_hours))},
    { label: t('home.coffee'), name: 'coffee',icon: 'coffee', color: getCoffeeColor(user.profile?.coffee), description: t(getCoffeeDescr(user.profile?.coffee))},
    { label: t('home.alcohol'), name: 'alcohol',icon: 'alcohol', color: getAlcoholColor(user.profile?.alcohol, user.profile?.alcohol_per_day), description: `${t(getAlcoholDescr1(user.profile?.alcohol))} \n ${t(getAlcoholDescr2(user.profile?.alcohol_per_day))}`},
    { label: t('home.medicine'), name: 'medicine',icon: 'medicine', color: user.profile?.medicines && user.profile?.medicines.includes(6) ? colors.green : colors.red, description: user.profile?.medicines && user.profile?.medicines.includes(6) ? t('home.greenMedicineDescr') : t('home.redMedicineDescr')},
    { label: t('home.weight'), name: 'weight',icon: 'weight', color: getWeightColor(user.profile?.BMI), description: t(getWeightDescr(user.profile?.BMI))},
  ];

  useFocusEffect(useCallback(() => {
    const handleFinishSession = async() => {
      authInfo.uid && await finishSession(authInfo.uid, 'devsession-1')
      authInfo.uid && dispatch(setRecordingStart(false))
    }
    if (startedRecording.recordingStart) {
      handleFinishSession()
    }
  }, [startedRecording.recordingStart, authInfo.uid]))

  useEffect(() => {
    authInfo.uid && getUserInfo(authInfo.uid)
  }, [authInfo])

  const score = useMemo(() => user.profile?.score ? user.profile?.score : 0.5, [user.profile?.score])

  const getBtnText = () => {
    if (score && score <= 2) {
      return t('home.buttonText')
    } else if (score && score > 2 && score <= 4) {
      return t('home.yellowBtnText')
    } else if (score && score > 4) {
      return t('home.redButtonText')
    }
  }

  const renderItem = ({ item }: { item: ICard }) => (
    <TouchableOpacity style={styles.feedbackCard} onPress={() => setShowModal(item.name)}>
      <SVGIcon name={item.icon} size={32} color={item.color} />
      <Text preset="header4" style={[styles.feedbackCardLabel, { color: item.color }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleNewRecording = async() => {
    authInfo.uid && await updateUser(authInfo.uid, {recording: false})
    setShowCleanStorageModal(false)
    setLoading(false)
    setTimeout(() => navigation.navigate(MainStack.PRE_RECORDING), 400)
  }

  const clearStorage = async() => {
    try {
      setLoading(true)
      authInfo.uid && await clearFirebaseFolder(
        authInfo.uid,
        handleNewRecording
      )

    } catch (error) {
      setShowCleanStorageModal(false)
      setLoading(false)
      //TODO: Only for tests
      Alert.alert("Error", 'Something welt wrong');
      console.log(error)
    } 
  }

  const handleCleanAndStartNew = async () => {
    setLoading(true)
    authInfo.uid && await clearFirebaseFolder(authInfo.uid)
    authInfo.uid && await updateUser(authInfo.uid, {recording: false})
    setLoading(false)
    navigation.navigate(MainStack.PRE_RECORDING)
  }

  return (
    <Screen customHeader={<Header withLogout />}  preset={SCREEN_HEIGHT > 750 ? 'fixed' : 'scroll'}>
      <View style={[styles.container, {paddingBottom: insets.bottom + 40}]}>
        {/* Risk Result Section */}
        <View style={styles.riskSection}>
          <SVGIcon name="risk" size={42} color={getRiskColor(score)} style={styles.riskIcon} />
          <Text preset="headerBold" style={styles.riskTitle}>
            {t('home.answers')}
            <Text preset="headerBold" style={{ color: getRiskColor(score) }}>{t(getRiskText(score))}</Text>
            <Text preset="headerBold"> {t('home.answers2')}</Text>
          </Text>
          <Text preset="small" style={styles.riskDescription}>
            {t(getRiskSubText(score))}
          </Text>
        </View>

        {/* Detailed Feedback Title */}
        <View style={styles.feedbackTitleRow}>
          <Text preset="headerBold" style={styles.feedbackTitle}>{t('home.detailedFeedback')}</Text>
          <TouchableOpacity ref={infoRef} onPress={() => setShowTip(true)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
            <SVGIcon name="info" size={12.5} color={colors.white07} style={styles.feedbackInfoIcon} />
          </TouchableOpacity>
          <InfoTooltip
            anchorRef={infoRef}
            visible={showTip}
            onClose={() => setShowTip(false)}
            text={t('home.detailedFeedbackHelp')}
            placement="bottom"
          />
        </View>

        {/* Feedback Cards Grid */}
        <View style={styles.feedbackGrid}>
          <FlatList
            data={FEEDBACK_CARDS}
            scrollEnabled={false}
            numColumns={2}
            keyExtractor={(x) => x.name}
            columnWrapperStyle={styles.listCtr} // spacing between the 2 columns
            renderItem={renderItem}
          />

          {/* {FEEDBACK_CARDS.map((card) => (
            <TouchableOpacity key={card.label} style={styles.feedbackCard} onPress={() => setShowModal(card.name)}>
              <SVGIcon name={card.icon} size={32} color={card.color} />
              <Text preset="header4" style={[styles.feedbackCardLabel, { color: card.color }]}>{card.label}</Text>
            </TouchableOpacity>
          ))} */}
        </View>

        {/* Bottom Button */}
        {/* {getBtn()} */}
        {/* <View style={{maxHeight: score <= 2 ? 80 : 50}}> */}
          {user.profile?.recording 
          ? <View>
              <TouchableOpacity 
                style={styles.bottomButtonArea} 
                // onPress={() => setShowCleanStorageModal(true)}>
                onPress={handleCleanAndStartNew}> 
                  {loading 
                    ? <Loader /> 
                    : <Text tx='home.newRecording' style={styles.outlinedButtonText}/>}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.bottomButtonArea} 
                onPress={() => navigation.navigate(MainStack.REPORT)}>
                <Text tx='home.reviewRecording' style={styles.outlinedButtonText}/>
              </TouchableOpacity>
            </View>
          : <TouchableOpacity 
              style={styles.bottomButtonArea} 
              onPress={() => navigation.navigate(MainStack.PRE_RECORDING)}>
              <Text text={getBtnText()} style={styles.outlinedButtonText}/>
            </TouchableOpacity>}
            {/* <TouchableOpacity 
                style={styles.bottomButtonArea} 
                onPress={() => authInfo.uid && finishSession(authInfo.uid, 'devsession-1')}>
                <Text text='Finish session' style={styles.outlinedButtonText}/>
              </TouchableOpacity> */}
      </View>
      {/* Feedback Modal */}
      <Modal 
        isVisible={!!showModal}
        style={styles.modalCtr}
        onClose={() => setShowModal(null)}
      >
        <FeedbackModal
          card={FEEDBACK_CARDS.find(card => card.name === showModal)}
        />
      </Modal>
      {/* Clean storage modal */}
      <Modal 
        isVisible={showCleanStorageModal}
        style={styles.modalCtr}
        onClose={() => setShowCleanStorageModal(false)}
      >
        <CleanStorage
        loading={loading}
        onClose={() => setShowCleanStorageModal(false)}
        clearStorage={clearStorage}
        />
      </Modal>
    </Screen>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80
  },
  riskSection: {
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT > 750 ? 34 : 20,
    marginTop: SCREEN_HEIGHT > 750 ? 34 : 10,
    paddingHorizontal: 40
  },
  riskIcon: {
    marginBottom: 16,
  },
  riskTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  riskDescription: {
    color: colors.white07,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 27,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 6,
  },
  feedbackInfoIcon: {
    marginTop: 2,
  },
  listComponentStyle: {
    gap: 15,
    marginBottom: 40,
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40
  },
  feedbackCard: {
    width: (SCREEN_WIDTH - 120 - 15)/2,
    height: ((SCREEN_WIDTH - 120 - 15)/2) * 0.65,
    backgroundColor: colors.primary03,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  feedbackCardLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomButtonArea: {
    borderColor: colors.white,
    borderWidth: 1,
    marginBottom: 20,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
  },
  outlinedButton: {
    borderColor: colors.white,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: 300,
    maxHeight: 60,
  },
  outlinedButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginHorizontal: 20,
    fontFamily: typography.primaryBold
  },
  modalCtr: {
    paddingHorizontal: 41,
    borderRadius: 16,
    maxHeight: '90%'
  },
  listCtr: {
    justifyContent: 'center', 
    gap: 15,
  }
});
