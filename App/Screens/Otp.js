import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input'


const OtpScreen = ({ navigation, route }) => {
  const {
    fname,
    voucher_code,
    lname,
    mno,
    email,
    password,
    selectedlangid,
    randomNumber,
    mobile_code,
  } = route.params;
  const [loding, setLoding] = useState(false);
  const [otpgenerate, setotpgenerate] = useState(randomNumber);
  const [enterdotp, setOTP] = useState('');

  const validationCheck = () => {
    if (otpgenerate == enterdotp) {
      apiCallRegister();
    } else {
      showToast('Invalid OTP', 'error');
    }
  };

  useEffect(() => {
    // console.log('setOTP---', enterdotp);
    // otpSendApi();
  }, []);

  const otpSendApi = async () => {
    setOTP("");
    setLoding(true);
    const randomNumber = Math.floor(100000 + Math.random() * 100000) + 1;
    console.log('random Number ---->', randomNumber);
    setotpgenerate(randomNumber);

    var formData = new FormData();
    formData.append('mobile_no', mno + '');
    formData.append('otp', randomNumber + '');
    formData.append('email', email + '');
    formData.append('mobile_code', mobile_code + '');
    console.log('check formData', formData);
    var response = await Helper.POST(Urls.send_otp, formData);
    console.log('check the response', response);
    if (response.status == 200) {
      setLoding(false);
      showToast(response.Message, 'success');
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallRegister = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('lang_id', selectedlangid);
    formdata.append('last_name', lname);
    formdata.append('first_name', fname);
    formdata.append('mobile_no', mno);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('confirm-password', password);
    formdata.append('mobile_code', mobile_code);
    formdata.append('voucher_code', voucher_code);

    console.log('register formdata', formdata);
    var response = await Helper.POST(Urls.register, formdata);
    console.log('register response', response);
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

      await AsyncStorage.setItem('is_guest', '1');

      
      LocalData.is_guest = '1';
      LocalData.isLogin = true;
      LocalData.Id = response.user.id + '';
      LocalData.Token = response.access_token + '';
      navigation.popToTop();
      navigation.replace('OptionData1');
    } else {
      showToast(JSON.stringify(response.Message), 'error');
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <View
          style={{
            marginVertical: '8%',
            marginHorizontal: 10,
            backgroundColor: 'transparent',
          }}>
          <Card containerStyle={[styles.card_style, { height: '95%' }]}>
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                position: 'absolute',
                left: -38,
                top: -30,
              }}>
              <TouchableOpacity
                onPressIn={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={Images.ic_close}
                  style={styles.img_back_style}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <LText
                  style={[Style.text14_bold, { fontSize: 20, marginTop: '20%' }]}>
                  Mobile Verification
                </LText>

                <Text
                  style={[Style.text12, { marginBottom: '20%', lineHeight: 18 }]}>
                  We have sent a OTP to your number {mno}
                </Text>

                <OTPInputView
                  style={{ width: '100%', height: 160 }}
                  pinCount={6}
                  code={enterdotp}
                  onCodeChanged={(sd) => setOTP(sd)}
                  codeInputFieldStyle={
                    {
                      backgroundColor: Colors.white,
                      borderRadius: 8,
                      borderColor: Colors.lg_gray,
                      borderWidth: 1,
                      height: WIDTH / 9.5,
                      width: WIDTH / 9.5,
                      borderWidth: 2,
                      color: 'black'
                    }
                  }
                  codeInputHighlightStyle={{ borderColor: Colors.TheamColor2 }}
                  onCodeFilled={(code) => {
                    console.log(`Code is ${code}, you are good to go!`)
                  }}

                />

                {/* <OtpInputs
                  autofillFromClipboard={false}
                  handleChange={(sd) => setOTP(sd)}
                  numberOfInputs={6}
                  inputContainerStyles={{
                    backgroundColor: Colors.white,
                    borderRadius: 8,
                    borderColor: Colors.lg_gray,
                    borderWidth: 1,
                    height: WIDTH / 9,
                  }}
                  inputStyles={{
                    textAlign: 'center',
                  }}
                /> */}

                <Text
                  style={[
                    Style.text14,
                    {
                      marginTop: 5,
                      textAlign: 'center',
                      color: Colors.lightblack,
                      fontSize: 13,
                    },
                  ]}
                  onPress={() => { }}>
                  didn't receive a code?
                  <Text
                    style={[
                      Style.text14,
                      { textAlign: 'center', color: Colors.blue, fontSize: 13 },
                    ]}
                    onPress={() => {
                      otpSendApi();
                    }}>
                    {' '}
                    Resend
                  </Text>
                </Text>

                <Button
                  title="Verify"
                  onPress={() => {
                    validationCheck();
                  }}
                  textstyle={{ fontSize: 20 }}
                />

                <Text
                  style={[
                    Style.text14,
                    {
                      textAlign: 'center',
                      color: Colors.lightblack,
                      fontSize: 13,
                    },
                  ]}
                  onPress={() => { }}>
                  Change
                  <Text
                    style={[
                      Style.text14,
                      { textAlign: 'center', color: Colors.blue, fontSize: 13 },
                    ]}
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    {' '}
                    Number?
                  </Text>
                </Text>
              </View>
            </ScrollView>
          </Card>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '8%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OtpScreen;
