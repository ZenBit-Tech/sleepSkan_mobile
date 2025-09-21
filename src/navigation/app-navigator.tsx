import React, { useCallback, useEffect, useState } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  Theme,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import { View } from 'react-native';

import { auth, profileInfo } from 'src/store/selectors';
import { getUser } from 'src/db';

import { Auth_stack } from './auth-stack';
import { Main_Stack, navigationRef } from './main-stack';
import { Loader, Screen, toastConfig } from '../components';
import { Complete_profile_stack } from './complete-profile-stack';
import * as S from './styles'



const theme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    // background: colors.primary,
  },
};

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  const authInfo = useSelector(auth);
  const { profile } = useSelector(profileInfo);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (isInitializing) {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (user?.uid) {
      setLoading(true)
      getUser(authInfo?.uid as string);
      setLoading(false)
    }
  }, [user?.uid]);

  const renderStacks = useCallback(() => {
   

    if (authInfo?.uid) {
      if (loading) return <LoadingScreen />
      if (profile?.isProfileComplete) {
        return <Main_Stack />;
      } else {
        return <Complete_profile_stack />;
      }
    } else {
      return <Auth_stack />;
    }
  }, [authInfo, profile]);

  return (
    <NavigationContainer 
      theme={theme} 
      ref={navigationRef}
     >
      {renderStacks()}
      <Toast topOffset={insets.top + 14} config={toastConfig} />
    </NavigationContainer>
  );
};

const LoadingScreen = () => {
  return (
    <Screen withCloud={false}>
      <View style={S.CONTAINER}>
        <Loader size={100} />
      </View>
    </Screen>
  )
}