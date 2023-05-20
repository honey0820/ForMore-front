import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Fonts from '../Theme/CustomeFonts';
import LText from '../Compoment/LText';
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
      <View onPress={props.onPressLeft}>
        <Image
          style={[styles.iconStyle, props.iconstyle]}
          source={props.left}
        />
      </View>
      <LText numberOfLines={1} style={[styles.textStyle, props.textStyle]}>
        {props.text}
      </LText>
      <View onPress={props.onPressRight}>
        <Image style={styles.iconStyle} source={props.right} />
      </View>
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
    fontSize: RFValue(15),
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
