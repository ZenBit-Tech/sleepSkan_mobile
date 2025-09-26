import React, { FC, useEffect, useMemo, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TxKeyPath } from 'src/i18n';

import { Button, Screen } from 'src/components';
import {
  CompleteProfileStack,
} from 'src/constants';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';
import { auth, profileInfo } from 'src/store/selectors';
import MainHeader from 'src/components/mainHeader';
import ProgressBar from 'src/components/progressBar';
import { FIRST_QUESTIONARY_STEPS } from 'src/constants/common';
import { getUser, updateUser } from 'src/db';
import { useAppDispatch } from 'src/store';


import { setProfile } from '../reducer';
import * as S from './styles';
import {
  RenderInstructions,
  QuestionWithButtons,
  QuestionWithInputs,
  QuestionWithDatepicker,
} from '../components';
import { QuestionWithInput } from '../components/neck';



export type IQuestion = {
  type: 'inputs' | 'buttons' | 'datepicker' | 'instruction' | 'multiple' | 'neck',
  question: TxKeyPath,
  label: string,
  answers?: TxKeyPath[] | string[]
  tooltip?: boolean
  additionalQuestion?: TxKeyPath
  buttonsCount?: number
  fieldChange: {
    [key: string]: string | boolean | undefined
  }
  action1Value?: string | boolean
  action2Value?: string | boolean
  action3Value?: string | boolean
}

export const FirstQuestionary: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.FIRST_QUESTIONARY>
> = ({ navigation, route }) => {
  const {t} = useTranslation();
  const { beginning = false } = route.params || {};
  const dispatch = useAppDispatch();

  const {profile} = useSelector(profileInfo);
  const {uid} = useSelector(auth);

  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [answer, setAnswer] = useState<string | boolean| undefined>(undefined);
  const [height, setHeight] = useState<number | string | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [neck, setNeck] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (questionNumber > 1) {
      setQuestionNumber(questionNumber - 1);
    } else {
      navigation.navigate(CompleteProfileStack.START);
    }
  };

  // @ts-ignore
  const questions: IQuestion[] = useMemo(() => [
    { type: 'datepicker',
      label: 'dob',
      question: 'profile.question1',
      answers: [],
      fieldChange: {dob: date?.toISOString()},
    },
    { type: 'buttons',
      label: 'gender',
      question: 'profile.question2',
      answers: ['profile.male', 'profile.female'],
      fieldChange: {gender: answer},
      action1Value: 'male',
      action2Value: 'female',
    },
    { type: 'buttons',
      label: 'tired',
      question: 'profile.question3',
      answers: ['common.yes', 'common.no'],
      fieldChange: {tired: answer},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'loud_snore',
      question: 'profile.question4',
      answers: ['common.yes', 'common.no'],
      fieldChange: {loud_snore: answer},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'stop_breathing',
      question: 'profile.question5',
      answers: ['common.yes', 'common.no'],
      fieldChange: {stop_breathing: answer},
      action1Value: true,
      action2Value: false,
    },
    { type: 'buttons',
      label: 'blood_pressure',
      question: 'profile.question6',
      answers: ['common.yes', 'common.no'],
      fieldChange: {blood_pressure: answer},
      action1Value: true,
      action2Value: false,
    },
    { type: 'inputs',
      label: 'height',
      question: 'profile.question7_1',
      additionalQuestion: 'profile.question7_2',
      fieldChange: {height: height, weight: weight},
    },
    { type: 'instruction',
      label: 'neck_size',
      answers: [],
      question: 'profile.question7_1',
    },
    { type: 'instruction',
      label: 'neck_size',
      answers: [],
      question: 'profile.question7_1',
    },
    { type: 'neck',
      label: 'neck_size',
      question: 'profile.question10',
      answers: ['common.yes', 'common.no'],
      fieldChange: {neck_size: neck},
    },
  ], [answer, date, height, weight, neck]);

  useEffect(() => {
   uid && getUser(uid).then((user) => {
    dispatch(setProfile(user));
   });
  }, [uid, dispatch]);

  useEffect(() => {
    const questionName = questions[questionNumber -1].label
    
    const answer = profile && profile[questionName]
  
    setAnswer(answer)

  }, [questionNumber])

  useEffect(() => {
    if (profile?.first_questionary && !beginning) {
      setQuestionNumber(profile.first_questionary + 1);

    }
  }, [profile?.first_questionary]);

  const renderQuestion = (question: IQuestion) => {

    if (question.type === 'datepicker') {
      return (
        <View style={S.CTR_HEIGHT}>
          <QuestionWithDatepicker
            question={question}
            open={open}
            date={date}
            setOpen={setOpen}
            setDate={setDate}
          />
        </View>
      );
    } else if (question.type === 'buttons') {
      return (
        <View style={S.CTR_HEIGHT}>
          <QuestionWithButtons
            answer={answer}
            question={question}
            setAnswer={setAnswer}
          />
        </View>
      );
    } else if (question.type === 'inputs') {
      return (
        <View style={S.CTR_HEIGHT}>
          <QuestionWithInputs
            question={question}
            height={height}
            weight={weight}
            setHeight={setHeight}
            setWeight={setWeight}
          />
        </View>
      );
    } else if (question.type === 'neck') {
      return (
        <View style={S.CTR_HEIGHT}>
          <QuestionWithInput
            question={question}
            neck={neck}
            setNeck={setNeck}
          />
        </View>
      );
    }
      else if (question.type === 'instruction') {
      return (
        <RenderInstructions first={questionNumber === 8}/>
      );
    }
  };

