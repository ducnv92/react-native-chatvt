import { View, Animated, Easing, StyleSheet } from 'react-native';
import React, {useEffect, useRef} from 'react';
import chatStore from "../../screens/chat/ChatStore";


const AnimatedSoundBars = ({ barColor = 'gray', isPlay, id }) => {

  const loopAnimation = (node) => {
    const keyframes = [1.2, 0.7, 1];

    const loop = Animated.sequence(
      keyframes.map((toValue) =>
        Animated.timing(node, {
          toValue,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      )
    );

    return loop;
  };

  const loadAnimation = (nodes) =>{
    if(isPlay){
      Animated.loop(Animated.stagger(100, nodes.map(loopAnimation))).start();
    }
  }

  React.useEffect(() => {

    chatStore.soundBarsRefs[id] = Array.from({ length: 16 }).map(
      () => new Animated.Value(1)
    );
    loadAnimation(chatStore.soundBarsRefs[id]);
  }, [isPlay]);

  return (
    <View style={styles.row}>
      {chatStore.soundBarsRefs[id]?.map((animation, index) => {
        return (
          <Animated.View
            key={`${index}`}
            style={[
              styles.bar,
              { backgroundColor: barColor },
              {
                transform: [
                  {
                    scale: animation,
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default AnimatedSoundBars;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bar: {
    height: 20,
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
});
