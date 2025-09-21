import React, { FC, JSX, memo, useMemo } from 'react';
import { View } from 'react-native';

import * as S from './styles';
import { Text } from '../text';
import { colors } from 'src/theme';
import { useTranslation } from 'react-i18next';

interface IProgressBarProps {
  currentStep: number
  steps: number
  withText?: boolean
}

const ProgressBar: FC<IProgressBarProps> = ({
  currentStep = 0,
  steps = 0,
  withText = false,
}): JSX.Element => {
  const {t} = useTranslation();
  const progress = useMemo<number>(() => {
    if (currentStep === 0) {
      return 0;
    }

    return (currentStep / steps) * 100;
  }, [currentStep, steps]);

  return (
    <View style={S.MAIN_CONTAINER}>
    <View style={S.CONTAINER}>
      <View
        style={[S.PROGRESS, { width: `${progress}%` }]}
        testID="test_progress"
      />
    </View>
    {withText && <Text
                  preset="small"
                  text={t('profile.question', {step1: currentStep, step2: steps})}
                  color={colors.greyLight}
                  style={S.PROGRESS_TEXT}
                />}
    </View>
  );
};

export default memo(ProgressBar);
