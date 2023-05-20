import React, { useRef, useEffect, useState } from 'react';
import {
  ImageBackground,
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import {
  matchPassword,
  validateEmail,
  validationBlank,
  validatePassword,
  validatePhone,
  validationempty,
  validateConfirmPassword,
} from '../Common/Validations';
import PhoneInput from 'react-native-phone-number-input';
import LanguageModal from '../Compoment/LanguageModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LText from '../Compoment/LText';
import { Helper } from '../Common/Helper';
import { LocalData, Params, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { showToast } from '../Common/CommonMethods';
import { RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckBox } from 'react-native-elements';

const RTegister = ({ navigation }) => {

  const phoneInput = useRef(null);
  const [checked, setchecked] = useState(false);
  const [value, setValue] = useState('No');
  const [voucher_code, setvoucher_code] = useState('');
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [mno, setmno] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [password1, setpassword1] = useState('');
  const [countryCode, setCode] = useState('44');
  const [passwordView, setPasswordView] = useState(true);
  const [passwordView1, setPasswordView1] = useState(true);
  const [loading, setLoding] = useState(false);

  const [selectedlangimg, setselectedlangimg] = useState('');
  const [selectedlang, setselectedlang] = useState('');
  const [selectedlangid, setselectedlangid] = useState('');
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const [languagearray, setlanguagearray] = useState([]);

  const validationCheck = () => {
    const checkValid = phoneInput.current?.isValidNumber(mno);

    if (
      validationBlank(fname, 'Enter First Name') &&
      validationBlank(lname, 'Enter Last Name') &&
      validationBlank(mno, 'Enter Mobile Number') &&
      validateEmail(email.trim(), 'Enter Valid Email') &&
      validationBlank(password, 'Enter Password') &&
      validatePassword(password) &&
      validationBlank(password1, 'Enter Re - Type Password') &&
      validateConfirmPassword(password1) &&
      matchPassword(password, password1)
    ) {
      if (checkValid) {
        if (checked) {
          otpSendApi();
        }
        else {
          showToast('Kindly Agree Terms & Conditions and Privacy Policy', 'error');
        }

      } else {
        showToast('Enter Valid Mobile Number', 'error');
      }
    }
  };

  const otpSendApi = async () => {
    setLoding(true);
    const randomNumber = Math.floor(100000 + Math.random() * 100000) + 1;
    console.log('random Number ---->', randomNumber);
    // setotpgenerate(randomNumber);

    var formData = new FormData();
    formData.append(
      'mobile_no',
      validationempty(countryCode) ? mno.slice(countryCode.length + 1) : mno,
    );
    formData.append('otp', randomNumber + '');
    formData.append('email', email + '');
    formData.append('mobile_code', countryCode + '');

    console.log('check formData', formData);
    var response = await Helper.POST(Urls.send_otp, formData);
    console.log('check the response', response);
    if (response.status == 200) {
      setLoding(false);
      showToast(response.Message, 'success');

      navigation.navigate('Otp', {
        fname: fname,
        lname: lname,
        mno: validationempty(countryCode)
          ? mno.slice(countryCode.length + 1)
          : mno,
        email: email.trim(),
        password: password,
        randomNumber: randomNumber,
        selectedlangid: selectedlangid,
        mobile_code: countryCode,
        voucher_code: voucher_code,
      });
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    setLoding(true);
    var response = await Helper.GET(Urls.languages);
    console.log('response===>', response);
    setLoding(false);
    if (response.status == 200) {
      let array = response.languages;
      setlanguagearray(array);
      setselectedlang(array[0].language_name + '');
      setselectedlangid(array[0].id + '');
      setselectedlangimg(array[0].icon_img + '');
    }
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <Loader loading={loading} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={Style.container1}>
              <View>
                <Image
                  source={Images.logo}
                  style={Style.auth_img_style}
                  resizeMode="contain"
                />

                <LText style={[Style.text14_bold]}>Choose Language</LText>
                <TouchableOpacity
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      height: 45,
                      borderBottomWidth: 1,
                      borderColor: Colors.lg_gray,
                    },
                  ]}
                  onPress={() => {
                    setIsLanguagePickerVisible(true);
                  }}>
                  <Icon name={'search-web'} color={Colors.blue} size={25} />

                  <Text style={[Style.text14, { marginLeft: 10, flex: 1 }]}>
                    {selectedlang}
                  </Text>

                  <Image
                    style={{
                      marginLeft: 10,
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                    }}
                    source={{ uri: Urls.imageUrl + selectedlangimg }}
                  />
                </TouchableOpacity>

                <LText style={[Style.text14_bold]}>First Name</LText>
                <TextInput
                  style={[Style.textInput]}
                  onChangeText={(text) => setfname(text)}
                  placeholderTextColor={Colors.gray_d1}
                  value={fname}
                  selectionColor={Colors.TheamColor2}
                />

                <LText style={[Style.text14_bold]}>Last Name</LText>
                <TextInput
                  style={[Style.textInput]}
                  onChangeText={(text) => setlname(text)}
                  placeholderTextColor={Colors.gray_d1}
                  value={lname}
                  selectionColor={Colors.TheamColor2}
                />

                <LText style={[Style.text14_bold]}>Mobile Number</LText>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={mno}
                  defaultCode="GB"
                  layout="first"
                  value={mno}
                  countryPickerButtonStyle={{
                    marginRight: 0,
                  }}
                  onChangeCountry={(code) => {
                    console.log(code);
                    setCode(code.callingCode[0]);
                  }}
                  flagButtonStyle={{ paddingBottom: 4 }}
                  containerStyle={{
                    width: '100%',
                    // height: 40,
                    borderBottomColor: Colors.lg_gray,
                    borderBottomWidth: 1,
                    backgroundColor: 'transparent',
                  }}
                  textInputStyle={[Style.text14, { marginTop: 1 }]}
                  codeTextStyle={Style.text14}
                  textContainerStyle={{
                    paddingVertical: 0,
                    backgroundColor: 'transparent',
                  }}
                  onChangeFormattedText={(text) => {
                    setmno(text);
                  }}
                />

                <LText style={[Style.text14_bold]}>Email</LText>
                <TextInput
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[Style.textInput]}
                  onChangeText={(text) => setemail(text)}
                  placeholderTextColor={Colors.gray_d1}
                  value={email}
                  selectionColor={Colors.TheamColor2}
                />

                <LText style={[Style.text14_bold]}>Password</LText>
                <TextInput
                  style={[Style.textInput]}
                  onChangeText={(text) => setpassword(text)}
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
                />

                <LText style={[Style.text14_bold]}>Re - Type Password</LText>
                <TextInput
                  style={[Style.textInput, { marginBottom: 20 }]}
                  onChangeText={(text) => setpassword1(text)}
                  placeholderTextColor={Colors.gray_d1}
                  value={password1}
                  maxLength={6}
                  keyboardType="number-pad"
                  secureTextEntry={passwordView1}
                  selectionColor={Colors.TheamColor2}
                  iconName={passwordView1 ? 'eye-off' : 'eye'}
                  iconPress={() => {
                    setPasswordView1(!passwordView1);
                  }}
                  iconType="ionicons"
                />

                <LText style={[Style.text14_bold]}>
                  Do you have Gift Code?
                </LText>
                <RadioButton.Group
                  onValueChange={(newValue) => {
                    setValue(newValue);
                  }}
                  value={value}>
                  <View style={Style.rowView}>
                    <View style={[Style.rowView, { width: '45%' }]}>
                      <RadioButton
                        value="Yes"
                        color={Colors.TheamColor2}
                        uncheckedColor={Colors.gray}
                      />
                      <LText
                        style={[
                          Style.text14,
                          {
                            lineHeight: 22,
                            flex: 1,
                            paddingVertical: '3%',
                            textAlign: 'left',
                          },
                        ]}>
                        Yes
                      </LText>
                    </View>
                    <View style={[Style.rowView, { width: '45%' }]}>
                      <RadioButton
                        value="No"
                        color={Colors.TheamColor2}
                        uncheckedColor={Colors.gray}
                      />
                      <LText
                        style={[
                          Style.text14,
                          { flex: 1, paddingVertical: '3%', textAlign: 'left' },
                        ]}>
                        No
                      </LText>
                    </View>
                  </View>
                </RadioButton.Group>

                {value == 'Yes' ? (
                  <TextInput
                    style={[Style.textInput]}
                    onChangeText={(text) => setvoucher_code(text)}
                    placeholderTextColor={Colors.gray_d1}
                    value={voucher_code}
                    selectionColor={Colors.TheamColor2}
                  />
                ) : null}

                <Button
                  title="Next"
                  onPress={() => {
                    validationCheck();
                  }}
                  style={{ marginBottom: 20 }}
                  textstyle={{ fontSize: 20 }}
                />

                <View
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <CheckBox
                    iconType="font-awesome"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={checked}
                    onPress={() => setchecked(!checked)}
                    containerStyle={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginRight: 0,
                      textAlignVertical: 'center',
                      fontFamily: CustomeFonts.Poppins_Regular,
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 10,
                      flexWrap: 'wrap',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Text style={[Style.text12]}>
                      I certify that I agree to the{' '}
                    </Text>
                    <Text
                      onPress={() => {
                        navigation.navigate('WebLoadApi', {
                          flag: '1',
                        });
                      }}
                      style={[
                        Style.text12,
                        { textDecorationLine: 'underline', color: Colors.blue },
                      ]}>
                      Terms & Conditions{' '}
                    </Text>

                    <Text style={[Style.text12]}>and{' '}</Text>
                    <Text
                      onPress={() => {
                        navigation.navigate('WebLoadApi', {
                          flag: '2',
                        });
                      }}
                      style={[
                        Style.text12,
                        { textDecorationLine: 'underline', color: Colors.blue },
                      ]}>
                      Privacy Policy
                    </Text>
                  </View>
                </View>

                <LanguageModal
                  isVisible={isLanguagePickerVisible}
                  setIsVisible={setIsLanguagePickerVisible}
                  selectedlang={selectedlang}
                  selectedlangid={selectedlangid}
                  setselectedlangimg={setselectedlangimg}
                  setselectedlang={setselectedlang}
                  setselectedlangid={setselectedlangid}
                  data={languagearray}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default RTegister;
