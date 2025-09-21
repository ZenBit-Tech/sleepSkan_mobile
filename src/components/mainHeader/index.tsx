import React, { FC, JSX, memo, useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from 'src/theme';

import * as S from './styles';
import { SVGIcon } from '../svg-icon';
import { Text } from '../text';
import { CLOUD_IMG, HEADER_IMG } from 'src/constants';
import { logoutFirebase } from 'src/services';

interface IMainHeaderProps {
  withBack?: boolean;
  title?: string;
  rightButton?: string;
  rightIcon?: boolean;
  titleIcon?: boolean;
  products?: number;
  shareShop?: boolean;
  small?: boolean;
  withLogout?: boolean;
  onRightIconPress?: () => void;
  goToCart?: () => void;
  handleGoBack?: () => void;
  onPress?: () => void;
}

const MainHeader: FC<IMainHeaderProps> = ({
  rightButton,
  rightIcon,
  withBack,
  small,
  withLogout,
  handleGoBack,
}): JSX.Element => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View
      style={[
        S.CONTAINER,
        !!rightIcon && S.CONTAINER_WITH_ICON,
        !!rightButton && S.CONTAINER_WITH_ICON,
      ]}
    >
        {withBack && <TouchableOpacity
          onPress={handleGoBack ? handleGoBack : handleBack}
          style={S.BACK_CTR}
        >
          <SVGIcon name="arrowBack" size={24} color={colors.white} />
        </TouchableOpacity>}

        <View style={S.CENTER_CTR}>
          <Image
            style={S.IMAGE_CTR}
            resizeMode="contain"
            source={HEADER_IMG}
          />
        </View>

        {withLogout && <TouchableOpacity
          onPress={() => logoutFirebase()}
          style={S.LOGOUT_CTR}
        >
          <SVGIcon name="logout" size={24} color={colors.beige} />
        </TouchableOpacity>}
    </View>

    
  );
};
export default memo(MainHeader);
