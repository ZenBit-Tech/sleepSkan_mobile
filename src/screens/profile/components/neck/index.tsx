import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Input, Text } from 'src/components';

import { IQuestion } from '../../firstQuestionary';
import * as S from './styles'


interface IQuestionWithInputs {
  question: IQuestion,
  neck: number | undefined,
  setNeck: (neck: number) => void,
}

export const QuestionWithInput  = ({question, neck, setNeck}: IQuestionWithInputs) => {
const {t} = useTranslation();

const handleChange = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const valid = cleaned.replace(/(\..*)\./g, '$1');
  const size = Number(valid)
    setNeck(size);
};

  return (
    <View style={S.GAP}>
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      <Input
        value={neck?.toString()}
        onChangeText={handleChange}
        placeholder={`${t('profile.height')}`}
        textContentType="oneTimeCode"
        autoCorrect={false}
        numberOfLines={2}
        spellCheck={false}
        keyboardType="decimal-pad"
      />
    </View>
  );
};
