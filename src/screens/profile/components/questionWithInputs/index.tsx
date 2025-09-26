import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Input, Text } from 'src/components';

import * as S from './styles';
import { IQuestion } from '../../firstQuestionary';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/theme';
import { TxKeyPath } from 'src/i18n';

interface IQuestionWithInputs {
  question: IQuestion,
  height: number | string |undefined,
  weight: number | undefined,
  setHeight: (height: number | string) => void,
  setWeight: (weight: number | undefined) => void,
}

export const QuestionWithInputs  = ({question, height, weight, setHeight, setWeight}: IQuestionWithInputs) => {
const {t} = useTranslation();

const [heightError, setHeightError] = useState<TxKeyPath | null>(null);
const [weightText, setWeightText] = useState('');

const handleChange = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const valid = cleaned.replace(/(\..*)\./g, '$1');
  if (valid.includes('.')) {
    setHeight(valid);
  } else if (valid.length >= 3) {
    const m = (valid.slice(0, -2).replace(/^0+(?=\d)/, '') || '0');
    const cm = valid.slice(-2);
    setHeight(`${m}.${cm}`);
  } else {
    setHeight(valid);
  }
};

const toCm = (s: string): number | null => {
  if (!s) return null;
  const x = Number(s.replace(',', '.'));
  if (Number.isNaN(x)) return 1;
  return s.includes('.') ? x * 100 : x;
};

const handleBlur = () => {
  const cm = height && toCm(height?.toString());
  if (cm == null) return;
  setHeightError(cm && cm < 50 ? 'errors.heightError' : null);
};

const onWeightChange = (value: string) => {
  const v = value.replace(',', '.');
  if (v === '') { setWeightText(''); setWeight(undefined); return; }
  if (!/^\d*\.?\d*$/.test(v)) return;     // keep only digits + one dot
  setWeightText(value);                    // keep original text
  setWeight(v === '' ? undefined : Number(v));
}

  return (
    <View style={S.GAP}>
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      <Input
        value={height?.toString()}
        onChangeText={handleChange} 
        onBlur={handleBlur}
        placeholder={`${t('profile.height')}`}
        textContentType="oneTimeCode"
        autoCorrect={false}
        numberOfLines={2}
        spellCheck={false}
        styleContainer={heightError ? S.ERROR_INPUT : undefined}
        keyboardType="decimal-pad"
      />
      {!!heightError ? <Text preset='small' tx={heightError} style={S.ERROR_TEXT}/> : null}
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.additionalQuestion} />
      <Input
        value={weightText}
        onChangeText={onWeightChange}
        placeholder={`${t('profile.weight')}`}
        textContentType="oneTimeCode"
        autoCorrect={false}
        spellCheck={false}
        keyboardType="number-pad"
      />
    </View>
  );
};
