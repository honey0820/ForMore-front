import React, {useRef, useEffect, useState} from 'react';
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
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {showToast} from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-number-input';
import {validationempty, validationBlank} from '../Common/Validations';
import {SafeAreaView} from 'react-native-safe-area-context';

const OtpScreen = ({navigation, route}) => {
  const {
    fname,
    lname,
    password,
    country,
    randomNumber,
    mobile_code,
    city,
    date,
    sex,
    email,
    checked,
    kids,
    info,
    mno,
    entartainment,
    travelings,
    sports,
    lang_id,
    electronic_games,
    technolocgy,
    food,
    music,
    nightlife,
  } = route.params;

  const phoneInput = useRef(null);
  const [loding, setLoding] = useState(false);
  const [otpgenerate, setotpgenerate] = useState(randomNumber);
  const [enterdotp, setOTP] = useState('');
  const [mobile_no, setmobile_no] = useState('');
  const [countryCode, setCode] = useState('44');

  const validationCheck = () => {
    const checkValid = phoneInput.current?.isValidNumber(mobile_no);

    if (validationBlank(mobile_no, 'Enter Mobile Number')) {
      if (checkValid) {
        otpSendApi();
      } else {
        showToast('Enter Valid Mobile Number', 'error');
      }
    }
  };

  const otpSendApi = async () => {
    setLoding(true);
    const randomNumber = Math.floor(100000 + Math.random() * 100000) + 1;

    var formData = new FormData();
    formData.append(
      'mobile_no',
      validationempty(countryCode)
        ? mobile_no.slice(countryCode.length + 1)
        : mobile_no,
    );
    formData.append('otp', randomNumber + '');
    formData.append('mobile_code', countryCode + '');

    console.log('check formData', formData);
    var response = await Helper.POST(Urls.send_mobile_otp, formData);
    console.log('check the response', response);
    if (response.status == 200) {
      setLoding(false);
      showToast(response.Message, 'success');

      navigation.navigate('OtpMobileNumber', {
        mno: validationempty(countryCode)
          ? mobile_no.slice(countryCode.length + 1)
          : mobile_no,
        randomNumber: randomNumber,
        mobile_code: countryCode,
        fname: fname,
        lname: lname,
        password: password,
        mobile_code: countryCode,
        email: email,
        country: country,
        city: city,
        date: date,
        lang_id: lang_id,
        sex1: sex,
        checked1: checked,
        kids: kids,
        info: info,
        entartainment: entartainment,
        travelings: travelings,
        sports: sports,
        electronic_games: electronic_games,
        technolocgy: technolocgy,
        food: food,
        music: music,
        nightlife: nightlife,
      });
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  useEffect(() => {
    // console.log('setOTP---', enterdotp);
    // otpSendApi();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <View
          style={{
            marginVertical: '8%',
            backgroundColor: 'transparent',
          }}>
          <Card containerStyle={[styles.card_style, {height: '95%'}]}>
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
                  style={[Style.text14_bold, {fontSize: 18, marginTop: '20%'}]}>
                  Update Mobile Number
                </LText>

                <Text
                  style={[Style.text12, {marginBottom: '20%', lineHeight: 18}]}>
                  We have sent a OTP to your number {'\n'}
                  {mobile_no}
                </Text>

                <PhoneInput
                  ref={phoneInput}
                  // defaultValue={mno}
                  // defaultCode={'IN'}
                  layout="first"
                  // value={mno}
                  countryPickerButtonStyle={{
                    marginRight: 0,
                  }}
                  onChangeCountry={(code) => {
                    setCode(code.callingCode[0]);
                  }}
                  containerStyle={{
                    width: '100%',
                    // height: 40,
                    // marginTop: 4,
                    borderBottomColor: Colors.lg_gray,
                    borderBottomWidth: 1,
                    backgroundColor: 'transparent',
                  }}
                  flagButtonStyle={{paddingBottom: 3}}
                  textInputStyle={[Style.text14, {marginTop: 1}]}
                  codeTextStyle={[Style.text14, {marginHorizontal: 0}]}
                  textContainerStyle={{
                    paddingVertical: 0,
                    backgroundColor: 'transparent',
                    multiline: 'false',
                  }}
                  onChangeFormattedText={(text) => {
                    setmobile_no(text);
                  }}
                />

                <Button
                  title="VERIFY"
                  onPress={() => {
                    validationCheck();
                  }}
                  textstyle={{textTransform: 'uppercase', fontSize: 20}}
                />
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
