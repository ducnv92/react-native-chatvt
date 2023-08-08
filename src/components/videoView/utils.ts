/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  NativeTouchEvent,
} from "react-native";
import { Dimensions } from "react-native";

export const getImageDimensionsByTranslate = (
  translate: any,
  screen: any
) => ({
  width: screen.width - translate.x * 2,
  height: screen.height - translate.y * 2,
});

type CacheStorageItem = { key: string; value: any };

export const createCache = (cacheSize: number) => ({
  _storage: [] as CacheStorageItem[],
  get(key: string): any {
    const { value } =
      this._storage.find(({ key: storageKey }) => storageKey === key) || {};

    return value;
  },
  set(key: string, value: any) {
    if (this._storage.length >= cacheSize) {
      this._storage.shift();
    }

    this._storage.push({ key, value });
  },
});

export const splitArrayIntoBatches = (arr: any[], batchSize: number): any[] =>
  arr.reduce((result, item) => {
    const batch = result.pop() || [];

    if (batch.length < batchSize) {
      batch.push(item);
      result.push(batch);
    } else {
      result.push(batch, [item]);
    }

    return result;
  }, []);

export const getImageTransform = (
  image: any | null,
  screen: any
) => {
  if (!image?.width || !image?.height) {
    return [] as const;
  }

  const wScale = screen.width / image.width;
  const hScale = screen.height / image.height;
  const scale = Math.min(wScale, hScale);
  const { x, y } = getImageTranslate(image, screen);

  return [{ x, y }, scale] as const;
};

export const getImageStyles = (
  image: any | null,
  translate: Animated.ValueXY,
  scale?: Animated.Value
) => {
  if (!image?.width || !image?.height) {
    return { width: 0, height: 0 };
  }

  const transform = translate.getTranslateTransform();

  if (scale) {
    transform.push({ scale }, { perspective: new Animated.Value(1000) });
  }

  return {
    width: image.width,
    height: image.height,
    transform,
  };
};

export const getImageTranslate = (
  image: any,
  screen: any
): any => {
  const getTranslateForAxis = (axis: "x" | "y"): number => {
    const imageSize = axis === "x" ? image.width : image.height;
    const screenSize = axis === "x" ? screen.width : screen.height;

    return (screenSize - imageSize) / 2;
  };

  return {
    x: getTranslateForAxis("x"),
    y: getTranslateForAxis("y"),
  };
};

export const getImageanyByTranslate = (
  translate: any,
  screen: any
): any => ({
  width: screen.width - translate.x * 2,
  height: screen.height - translate.y * 2,
});

export const getImageTranslateForScale = (
  currentTranslate: any,
  targetScale: number,
  screen: any
): any => {
  const { width, height } = getImageanyByTranslate(
    currentTranslate,
    screen
  );

  const targetImageany = {
    width: width * targetScale,
    height: height * targetScale,
  };

  return getImageTranslate(targetImageany, screen);
};

type HandlerType = (
  event: GestureResponderEvent,
  state: PanResponderGestureState
) => void;

type PanResponderProps = {
  onGrant: HandlerType;
  onStart?: HandlerType;
  onMove: HandlerType;
  onRelease?: HandlerType;
  onTerminate?: HandlerType;
};

export const createPanResponder = ({
  onGrant,
  onStart,
  onMove,
  onRelease,
  onTerminate,
}: PanResponderProps): PanResponderInstance =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: onGrant,
    onPanResponderStart: onStart,
    onPanResponderMove: onMove,
    onPanResponderRelease: onRelease,
    onPanResponderTerminate: onTerminate,
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => false,
  });

export const getDistanceBetweenTouches = (
  touches: NativeTouchEvent[]
): number => {
  const [a, b] = touches;

  if (a == null || b == null) {
    return 0;
  }

  return Math.sqrt(
    Math.pow(a.pageX - b.pageX, 2) + Math.pow(a.pageY - b.pageY, 2)
  );
};



export const isPortrait = () => {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
};

/**
 * Return a timer for video from< time in seconds
 * ~~ is used as faster substitute for Math.floor() function
 * https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript
 * @param time
 * @returns {string}
 */
export const secondToTime = (time) => {
  return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
};

export const normalizeSeconds = (number) =>  {
  let sec_num = parseInt(number, 10); // don't forget the second param
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
};
