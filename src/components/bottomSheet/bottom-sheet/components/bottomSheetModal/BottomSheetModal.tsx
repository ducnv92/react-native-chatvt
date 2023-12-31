// @ts-nocheck
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Portal, usePortal } from '../../../portal';
import { nanoid } from 'nanoid/non-secure';
import isEqual from 'lodash.isequal';
import BottomSheet from '../bottomSheet';
import { useBottomSheetModalInternal } from '../../hooks';
import { DEFAULT_DISMISS_ON_PAN_DOWN } from './constants';
import type { BottomSheetModalMethods } from '../../types';
import type { BottomSheetModalProps } from './types';

type BottomSheetModal = BottomSheetModalMethods;

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>((props, ref) => {
  const {
    // modal props
    name,
    dismissOnPanDown = DEFAULT_DISMISS_ON_PAN_DOWN,
    onDismiss: _providedOnDismiss,

    // bottom sheet props
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    onChange: _providedOnChange,
    topInset = 0,
    bottomInset = 0,

    // components
    children,
    ...bottomSheetProps
  } = props;

  //#region state
  const [mount, setMount] = useState(false);
  //#endregion

  //#region hooks
  const {
    containerHeight,
    mountSheet,
    unmountSheet,
    willUnmountSheet,
  } = useBottomSheetModalInternal();
  const { removePortal: unmountPortal } = usePortal();
  //#endregion

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentIndexRef = useRef(-1);
  const restoreIndexRef = useRef(-1);
  const minimized = useRef(false);
  const forcedDismissed = useRef(false);
  const mounted = useRef(true);
  //#endregion

  //#region variables
  const key = useMemo(() => name || `bottom-sheet-modal-${nanoid()}`, [name]);
  const index = useMemo(
    () => (dismissOnPanDown ? _providedIndex + 1 : _providedIndex),
    [_providedIndex, dismissOnPanDown]
  );
  const snapPoints = useMemo(
    () =>
      dismissOnPanDown ? [0, ..._providedSnapPoints] : _providedSnapPoints,
    [_providedSnapPoints, dismissOnPanDown]
  );
  const safeContainerHeight = useMemo(
    () => containerHeight - topInset - bottomInset,
    [containerHeight, topInset, bottomInset]
  );
  //#endregion

  //#region private methods
  const resetVariables = useCallback(() => {
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    minimized.current = false;
    mounted.current = true;
    forcedDismissed.current = false;
  }, []);
  const adjustIndex = useCallback(
    (_index: number) => (dismissOnPanDown ? _index - 1 : _index),
    [dismissOnPanDown]
  );
  const unmount = useCallback(() => {
    const _mounted = mounted.current;

    // reset variables
    resetVariables();

    // unmount sheet and portal
    unmountSheet(key);
    unmountPortal(key);

    // unmount the node, if sheet is still mounted
    if (_mounted) {
      setMount(false);
    }

    // fire `onDismiss` callback
    if (_providedOnDismiss) {
      _providedOnDismiss();
    }
  }, [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]);
  //#endregion

  //#region bottom sheet methods
  const handleSnapTo = useCallback(
    (_index: number) => {
      if (minimized.current) {
        return;
      }

      bottomSheetRef.current?.snapTo(adjustIndex(_index));
    },
    [adjustIndex]
  );
  const handleExpand = useCallback(() => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapse = useCallback(() => {
    if (minimized.current) {
      return;
    }
    if (dismissOnPanDown) {
      bottomSheetRef.current?.snapTo(1);
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [dismissOnPanDown]);
  const handleClose = useCallback(() => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.close();
  }, []);
  //#endregion

  //#region bottom sheet modal methods
  const handlePresent = useCallback(() => {
    requestAnimationFrame(() => {
      setMount(true);
      mountSheet(key, ref);
    });
  }, [key, ref, mountSheet]);
  const handleDismiss = useCallback(() => {
    /**
     * if modal is already been dismiss, we exit the method.
     */
    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }

    if (minimized.current) {
      unmount();
      return;
    }
    willUnmountSheet(key);
    forcedDismissed.current = true;
    bottomSheetRef.current?.close();
  }, [willUnmountSheet, unmount, key]);
  const handleMinimize = useCallback(() => {
    if (minimized.current) {
      return;
    }
    minimized.current = true;

    /**
     * if modal got minimized before it finish its mounting
     * animation, we set the `restoreIndexRef` to the
     * provided index.
     */
    if (currentIndexRef.current === -1) {
      restoreIndexRef.current = index;
    } else {
      restoreIndexRef.current = currentIndexRef.current;
    }
    bottomSheetRef.current?.close();
  }, [index]);
  const handleRestore = useCallback(() => {
    if (!minimized.current || forcedDismissed.current) {
      return;
    }
    minimized.current = false;
    bottomSheetRef.current?.snapTo(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = useCallback(() => {
    /**
     * if modal is already been dismiss, we exit the method.
     */
    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }

    mounted.current = false;
    forcedDismissed.current = true;

    if (minimized.current) {
      unmount();
      return;
    }
    willUnmountSheet(key);
    bottomSheetRef.current?.close();
  }, [key, unmount, willUnmountSheet]);
  const handleBottomSheetOnChange = useCallback(
    (_index: number) => {
      const adjustedIndex = adjustIndex(_index);
      currentIndexRef.current = _index;

      if (_providedOnChange) {
        _providedOnChange(adjustedIndex);
      }

      if (minimized.current) {
        return;
      }

      if (adjustedIndex === -1) {
        unmount();
      }
    },
    [adjustIndex, unmount, _providedOnChange]
  );
  //#endregion

  //#region expose public methods
  useImperativeHandle(ref, () => ({
    // sheet
    snapTo: handleSnapTo,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    // modal
    present: handlePresent,
    dismiss: handleDismiss,
    // private
    minimize: handleMinimize,
    restore: handleRestore,
  }));
  //#endregion

  // render
  return mount ? (
    <Portal key={key} name={key} handleOnUnmount={handlePortalOnUnmount}>
      <BottomSheet
        {...bottomSheetProps}
        ref={bottomSheetRef}
        key={key}
        index={index}
        snapPoints={snapPoints}
        animateOnMount={true}
        topInset={topInset}
        bottomInset={bottomInset}
        containerHeight={safeContainerHeight}
        onChange={handleBottomSheetOnChange}
        children={children}
      />
    </Portal>
  ) : null;
});

const BottomSheetModal = memo(BottomSheetModalComponent, isEqual);

export default BottomSheetModal;
