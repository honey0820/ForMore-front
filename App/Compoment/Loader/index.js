import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Colors from '../../Theme/Colors';
import Images from '../../Theme/Images';
import FastImage from 'react-native-fast-image';
import {LocalData, Urls} from '../../Common/Urls';
import {HEIGHT, WIDTH} from '../../Theme/Style';

const Loader = ({loading}) => {
  if (!loading) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/* <ActivityIndicator size="large" color={Colors.white} /> */}
      <FastImage
        source={Images.loaderlogo}
        resizeMode='contain'
        style={{
          height: '50%',
          width: '50%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default Loader;

Loader.defaultProps = {
  loading: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    zIndex: 50,
  },
});
