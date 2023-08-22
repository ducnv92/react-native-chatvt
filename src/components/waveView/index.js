import { View, Animated, Easing, StyleSheet } from 'react-native';
import React from 'react';

const dotAnimations = Array.from({ length: 16 }).map(
  () => new Animated.Value(1)
);

const AnimatedSoundBars = ({ barColor = 'gray' }) => {
  const loopAnimation = (node) => {
    const keyframes = [1.2, 0.7, 0.5, 0.8, 1];

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

  const loadAnimation = (nodes) =>
    Animated.loop(Animated.stagger(150, nodes.map(loopAnimation)));

  React.useEffect(() => {
    loadAnimation(dotAnimations);
  }, []);

  const play = () => {
    loadAnimation(dotAnimations).start();
  }

  const stop = () => {
    loadAnimation(dotAnimations).stop();
  }

  return (
    <View style={styles.row}>
      {dotAnimations.map((animation, index) => {
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
