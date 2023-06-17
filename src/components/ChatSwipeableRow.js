import React, { Component, PropsWithChildren } from 'react';
import {Animated, StyleSheet, Text, View, I18nManager, Image} from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class ChatSwipeableRow extends Component {
   renderLeftActions = (
    _progress,
    dragX
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

   renderRightAction = (
    text,
    icon,
    color,
    x,
    progress,
    onPress,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      if(onPress)
        onPress()
      this.close();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={icon} />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
   renderRightActions = (
    progress,
    _dragAnimatedValue
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {this.renderRightAction('Bỏ ghim',  require('../assets/ic_unpin.png'), '#3B7CEC', 198, progress, this.props.onPress1)}
      {/*{this.renderRightAction('Bật t.báo', require('../assets/ic_notify.png'),'#EB960A', 132, progress)}*/}
      {this.renderRightAction('Xoá', require('../assets/ic_trash.png'),'#EE0033', 66, progress,  this.props.onPress3)}
    </View>
  );

   swipeableRow

   updateRef = (ref) => {
    this.swipeableRow = ref;
  };
   close = () => {
    this.swipeableRow?.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        onSwipeableOpen={(direction) => {
          console.log(`Opening swipeable from the ${direction}`);
        }}
        onSwipeableClose={(direction) => {
          console.log(`Closing swipeable to the ${direction}`);
        }}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingTop: 4,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
