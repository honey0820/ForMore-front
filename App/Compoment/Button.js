import React from 'react';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import {Indicator} from '../Common/CommonMethods';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
import CustomeFonts from '../Theme/CustomeFonts';
import LText from '../Compoment/LText';

const Button = (props) => {
  const {title, isLoding, onPress, style, textstyle} = props;

  return (
    <View>
      {isLoding ? (
        <View style={[Style.buttonStyle, style, {marginTop: 10}]}>
          <Indicator size="small" color={Colors.TheamColor} />
        </View>
      ) : (
        <TouchableOpacity style={[Style.buttonStyle, style]} onPress={onPress}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <LText
              style={[
                Style.text16,
                {
                  color: Colors.white,
                  fontFamily: CustomeFonts.ComfortaaBold,
                  textAlign: 'center',
                  marginBottom: Platform.OS == 'ios' ? 0 : 2.5,
                },
                textstyle,
              ]}>
              {title}
            </LText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Button;
