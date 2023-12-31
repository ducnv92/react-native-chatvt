import type { ViewProps } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { NullableAccessibilityProps } from '../../types';

export interface BottomSheetBackdropProps extends Pick<ViewProps, 'style'> {
  /**
   * Current sheet position index.
   * @type Animated.Value<number>
   */
  animatedIndex: Animated.Node<number>;
  /**
   * Current sheet position.
   * @type Animated.Value<number>
   */
  animatedPosition: Animated.Node<number>;
}

export type BackdropPressBehavior = 'none' | 'close' | 'collapse' | number;

export interface BottomSheetDefaultBackdropProps
  extends BottomSheetBackdropProps,
    NullableAccessibilityProps {
  /**
   * Backdrop opacity.
   * @type number
   * @default 0.5
   */
  opacity?: number;
  /**
   * Snap point index when backdrop will appears on.
   * @type number
   * @default 1
   */
  appearsOnIndex?: number;
  /**
   * Snap point index when backdrop will disappears on.
   * @type number
   * @default 0
   */
  disappearsOnIndex?: number;
  /**
   * Enable touch through backdrop component.
   * @type boolean
   * @default false
   */
  enableTouchThrough?: boolean;
  /**
   * Close sheet when user press on backdrop.
   * @type boolean
   * @deprecated Use pressBehavior instead.
   */
  closeOnPress?: boolean;
  /**
   * What should happen when user press backdrop?
   * @type BackdropPressBehavior
   * @default 'close'
   */
  pressBehavior?: BackdropPressBehavior;
}
