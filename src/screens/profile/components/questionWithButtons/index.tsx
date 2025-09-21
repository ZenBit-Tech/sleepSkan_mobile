import React, { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Button, SVGIcon, Text } from 'src/components';

import * as S from './styles';
import { IQuestion } from '../../firstQuestionary';
import { InfoTooltip } from 'src/screens/home/components';
import { colors } from 'src/theme';
import { useTranslation } from 'react-i18next';

interface IQuestionWithButtons {
  answer: string | boolean | undefined,
  question: IQuestion,
  setAnswer: (answer: string | boolean | undefined) => void
}

export const QuestionWithButtons  = ({answer, question, setAnswer}: IQuestionWithButtons) => {
  const infoRef = useRef(null);
  const [showTip, setShowTip] = useState(false);
  const {t} = useTranslation()

  return (
    <View style={S.GAP}>
      <View style={S.ROW}>
        {question.tooltip && <TouchableOpacity ref={infoRef} style={S.BTN_HEIGHT} onPress={() => setShowTip(true)}>
          <SVGIcon name="info" size={12.5} color={colors.white07} style={S.INFO_ICON} />
        </TouchableOpacity>}
       
        <InfoTooltip
          anchorRef={infoRef}
          visible={showTip}
          withIcon={false}
          onClose={() => setShowTip(false)}
          text={t('profile.alcoholInfo')}
          placement="bottom"
        />
         <Text preset="middleBold" style={S.TEXT_CENTER} tx={question.question} />
      </View>
      <View style={[S.BTNS_CTR, question.buttonsCount === 3 && {height: 170}]}>
        <Button
          onPress={() => setAnswer(question.action1Value)}
          preset={answer === question.action1Value ? 'primary' : 'transparent'}
          tx={question.answers?.[0] as any}
        />
        <Button
          onPress={() => setAnswer(question.action2Value)}
          preset={answer === question.action2Value ? 'primary' : 'transparent'}
          tx={question.answers?.[1] as any}
        />
        {question.buttonsCount && question.buttonsCount === 3 && <Button
          onPress={() => setAnswer(question.action3Value)}
          preset={answer === question.action3Value ? 'primary' : 'transparent'}
          tx={question.answers?.[2] as any}
        />}
      </View>
    </View>
  );
};
