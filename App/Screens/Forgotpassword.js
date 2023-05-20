import React, {useEffect, useState} from 'react';
import {
  Linking,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {
  validateEmail,
  validationBlank,
  validatePassword,
} from '../Common/Validations';
import {Alert} from 'react-native';
import LText from '../Compoment/LText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {showToast} from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [username, setUserName] = useState('');
  const [loding, setLoding] = useState(false);
  const validationCheck = () => {
    if (
      validationBlank(username, 'Enter Email') &&
      validateEmail(username.trim(), 'Enter Valid Email')
    ) {
      apiCallRegister();
    }
  };

  const apiCallRegister = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('email', username.trim());

    console.log('forget_password formdata', formdata);
    var response = await Helper.POST(Urls.forget_password, formdata);
    console.log('forget_password response', response);
    setLoding(false);
    if (response.status == 200) {
      showToast(response.message + '', 'success');
    } else {
      showToast(response.message, 'error');
    }
  };

  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <Loader loading={loding} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={Style.container1}>
              <Image
                source={Images.logo}
                style={Style.auth_img_style}
                resizeMode="contain"
              />

              <LText style={[Style.text14_bold]}>Email</LText>

              <TextInput
                style={[Style.textInput, {marginTop: 0}]}
                onChangeText={(text) => setUserName(text)}
                placeholderTextColor={Colors.gray_d1}
                value={username}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={Colors.TheamColor2}
              />

              <Button
                title="Submit"
                onPress={() => {
                  validationCheck();
                }}
                textstyle={{fontSize: 20}}
              />
            </ScrollView>
          </KeyboardAvoidingView>

          <Text
            onPress={() => {
              Linking.openURL('http://www.for-more.eu/');
            }}
            style={[
              Style.text14,
              {
                color: Colors.black,
                fontFamily: CustomeFonts.ComfortaaBold,
                position: 'absolute',
                bottom: 0,
                marginBottom: 10,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}>
            www.for-more.eu
          </Text>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default Login;
