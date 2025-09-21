import * as React from 'react';
import { Image, ImageBackground, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BG, BOTTOM_TAB_HEIGHT, CLOUD_IMG } from 'src/constants';

import { isNonScrolling, presets } from './screen.presets';
import { ScreenProps } from './screen.props';
import { colors, typography } from 'src/theme';
import { Text } from '../text';
// import { BlackStatusBar } from '../statusBar';

const ScreenWithoutScrolling = (props: ScreenProps) => {
  const {withCloud=true, small=false} = props
  const preset = presets.fixed;
  const insets = useSafeAreaInsets();
  const style = props.style || {};

  return (
    <View style={[preset.outer, props.styleOuter]}>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <StatusBar barStyle={props.statusBar || 'light-content'} />
      <ImageBackground
            resizeMode="stretch"
            style={[
              preset.inner,
              style,
              {
                // paddingTop:  insets.top,
                // paddingTop: !props.customHeader
                //   ? props.withoutTopInsets
                //     ? 0
                //     : insets.top
                //   : 0,
                paddingBottom: insets.bottom,
                marginBottom: props.withBottomInsets
                  ? insets.bottom
                  : props.withBottomNavSpacing
                  ? BOTTOM_TAB_HEIGHT
                  : 0,
                backgroundColor: colors.black
              },
            ]}
            source={BG}
          >
            {props.customHeader}
            
        {props.children}
      </ImageBackground>
    </View>
  );
};

const ScreenWithScrolling = (props: ScreenProps) => {
  const {withCloud=true, small=false} = props
  const preset = presets.scroll;
  const insets = useSafeAreaInsets();
  const style = props.style || {};

  return (
    <View style={[preset.outer, props.styleOuter]}>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <StatusBar barStyle={props.statusBar || 'light-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          preset.inner,
          {
            // paddingTop:  insets.top,
            // paddingTop: !props.customHeader
            //   ? props.withoutTopInsets
            //     ? 0
            //     : insets.top
            //   : 0,
            paddingBottom: insets.bottom,
            marginBottom: props.withBottomInsets
              ? insets.bottom
              : props.withBottomNavSpacing
              ? BOTTOM_TAB_HEIGHT
              : 0,
            backgroundColor: 'black'
          },
        ]}
        contentContainerStyle={[preset.inner, style]}
        keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || 'handled'}
        testID="test_scrollScreen"
        refreshControl={props.refreshControl}
      >
        <ImageBackground
          resizeMode="stretch"
          style={{backgroundColor: colors.black,
            flex: 1, }}
          source={BG}
        >
            {props.customHeader}

        {props.children}
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export const Screen = (props: ScreenProps) => {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />;
  } else {
    return <ScreenWithScrolling {...props} />;
  }
};
