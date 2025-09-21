import React, { FC, JSX, memo } from 'react';
import { Image, ImageSourcePropType, ImageStyle, View, Text as RNText } from 'react-native';

import { colors, typography } from 'src/theme';
import { Button, ProgressBar, Text } from 'src/components';
import { ONBOARDING_STEPS } from 'src/constants/common';
import { TxKeyPath } from 'src/i18n';

import * as S from './styles';
import { useTranslation } from 'react-i18next';
import { Bubble } from '../bubble';


interface IStepsProps {
  currentStep: 1 | 2 | 3 | 4,
  image?: ImageSourcePropType
  text1?: TxKeyPath
  text2?: TxKeyPath
  percents?: string
  preText1?: TxKeyPath
  postText1?: TxKeyPath
  withBubble?: boolean
  imageStyle: ImageStyle
  children?: React.JSX.Element
  pressNext: () => void
}

const Steps: FC<IStepsProps> = ({ currentStep = 1, image, text1, text2, percents, preText1, postText1, withBubble=false, imageStyle, children, pressNext }): JSX.Element => {

  const {t} = useTranslation()
  return (
    <>
    <ProgressBar currentStep={currentStep} steps={ONBOARDING_STEPS} />
    
    <View style={S.CONTAINER}>
      
      {(text1 || percents) && <View style={S.MAIN}>
        {!!text1 && (withBubble 
        ? <Bubble>
            <Text preset="headerBold" color={colors.white} tx={text1} style={S.TEXT_CENTER}/> 
          </Bubble>
          : <Text preset="headerBold" color={colors.white} tx={text1} style={S.TEXT_CENTER}/>)}
       {!!image && <Image
          style={[S.IMAGE, imageStyle]}
          resizeMode="contain"
          source={image}
        />}
        {!!percents && 
        <Text style={{ lineHeight: 36, textAlign: 'center', includeFontPadding: false }}>
          {!!preText1 && <RNText style={S.PRE_TEXT}>{t(preText1)} </RNText>}
          <Text preset="bigBold" text={percents} />
          {!!postText1 && <Text preset="headerBold" tx={postText1} />}
        </Text>}

        <Text
            style={[S.TEXT_CENTER, !!percents && {
              fontSize: 20,
              lineHeight: 24,
              textAlign: 'center',
              includeFontPadding: false,
              color: colors.white,
              marginTop: 0,
            }]}
            preset="headerBold"
            color={colors.white}
            tx={text2}
          />     
      </View>}

      {children ? <View>{children}</View> : null}
      <View style={S.BUTTON_CTR}>
        <Button
          preset="transparent"
          onPress={pressNext}
          tx="common.next"
        />
      </View>
    </View>
    </>
  );
};
export default memo(Steps);
