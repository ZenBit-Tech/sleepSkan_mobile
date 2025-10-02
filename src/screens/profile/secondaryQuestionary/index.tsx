import React, { FC, useEffect, useMemo, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { Button, Screen } from 'src/components';
import {
  CompleteProfileStack,
  MainTabs,
} from 'src/constants';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import { auth, profileInfo } from 'src/store/selectors';
import MainHeader from 'src/components/mainHeader';
import ProgressBar from 'src/components/progressBar';
import { SECOND_QUESTIONARY_STEPS } from 'src/constants/common';
import { getUser, updateUser } from 'src/db';
import { useAppDispatch } from 'src/store';
import { COFFEE_VARIANTS, SLEEP_VARIANTS, TOBACCO_VARIANTS } from 'src/models';

import { setProfile } from '../reducer';
import {
  QuestionWithButtons,
  QuestionWithCheckboxes,
} from '../components';
import { BTNS_CTR, CONTAINER, CTR_HEIGHT } from './styles';
import { IQuestion } from '../firstQuestionary';


export const SecondaryQuestionary: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.SECOND_QUESTIONARY>
> = ({ navigation, route }) => {

  const { beginning = false } = route.params || {};
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {profile} = useSelector(profileInfo);
  const {uid} = useSelector(auth);

  const [questionSecondaryNumber, setQuestionSecondaryNumber] = useState<number>(1);
  const [answerSecondary, setAnswerSecondary] = useState<string | boolean| undefined>(undefined);
  const [medicines, setMedicines] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (questionSecondaryNumber > 1) {
      setQuestionSecondaryNumber(questionSecondaryNumber - 1);
    } else {
      navigation.navigate(CompleteProfileStack.FIRST_QUESTIONARY_RESULT);
    }
  };

  const questions: IQuestion[] = useMemo(() => [
    { type: 'buttons',
      label: 'diabetes',
      question: 'profile.question11',
      buttonsCount: 2,
      answers: ['common.yes', 'common.no'],
      fieldChange: {diabetes: answerSecondary},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'alcohol',
      question: 'profile.question12',
      buttonsCount: 2,
      answers: ['common.yes', 'common.no'],
      fieldChange: {alcohol: answerSecondary},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'alcohol_per_day',
      question: 'profile.question13',
      buttonsCount: 2,
      tooltip: true,
      answers: ['common.yes', 'common.no'],
      fieldChange: {alcohol_per_day: answerSecondary},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'tobacco',
      question: 'profile.question14',
      buttonsCount: 3,
      answers: ['common.yes', 'common.no', 'profile.dropSmoking'],
      fieldChange: {tobacco: answerSecondary},
      action1Value: TOBACCO_VARIANTS.YES,
      action2Value: TOBACCO_VARIANTS.NO,
      action3Value: TOBACCO_VARIANTS.EX_SMOKER,
    },
    { type: 'buttons',
      label: 'coffee',
      question: 'profile.question15',
      buttonsCount: 3,
      answers: ['0-2', '3-4', '5+'],
      fieldChange: {coffee: answerSecondary},
      action1Value: COFFEE_VARIANTS.SMALL,
      action2Value: COFFEE_VARIANTS.MEDIUM,
      action3Value: COFFEE_VARIANTS.ALOT,
    },
    { type: 'buttons',
      label: 'sleep_hours',
      question: 'profile.question16',
      buttonsCount: 3,
      answers: ['profile.lessSleep', 'profile.moreSleep', 'profile.moreSleep2'],
      fieldChange: {sleep_hours: answerSecondary},
      action1Value: SLEEP_VARIANTS.NOT_ENOUGH,
      action2Value: SLEEP_VARIANTS.ENOUGH,
      action3Value: SLEEP_VARIANTS.TOO_MUCH,
    },
    { type: 'multiple',
      label: 'medicines',
      question: 'profile.question17',
      fieldChange: {medicines: medicines, isProfileComplete: true},
      answers: ['profile.med1', 'profile.med2', 'profile.med3', 'profile.med4', 'profile.med5', 'profile.med6', 'profile.noMed'],
    },

  ], [answerSecondary, medicines]);

  useEffect(() => {
   uid && getUser(uid).then((user) => {
    dispatch(setProfile(user));
   });
  }, [uid, dispatch]);

  useEffect(() => {
    if (profile?.second_questionary && !beginning) {
      setQuestionSecondaryNumber(profile.second_questionary + 1);
    }
  }, [profile?.first_questionary, beginning]);

  useEffect(() => {
    const questionName = questions[questionSecondaryNumber -1].label
    
    const answer = profile && profile[questionName]
 
    setAnswerSecondary(answer)

  }, [questionSecondaryNumber])


  const renderQuestion = (question: IQuestion) => {

    if (question.type === 'buttons') {
      return (
        <View style={[CTR_HEIGHT, question.buttonsCount === 2 && {paddingBottom: 55}]}>
          <QuestionWithButtons
            answer={answerSecondary}
            question={question}
            setAnswer={setAnswerSecondary}
          />
        </View>
      );
    } else if (question.type === 'multiple') {
      return (
       <QuestionWithCheckboxes
        question={question}
        selected={medicines}
        setSelected={setMedicines}
       />
      );
    }
  };
const sendAnswer = async() => {
  if (uid) {
    try {
      setLoading(true)
      await updateUser(uid, {
        second_questionary: questionSecondaryNumber,
        ...questions[questionSecondaryNumber - 1].fieldChange,
      });
      dispatch(setProfile({
        ...profile,
        second_questionary: questionSecondaryNumber,
        ...questions[questionSecondaryNumber - 1].fieldChange}));
        setAnswerSecondary(undefined);
        setQuestionSecondaryNumber(questionSecondaryNumber + 1);
        questionSecondaryNumber === 7 && navigation.navigate<any>('Main_Tabs', {
          screen:MainTabs.HOME,
        });
        setLoading(false)
    } catch (error) {
       //@ts-ignore
       const message = error?.message || '';
       if (message.includes('Unsupported field value: undefined')) {
          Toast.show({
            type: 'error',
            text1: t('errors.requiredFieldMissing'),
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('errors.wrong'),
          });
        }
        setLoading(false)
    }
  }
};


  return (
    <Screen
      preset='scroll'
      customHeader={<MainHeader withBack withLogout handleGoBack={handleBack} />}
     >
      <ProgressBar currentStep={questionSecondaryNumber} steps={SECOND_QUESTIONARY_STEPS} withText />
      <View style={[CONTAINER, {marginBottom: insets.bottom + 20}]}>   
       {renderQuestion(questions[questionSecondaryNumber - 1] || 1)}
        <View style={BTNS_CTR}>
          <Button 
            onPress={sendAnswer} 
            preset="transparent" 
            pending={loading} 
            disabled={loading}
            tx={questionSecondaryNumber === 7 ? "profile.getResults" : "common.next"} 
          />
        </View>
      </View>
     </Screen>
  );
};
