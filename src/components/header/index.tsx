import React, { FC, JSX, memo, useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from 'src/theme';
import { logoutFirebase } from 'src/services';

import { SVGIcon } from '../svg-icon';
import * as S from './styles'
import { Text } from '../text';
import { TxKeyPath } from 'src/i18n';


interface IMainHeaderProps {
  withBack?: boolean;
  title?: TxKeyPath;
  rightButton?: string;
  rightIcon?: boolean;
  titleIcon?: boolean;
  products?: number;
  shareShop?: boolean;
  small?: boolean;
  withLogout?: boolean;
  withTitle?: boolean;
  onRightIconPress?: () => void;
  goToCart?: () => void;
  handleGoBack?: () => void;
  onPress?: () => void;
}

const Header: FC<IMainHeaderProps> = ({
  rightButton,
  rightIcon,
  withLogout,
  withBack,
  withTitle,
  title,
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

        {withTitle && <Text preset='middleBold' style={S.CENTER_TEXT} tx={title} />}

        {withLogout && <TouchableOpacity
          onPress={() => logoutFirebase()}
          style={S.LOGOUT_CTR}
        >
          <SVGIcon name="logout" size={24} color={colors.beige} />
        </TouchableOpacity>}
    </View>

    
  );
};
export default memo(Header);
