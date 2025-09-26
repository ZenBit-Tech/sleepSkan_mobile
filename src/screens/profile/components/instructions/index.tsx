import React from 'react';
import { Image, View } from 'react-native';

import { Text } from 'src/components';

import * as S from './styles';
import { NECK_SIZE_IMG } from 'src/constants';




export const RenderInstructions  = ({first}: {first: boolean}) => {

  return (
<View>
      {first ? (
        <View style={S.CTR_HEIGHT}>
          <Text preset="middleBold" style={S.TEXT_CENTER} tx="profile.question8" />
        </View>
      ) : (
        <View style={S.INSTRUCTIONS_CONTAINER}>
          <Text preset="middleBold" style={[S.TEXT_CENTER, {lineHeight: 26}]} tx="profile.question9" />
          <Image source={NECK_SIZE_IMG} style={S.IMAGE} />
          <View style={S.LIST_STYLE}>
          <Text>
            {'\u2022 '}<Text preset="small" style={S.INSTRUCTIONS_TEXT} tx="profile.question9_1" />
          </Text>
          <Text>
            {'\u2022 '}<Text preset="small" style={S.INSTRUCTIONS_TEXT} tx="profile.question9_2" />
          </Text>
          <Text>
            {'\u2022 '}<Text  preset="small" style={S.INSTRUCTIONS_TEXT} tx="profile.question9_3" />
          </Text>
          <Text>
            {'\u2022 '}<Text preset="small" style={S.INSTRUCTIONS_TEXT} tx="profile.question9_4" />
          </Text>
          </View>
        </View>
      )}
        </View>
  );
};
