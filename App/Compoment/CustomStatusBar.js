import React from 'react';
import {StatusBar} from 'react-native';
import Colors from '../Theme/Colors';

const CustomStatusBar = (props) => (
  <StatusBar
    animated={true}
    backgroundColor={Colors.TheamColor2}
    hidden={false}
    barStyle={props.barStyle}
  />
);

export default CustomStatusBar;
