import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Checkbox, Text } from 'src/components';
import { TxKeyPath } from 'src/i18n';

import * as S from './styles';
import { IQuestion } from '../../firstQuestionary';


interface IQuestionWithCheckboxes {
  question: IQuestion,
  selected: number[],
  setSelected: (selected: number[]) => void,
}

export const QuestionWithCheckboxes  = ({question, selected, setSelected}: IQuestionWithCheckboxes) => {

  // const [selected, setSelected] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<number[]>([]);

useEffect(() => {
  if (selected.length === 0) {
    setDisabled([]);
  } else {
    if (selected.includes(6)) {
      setDisabled([0, 1, 2, 3, 4, 5]);
    } else {
      setDisabled([6]);
    }
  }
}, [selected]);

  const handleChange = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((item) => item !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const renderBlock = (text: TxKeyPath, index: number) => {
    return (
      <TouchableOpacity 
        style={[S.BLOCK, disabled.includes(index) && S.INACTIVE_BLOCK]} 
        disabled={disabled.includes(index)}  
        onPress={() => handleChange(index)} 
        key={index}>
        <Text preset="small" style={S.TEXT} tx={text} />
        <Checkbox value={selected.includes(index)} onChange={() => handleChange(index)} disabled={disabled.includes(index)} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={S.GAP}>
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      <Text preset="small" style={[S.TEXT_CENTER, {marginTop: -14}]} tx='profile.medSubtext' />
      <View style={S.BLOCKS_CTR}>
        {question.answers && question.answers.map((answer, index) => renderBlock(answer as any, index))}
      </View>
    </View>
  );
};