const sendAnswer = async() => {
  if (uid) {
    setLoading(true)
    if (questions[questionNumber - 1].type === 'instruction') {
      setQuestionNumber(questionNumber + 1);
      setLoading(false)
      return;
    } else if (questionNumber === 10) {
      try {
        await updateUser(uid, {
          first_questionary: 8,
          second_questionary: 0,
          ...questions[questionNumber - 1].fieldChange,
        });
        dispatch(setProfile({
          ...profile,
          first_questionary: 8,
          ...questions[questionNumber - 1].fieldChange}));
          navigation.navigate(CompleteProfileStack.FIRST_QUESTIONARY_RESULT);
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
      }
    
    } else {
      try {
        await updateUser(uid, {
          first_questionary: questionNumber,
          ...questions[questionNumber - 1].fieldChange,
        });
        dispatch(setProfile({
          ...profile,
          first_questionary: questionNumber,
          ...questions[questionNumber - 1].fieldChange}));
          setAnswer(undefined);
          setQuestionNumber(questionNumber + 1);
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
      }
      
    }
    setLoading(false)
  }
};

const getCurrentStep = useMemo(() => {
  if (questionNumber < 8) {
    return questionNumber;
  } else if (questionNumber > 7 && questionNumber < 10) {
    return 7;
  } else {
    return 8;
  }
}, [questionNumber]);

  return (
    <Screen
      preset='scroll'
      customHeader={<MainHeader 
                      withBack  
                      withLogout 
                      handleGoBack={handleBack} />}
                    >
      <ProgressBar currentStep={getCurrentStep} steps={FIRST_QUESTIONARY_STEPS} withText={questionNumber !== 8 && questionNumber !== 9} />
      {(questionNumber === 7 || questionNumber === 10)
      ?   <View style={{flex: 1}}>
          <KeyboardAvoidingView
            style={S.CONTAINER}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {renderQuestion(questions[questionNumber - 1] || 1)}
            <View style={S.BTNS_CTR}>
              <Button onPress={sendAnswer} preset="transparent" tx="common.next" />
            </View>

          </KeyboardAvoidingView>
      </View>
      : <View style={S.CONTAINER}>
        
          {renderQuestion(questions[questionNumber - 1] || 1)}

        <View style={S.BTNS_CTR}>
          <Button 
            onPress={sendAnswer} 
            preset="transparent" 
            tx="common.next" 
            pending={loading} 
            disabled={loading}/>
        </View>
      </View>}
     </Screen>
  );
};
