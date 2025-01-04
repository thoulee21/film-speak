import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Caption } from 'react-native-paper';

import LottieAnimation from '@/src/components/LottieAnimation';

const PoweredBy = ({ caption }: { caption: string }) => {
  const window = useWindowDimensions();

  return (
    <LottieAnimation
      animation="rocket"
      style={[
        styles.footer,
        { height: window.height * 0.50 }
      ]}
    >
      <Caption style={styles.center}>
        {caption}
      </Caption>
    </LottieAnimation>
  );
};

export default PoweredBy;

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-end',
  },
  center: {
    textAlign: 'center',
  }
});
