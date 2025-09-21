import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';

import * as S from './styles'
import { Text } from 'src/components';

export const CountdownTimer = ({ initialMinutes = 10, onFinish }: { initialMinutes?: number; onFinish?: () => void }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} min`;
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={S.CONTAINER}>
      <Text style={S.TIMER_TEXT}>{formatTime(secondsLeft)}</Text>
    </View>
  );
};