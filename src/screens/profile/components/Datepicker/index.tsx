import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';

import { Text } from 'src/components';
import { colors } from 'src/theme';

import * as S from './styles';
import { IQuestion } from '../../firstQuestionary';



interface IQuestionWithDatepicker {
  question: IQuestion,
  open: boolean,
  date: Date | null,
  setOpen: (open: boolean) => void,
  setDate: (date: Date) => void,
}

export const QuestionWithDatepicker  = ({question, open, date, setOpen, setDate}: IQuestionWithDatepicker) => {
const {t} = useTranslation();

const now = new Date();
const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return (
    <View style={S.GAP}>
      <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      <TouchableOpacity style={S.DATE_PICKER_CONTAINER} onPress={() => setOpen(true)}>
        <Text text={date ? dayjs(date).format('DD.MM.YYYY') : t('profile.selectDob')} color={colors.black}/>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={date || new Date()}
        mode="date"
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}    
        maximumDate={endOfYear}
        locale="pt"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};
