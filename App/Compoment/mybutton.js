import * as React from 'react';
import {Button} from 'react-native';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomeFonts from '../Theme/CustomeFonts';
import {Icon} from 'react-native-elements';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
import {validationempty} from '../Common/Validations';
import LText from '../Compoment/LText';

const button = (props) => {
  return (
    <TouchableOpacity
      style={[styles.OnButtonStyle, props.style]}
      onPress={props.onPress}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {validationempty(props.iconname) ? (
          <Image
            source={props.iconname}
            style={[styles.iconstyle, props.iconstyle]}
            tintColor={props.tintColor}
          />
        ) : null}
        <LText style={[styles.textStyle, props.textstyle]}>{props.text}</LText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  OnButtonStyle: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    borderRadius: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.TheamColor2,
  },
  iconstyle: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginRight: 10,
  },
  textStyle: {
    color: '#FFFFFF',
    fontFamily: CustomeFonts.ComfortaaBold,
    textAlignVertical: 'center',
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        marginTop: 2, // as same as height
      },
      android: {},
    }),
  },
});
export default button;
