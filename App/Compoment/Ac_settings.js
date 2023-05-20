import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Fonts from '../Theme/CustomeFonts';
import Colors from '../Theme/Colors';
import {Icon} from 'react-native-elements';
{
  /*
    onPressLeft is click listner for left image
    onPressRight is for right image
    send text in prop for middle Text
    send location of image using left for left image
    right for right image
*/
}

const topBar = (props) => {
  return (
    <TouchableOpacity
      style={[styles.barView, props.style]}
      onPress={props.onPress}>
      <TouchableOpacity onPress={props.onPressLeft}>
        <Icon
          style={styles.iconStyle}
          name={props.left}
          type={'ionicon'}
          color={Colors.lightblack}
        />
      </TouchableOpacity>
      <Text numberOfLines={1} style={[styles.textStyle, props.textStyle]}>
        {props.text}
      </Text>
      <TouchableOpacity onPress={props.onPressRight}>
        <Image style={styles.iconStyle} source={props.right} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  barView: {
    flexDirection: 'row',
    width: '100%',
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'left',
    flex: 1,
    marginLeft: 10,
    fontWeight: '600',
    fontSize: RFValue(14),
    lineHeight: RFValue(24),
    color: '#000',
    fontFamily: Fonts.ComfortaaRegular,
  },
  iconStyle: {
    width: RFValue(24),
    height: RFValue(24),
    resizeMode: 'contain',
  },
});
export default topBar;
