import { View, Animated, Easing, StyleSheet } from 'react-native';
import React, {useEffect, useRef} from 'react';

const AnimatedSoundBars = (props) => {
  let ref = useRef();

  const dotAnimations = Array.from({ length: props?.length?props?.length:16 }).map(
    () => new Animated.Value(1)
  );

  const loopAnimation = (node) => {
    const keyframes = [0.7, 1];

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

  useEffect(() => {
    try{
      if(props.isPlay) {
        loadAnimation().start();
      }else{
        // loadAnimation().stop();
      }
    }catch (e) {
      console.log(e)
    }
  }, [props.isPlay]);

  const loadAnimation = () =>{
    ref = Animated.loop(Animated.stagger(100, dotAnimations.map(loopAnimation)))
    return ref
  };

  // React.useEffect(() => {
  //   loadAnimation();
  // }, []);
  //
  // const play = () => {
  //   loadAnimation().start();
  // }
  //
  // const stop = () => {
  //   loadAnimation().stop();
  // }

  return (
    <View style={styles.row}>
      {dotAnimations.map((animation, index) => {
        return (
          <Animated.View
            key={`${index}`}
            style={[
              styles.bar,
              { backgroundColor: props?.barColor?props?.barColor: 'gray' },
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
