import React, { FC, JSX, memo } from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import { t } from 'i18next';

import { colors } from 'src/theme';
import { Text, SVGIcon } from 'src/components';
import { IconTypes } from 'src/components/svg-icon/icons';
import { TxKeyPath } from 'src/i18n';

import * as S from './styles';

interface IInputProps extends TextInputProps {
  disabled?: boolean
  placeholder?: string
  placeholderTx?: TxKeyPath
  styleContainer?: ViewStyle
  inputStyle?: ViewStyle
  label?: string
  limit?: number
  leftIcon?: IconTypes
  leftIconColor?: string
  rightIcon?: IconTypes
  rightIconColor?: string
  onPressRightIcon?: () => void
  errorMessage?: string
  rightIconWidth?: number
  rightIconHeight?: number
}

const Input: FC<IInputProps> = ({
  disabled = false,
  placeholder = '',
  placeholderTx,
  styleContainer,
  inputStyle,
  label,
  errorMessage,
  limit,
  leftIcon,
  leftIconColor = colors.black,
  rightIcon,
  rightIconColor = colors.black,
  keyboardType,
  onPressRightIcon = () => {},
  rightIconWidth,
  rightIconHeight,
  ...rest
}): JSX.Element => {
  const inputStyles = [S.INPUT, inputStyle];

  const i18nPlaceholder = placeholderTx ? t(placeholderTx) : placeholder;

  return (
    <View>
      {disabled && <View style={S.DISABLE_AREA} testID="test_disabledArea" />}
      {!!label && (
        <View style={S.LABEL_CTR}>
          <Text
            preset={'header5'}
            text={label}
            color={errorMessage ? colors.red : colors.white}
          />
        </View>
      )}
      <View
        style={[S.CONTAINER, styleContainer, !!errorMessage && S.CTR_ERROR]}
      >
        {!!leftIcon && (
          <View style={S.MR_3}>
            <SVGIcon name={leftIcon} color={leftIconColor} />
          </View>
        )}
        <View style={S.INPUT_CTR}>
          <TextInput
            autoCapitalize="none"
            {...rest}
            selectionColor={colors.black}
            maxLength={limit}
            style={inputStyles}
            placeholder={i18nPlaceholder}
            placeholderTextColor={colors.black}
            keyboardType={keyboardType}
            testID="test_input"
          />
        </View>
        {!!rightIcon && (
          <Pressable
            style={S.ML_3}
            onPress={onPressRightIcon}
            testID="input-right-btn"
          >
            <SVGIcon
              width={rightIconWidth}
              height={rightIconHeight}
              name={rightIcon}
              color={rightIconColor}
            />
          </Pressable>
        )}
      </View>
      {!!errorMessage && (
        <View style={S.ERROR_CTR}>
          <Text
            style={S.ERROR}
            text={errorMessage}
            color={colors.red}
            testID="test_error"
          />
        </View>
      )}
    </View>
  );
};

export default memo(Input);
