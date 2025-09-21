import React, { FC } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { FlatList, Image, ImageSourcePropType, View } from 'react-native';

import { MainHeader, Screen, Text } from 'src/components';
import {
  BRAIN_IMG,
  CompleteProfileStack,
  DEATH_IMG,
  ENERGY_HEART_IMG,
  HEART_IMG,
  LIVER_IMG,
  SYRINGE_IMG,
} from 'src/constants';
import { TxKeyPath } from 'src/i18n';

import { Steps } from '../components';
import * as S from './styles';
import { CompleteProfileStackList } from 'src/navigation/complete-profile-stack';

type IBlock = {
  tx: TxKeyPath,
  image: ImageSourcePropType
}

const blocks: IBlock[] = [
  {
    tx: 'onboarding.block1',
    image: HEART_IMG,
  },
  {
    tx: 'onboarding.block2',
    image: SYRINGE_IMG,
  },
  {
    tx: 'onboarding.block3',
    image: BRAIN_IMG,
  },
  {
    tx: 'onboarding.block4',
    image: ENERGY_HEART_IMG,
  },
  {
    tx: 'onboarding.block5',
    image: LIVER_IMG,
  },
  {
    tx: 'onboarding.block6',
    image: DEATH_IMG,
  },
];

export const Step4Screen: FC<
  StackScreenProps<CompleteProfileStackList, CompleteProfileStack.STEP4>
> = ({navigation}) => {
  const handleEndOnboarding = () => {
    navigation.navigate(CompleteProfileStack.START);
  };

  const renderSectionBlock = ({item}: {item: IBlock}) => {
    return (
    <View style={S.BLOCK}>
      {item && item.image && <Image
        style={S.IMAGE}
        resizeMode="contain"
        source={item.image}
      />}
      {item && !!item.tx && <Text tx={item.tx} style={S.CENTER_TEXT} />}
    </View>);
  };

  return (
    <Screen
      customHeader={ <MainHeader withBack  withLogout/>}
    >
      <Steps
        currentStep={4}
        key="grid"
        // text1="onboarding.step4Title"
        imageStyle={S.IMAGE_STYLE}
        children={<FlatList
          data={blocks}
          ListHeaderComponent={<Text  preset="headerBold" tx="onboarding.step4Title" style={{marginBottom: 20}} />}
          keyExtractor={block => block.tx}
          renderItem={renderSectionBlock}
          numColumns={2}
          columnWrapperStyle={S.GAP}
          contentContainerStyle={S.LIST_CTR}
        />}
        pressNext={handleEndOnboarding}
      />
    </Screen>
  );
};
