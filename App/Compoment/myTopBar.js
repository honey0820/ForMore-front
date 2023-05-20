import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Fonts from '../Theme/CustomeFonts';
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
    <SafeAreaView>
      <View style={[styles.barView, props.style]}>
        <TouchableOpacity onPress={props.onPressLeft}>
          <Image
            style={[styles.iconStyle, props.iconstyle]}
            source={props.left}
          />
        </TouchableOpacity>
        <Text style={[styles.textStyle, props.textStyle]}>{props.text}</Text>
        <TouchableOpacity onPress={props.onPressRight}>
          <Image style={styles.iconStyle} source={props.right} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  barView: {
    flexDirection: 'row',
    width: '100%',
    height: RFValue(45),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: RFValue(18),
    lineHeight: RFValue(24),
    color: '#161B46',
    fontFamily: Fonts.ComfortaaBold,
  },
  iconStyle: {
    width: RFValue(22),
    height: RFValue(22),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginHorizontal: RFValue(20),
  },
});
export default topBar;
