import React from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BlackStatusBar = ({ barStyle = 'light-content' }) => {
    const insets = useSafeAreaInsets();
  
    if (Platform.OS === 'android') {
      return (
        <StatusBar
          translucent={false}   
          backgroundColor="#000" 
        //   barStyle={barStyle}
        />
      );
    }

    return (
      <>
        <View style={{ height: insets.top, backgroundColor: '#000' }} />
        <StatusBar translucent backgroundColor="transparent"  />
      </>
    );
  };