import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TxKeyPath } from 'src/i18n';
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

// const [heightError, setHeightError] = useState<TxKeyPath | null>(null);

console.log('neck', neck)

const handleChange = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const valid = cleaned.replace(/(\..*)\./g, '$1');
  const size = Number(valid)
  // if (valid.includes('.')) {
  //   setHeight(valid);
  // } else if (valid.length >= 3) {
  //   const m = (valid.slice(0, -2).replace(/^0+(?=\d)/, '') || '0');
  //   const cm = valid.slice(-2);
  //   setHeight(`${m}.${cm}`);
  // } else {
    setNeck(size);
  // }
};

// const toCm = (s: string): number | null => {
//   if (!s) return null;
//   const x = Number(s.replace(',', '.'));
//   if (Number.isNaN(x)) return null;
//   return s.includes('.') ? x * 100 : x;
// };

// const handleBlur = () => {
//   const cm = height && toCm(height?.toString());
//   if (cm == null) return;
//   setHeightError(cm && cm < 50 ? 'errors.heightError' : null);
// };

  return (
    <View style={S.GAP}>
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      <Input
        value={neck?.toString()}
        onChangeText={handleChange}
        // onBlur={handleBlur}
        placeholder={`${t('profile.height')}`}
        textContentType="oneTimeCode"
        autoCorrect={false}
        numberOfLines={2}
        spellCheck={false}
        // styleContainer={heightError ? S.ERROR_INPUT : undefined}
        keyboardType="decimal-pad"
      />
    </View>
  );
};
