// Bubble.tsx
import React from 'react';
import { Text, View } from 'react-native';

import * as S from './styles';

interface BubbleProps {
  children: React.ReactNode;
}

export const Bubble: React.FC<BubbleProps> = ({ children }) => (
  <View style={S.WRAP}>
    <View style={[S.BOX,]}>
    {React.Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number'
          ? <Text>{child}</Text>
          : child
      )}

    </View>
    <View
      style={S.TAIL}
    />
  </View>
);

