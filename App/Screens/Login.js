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
  const [password, setPassword] = useState('');
  const [loding, setLoding] = useState(false);
  const [passwordView, setPasswordView] = useState(true);

  const validationCheck = () => {
    if (
      validationBlank(username, 'Enter Email') &&
      validateEmail(username.trim(), 'Enter Valid Email') &&
      validationBlank(password, 'Enter Password') &&
      validatePassword(password)
    ) {
      apiCallRegister();
    }
  };

  const apiCallRegister = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('email', username.trim());
    formdata.append('password', password);

    console.log('login formdata', formdata);
    var response = await Helper.POST(Urls.login, formdata);
    console.log('login response', response);
    setLoding(false);
    if (response.status == 200) {
      showToast(response.Message + '', 'success');
      await AsyncStorage.setItem('Token', response.access_token + '');
      await AsyncStorage.setItem('id', response.user.id + '');
      await AsyncStorage.setItem('lang_id', response.user.lang_id + '');
      await AsyncStorage.setItem('last_name', response.user.last_name + '');
      await AsyncStorage.setItem('first_name', response.user.first_name + '');
      await AsyncStorage.setItem('mobile_no', response.user.mobile_no + '');
      await AsyncStorage.setItem('email', response.user.email + '');
      await AsyncStorage.setItem('name', response.user.name + '');
      await AsyncStorage.setItem('business_id', response.user.business_id + '');
      await AsyncStorage.setItem(
        'country_name',
        response.user.country_name + '',
      );
      await AsyncStorage.setItem(
        'residence_country_id',
        response.user.residence_country_id + '',
      );
      await AsyncStorage.setItem('is_guest', '1');

      LocalData.is_guest = '1';
      LocalData.isLogin = true;
      LocalData.Id = response.user.id + '';
      LocalData.Token = response.access_token + '';
      navigation.popToTop();
      navigation.replace('Home');
    } else {
      showToast(response.Message, 'error');
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

              <LText style={[Style.text14_bold]}>Password</LText>

              <TextInput
                style={[Style.textInput, {marginTop: 0}]}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={Colors.gray_d1}
                value={password}
                maxLength={6}
                keyboardType="number-pad"
                secureTextEntry={passwordView}
                selectionColor={Colors.TheamColor2}
                iconName={passwordView ? 'eye-off' : 'eye'}
                iconPress={() => {
                  setPasswordView(!passwordView);
                }}
                iconType="ionicons"
              />

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    Style.text14,
                    {
                      flex: 1,
                      textAlign: 'right',
                      color: Colors.gray,
                      fontSize: 13,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate('Forgotpassword');
                  }}>
                  Forgot Password?
                </Text>

                {/* <Text
              style={[
                Style.text14,
                {
                  flex: 1,
                  textAlign: 'right',
                  color: Colors.lightblack,
                  fontSize: 13,
                },
              ]}
              onPress={() => {}}>
              Need help?
            </Text> */}
              </View>

              <Button
                title="Log In"
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
