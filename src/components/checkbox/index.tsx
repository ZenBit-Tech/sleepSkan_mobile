import React, { FC, JSX, memo } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from 'src/theme';

import { SVGIcon } from '../svg-icon';
import * as S from './styles';

interface ICheckboxProps {
  value: boolean
  onChange: () => void
  size?: number
  disabled?: boolean
}

const Checkbox: FC<ICheckboxProps> = ({
  value = false,
  size = 15,
  onChange = () => {},
  disabled = false,
}): JSX.Element => {
  return (
    <TouchableOpacity onPress={onChange} disabled={disabled} style={[
      S.CONTAINER,
      {
        width: size + 5,
        height: size + 5,
      },
    ]}>
        {value && <SVGIcon name="check" size={size} color={colors.primary} />}
    </TouchableOpacity>
  );
};

export default memo(Checkbox);
