/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import { Animated } from "react-native";

const INITIAL_POSITION = { x: 0, y: 0 };
const ANIMATION_CONFIG = {
  duration: 200,
  useNativeDriver: false,
};

const useAnimatedComponents = () => {
  const headerTranslate = new Animated.ValueXY(INITIAL_POSITION);
  const footerTranslate = new Animated.ValueXY(INITIAL_POSITION);

  const toggleVisible = (isVisible: boolean) => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(headerTranslate.y, { ...ANIMATION_CONFIG, toValue: 0 }),
        Animated.timing(footerTranslate.y, { ...ANIMATION_CONFIG, toValue: 0 }),
      ], {useNativeDriver: false}).start();
    } else {
      Animated.parallel([
        Animated.timing(headerTranslate.y, {
          ...ANIMATION_CONFIG,
          toValue: -300,
        }),
        Animated.timing(footerTranslate.y, {
          ...ANIMATION_CONFIG,
          toValue: 300,
        }),
      ], {useNativeDriver: false}).start();
    }
  };

  const headerTransform = headerTranslate.getTranslateTransform();
  const footerTransform = footerTranslate.getTranslateTransform();

  return [headerTransform, footerTransform, toggleVisible] as const;
};

export default useAnimatedComponents;
