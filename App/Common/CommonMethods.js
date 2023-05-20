import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Image, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Style, {HEIGHT} from '../Theme/Style';
import {LocalData} from './Urls';
import {validationempty} from './Validations';

var Id, Name, Token;

export const showToast = (msg, type) => {
  if (msg) {
    Toast.show({
      text1: msg,
      type: type, //'success | error | info',
      position: 'top',
      visibilityTime: 6000,
      autoHide: true,
      topOffset: 10,
      // bottomOffset: 40,
    });
  }
};
export const CheckLogin = async () => {
  var id = await AsyncStorage.getItem('id');
  var Token = await AsyncStorage.getItem('Token');

  if (validationempty(id)) {
    LocalData.Id = id;
    LocalData.Token = Token;
    return true;
  } else {
    return false;
  }
};

export const Checkguest = async () => {
  var is_guest = await AsyncStorage.getItem('is_guest');
  
  if (validationempty(is_guest)) {
    LocalData.is_guest = is_guest;
    return true;
  } else {
    return false;
  }
};

export const logout = async (navigation) => {
  await AsyncStorage.setItem('Token', '');
  await AsyncStorage.setItem('id', '');
  await AsyncStorage.setItem('lang_id', '');
  await AsyncStorage.setItem('last_name', '');
  await AsyncStorage.setItem('first_name', '');
  await AsyncStorage.setItem('mobile_no', '');
  await AsyncStorage.setItem('email', '');
  await AsyncStorage.setItem('name', '');
  await AsyncStorage.setItem('business_id', '');
  await AsyncStorage.setItem('is_guest', '');
  navigation.popToTop();
  navigation.replace('MainSelection');
};

export const Indicator = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'stretch',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        zIndex: 50,
      }}>
      <ActivityIndicator size="large" color={Colors.TheamColor2} />
    </View>
  );
};

export const Indicator1 = () => {
  return <ActivityIndicator size="small" color={Colors.TheamColor2} />;
};

export const NoData = (props) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT / 2,
      }}>
      <Image
        source={Images.nodata}
        style={{width: '100%', height: 150}}
        resizeMode="contain"
      />
      <Text style={[Style.text12, {width: '100%', textAlign: 'center'}]}>
        {validationempty(props.itemtext) ? props.itemtext : 'No Data Available'}
      </Text>
    </View>
  );
};

// export function LocalData(id, token, name) {
//      Id = id
//      Token = token
//      Name = name

// }
// export {Id,Token,Name}
