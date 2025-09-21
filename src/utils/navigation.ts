import { StackCardInterpolationProps } from "@react-navigation/stack";
import { Easing } from "react-native";

export const SLOW_OPEN = {
    animation: 'timing' as const,
    config: {
      duration: 620,                          // slower open
      easing: Easing.bezier(0.22, 1, 0.36, 1) // smooth ease-out
    },
  };
  
  export const SLOW_CLOSE = {
    animation: 'timing' as const,
    config: {
        duration: 520,                          // slightly faster close
        easing: Easing.bezier(0.4, 0, 0.2, 1),  // material-ish ease-in-out
    },
  };
  
  // Soft slide+fade+scale
  export const softCardInterpolator = ({ current, layouts }: StackCardInterpolationProps) => {
    const { progress } = current;
    const width = layouts.screen.width;
  
    return {
        cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.12, 1], // longer cross-fade
            }),
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width * 0.06, 0], // small slide distance
                }),
              },
              {
                // tiny scale avoids the “zoom” feeling but softens motion
                scale: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.995, 1],
                }),
              },
            ],
          },
          overlayStyle: {
            // a little more overlay makes the motion feel calmer
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.06],
            }),
          },
        };
  };