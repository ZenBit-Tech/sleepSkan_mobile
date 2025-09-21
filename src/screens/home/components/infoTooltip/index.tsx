import React, { RefObject, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  useWindowDimensions,
  StyleSheet,
  type View as RNView,
} from 'react-native';
import { SVGIcon, Text } from 'src/components';
import { colors } from 'src/theme';

type Props = {
  anchorRef: RefObject<RNView | null>;
  visible: boolean;
  withIcon?: boolean
  onClose: () => void;
  text: string;
  placement?: 'top' | 'bottom';
  maxWidth?: number;
};

export const InfoTooltip: React.FC<Props> = ({
  anchorRef,
  visible,
  withIcon=true,
  onClose,
  text,
  placement = 'bottom',
  maxWidth = 260,
}) => {
  const { width: screenW } = useWindowDimensions();
  const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    if (!visible) return;
    // measure the anchor when showing
    anchorRef.current?.measureInWindow?.((x, y, w, h) => {
      setAnchor({ x, y, w, h });
    });
  }, [visible, anchorRef]);

  if (!visible) return null;

  const margin = 8;
  const bubbleW = Math.min(maxWidth, screenW - margin * 2);
  const centerX = anchor.x + anchor.w / 2;
  const bubbleLeft = Math.min(
    Math.max(centerX - bubbleW / 2, margin),
    screenW - bubbleW - margin
  );

  // bubble top based on placement
  const bubbleTop =
    placement === 'bottom'
      ? anchor.y + anchor.h + 12
      : Math.max(anchor.y - 12 - 48 /* min bubble height guess */, margin);

  // arrow position (relative to screen, not inside bubble)
  const arrowSize = 12;
  const arrowLeft = Math.min(
    Math.max(centerX - arrowSize / 2, bubbleLeft + 12),
    bubbleLeft + bubbleW - 12 - arrowSize
  );
  const arrowTop =
    placement === 'bottom' ? bubbleTop - arrowSize / 2 : bubbleTop + 48 - arrowSize / 2; // adjust later

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} style={styles.whiteBg}>
      {/* Tap outside to close */}
      <Pressable style={styles.backdrop} onPress={onClose} >
        {/* Arrow */}
        <View
          pointerEvents="none"
          style={[
            styles.arrow,
            {
              left: arrowLeft,
              top:
                placement === 'bottom'
                  ? bubbleTop - arrowSize / 2
                  : bubbleTop + 4 /* tiny offset below bubble */,
              transform: [
                { rotate: '45deg' },
                { translateY: placement === 'bottom' ? 0 : -arrowSize },
              ],
            },
          ]}
        />
        {/* Bubble */}
        <View
          style={[
            styles.bubble,
            {
              left: bubbleLeft,
              top: bubbleTop,
              width: bubbleW,
            },
          ]}
        >
          <View style={styles.innerCtr}>
            <Text style={[styles.text]}>
              {text}
            </Text>

            {/* spacing with margin works here because it's not inside <Text> */}
            {withIcon && <SVGIcon
              name="hand"
              color={colors.black}
              width={20}
              height={20}
            />}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  bubble: {
    position: 'absolute',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    // shadow
    shadowColor: '#816f6f',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  innerCtr: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  text: {
    color: colors.black,
    width: '95%',
    textAlign: 'center'
  },
  arrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  whiteBg: {
    backgroundColor: colors.white
  }
});
