import React from 'react';
import {BackHandler} from 'react-native';
const onBackPress = (callback) => {
  BackHandler.addEventListener('hardwareBackPress', callback);
  return () => {
    BackHandler.removeEventListener('hardwareBackPress', callback);
  };
};

export {onBackPress};
