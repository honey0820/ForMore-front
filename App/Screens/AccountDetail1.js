import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {showToast} from '../Common/CommonMethods';
import TopBar from '../Compoment/myTopBar';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import LanguageModal from '../Compoment/LanguageModal';
import {Icon} from 'react-native-elements';
import {
  matchPassword,
  validateEmail,
  validationBlank,
  validatePassword,
  validationempty,
  validatePhone,
  validateConfirmPassword,
} from '../Common/Validations';
import PhoneInput from 'react-native-phone-number-input';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

var entartainment,
  travelings,
  sports,
  electronic_games,
  technolocgy,
  food,
  music,
  nightlife;

const UserInfo = ({navigation}) => {
  const phoneInput = useRef(null);
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [created_at, setcreated_at] = useState('');
  const [passwordView, setPasswordView] = useState(false);
  const [loading, setLoding] = useState(false);

  const [selectedlangimg, setselectedlangimg] = useState('');
  const [selectedlang, setselectedlang] = useState('');
  const [selectedlangid, setselectedlangid] = useState('');
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const [languagearray, setlanguagearray] = useState([]);

  const [checked, setChecked] = useState('');
  const [city, setcity] = useState('');
  const [date, setDate] = useState();
  const [sex, setsex] = useState('');
  const [kids, setkids] = useState('');
  const [info, setinfo] = useState('');
  const [country, setcountry] = useState('');

  const [mobile_no, setmobile_no] = useState('');
  const [countryCode, setCode] = useState('');

  useEffect(() => {
    apiCall();
    apiCall_Profile();
  }, []);

  const apiCall_Profile = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('id', LocalData.Id + '');
    var response = await Helper.POST(Urls.user_detils_show, formdata);

    console.log('user_detils_show==>', response);

    setLoding(false);
    if (response.status == 200) {
      if (validationempty(response.user.residence_country_id)) {
        setcountry(response.user.residence_country_id);
      }

      setpassword(
        validationempty(response.user.show_password)
          ? response.user.show_password
          : '',
      );
      setcity(validationempty(response.user.city) ? response.user.city : '');
      setDate(
        validationempty(response.user.birth_date)
          ? response.user.birth_date
          : '',
      );
      setsex(validationempty(response.user.sex) ? response.user.sex + '' : '');

      setkids(
        validationempty(response.user.no_kids)
          ? response.user.no_kids + ''
          : '',
      );
      setChecked(
        validationempty(response.user.marital_status)
          ? response.user.marital_status + ''
          : '',
      );

      setfname(
        validationempty(response.user.first_name)
          ? response.user.first_name
          : '',
      );
      setlname(
        validationempty(response.user.last_name) ? response.user.last_name : '',
      );
      setemail(validationempty(response.user.email) ? response.user.email : '');
      setcreated_at(
        validationempty(response.user.created_at)
          ? response.user.created_at
          : '',
      );

      entartainment = validationempty(response.user.entartainment)
        ? response.user.entartainment
        : '0';
      travelings = validationempty(response.user.travelings)
        ? response.user.travelings
        : '0';
      sports = validationempty(response.user.sports)
        ? response.user.sports
        : '0';
      electronic_games = validationempty(response.user.electronic_games)
        ? response.user.electronic_games
        : '0';
      technolocgy = validationempty(response.user.technolocgy)
        ? response.user.technolocgy
        : '0';
      food = validationempty(response.user.food) ? response.user.food : '0';
      music = validationempty(response.user.music) ? response.user.music : '0';
      nightlife = validationempty(response.user.nightlife)
        ? response.user.nightlife
        : '0';

      setmobile_no(response.user.mobile_no);
      setCode(response.user.mobile_code);
    } else {
      showToast(response.message, 'error');
    }
  };

  const apiCall = async () => {
    setLoding(true);
    var response = await Helper.GET(Urls.languages);
    // console.log('response===>', response);
    // setLoding(false);
    if (response.status == 200) {
      let array = response.languages;
      setlanguagearray(array);
      var lang_id = await AsyncStorage.getItem('lang_id');

      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (lang_id == element.id) {
          console.log('lang_id', lang_id);
          setselectedlang(element.language_name + '');
          setselectedlangid(element.id + '');
          setselectedlangimg(element.icon_img + '');
        }
      }
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              marginTop: '6%',
              marginHorizontal: 10,
              backgroundColor: 'transparent',
            }}>
            <Card containerStyle={[styles.card_style, {height: '97%'}]}>
              <View style={styles.v_sty_close}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon
                    name={'ios-arrow-back-outline'}
                    type={'ionicon'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    marginTop: '4%',
                    flex: 1,
                  }}>
                  <Image
                    source={Images.logo}
                    style={[Style.auth_img_style, {height: HEIGHT / 7}]}
                    resizeMode="contain"
                  />

                  <Mybutton
                    text="User ID"
                    iconname={Images.ic_user_white}
                    onPress={() => {
                      navigation.navigate('Userinfo');
                    }}
                    style={{width: '70%', marginBottom: 20, marginTop: 10}}
                  />

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

                  <LText style={[Style.text14_bold]}>Member Since</LText>
                  <TextInput
                    style={[Style.textInput]}
                    value={moment(created_at).format('YYYY-MM-DD')}
                    editable={false}
                    placeholderTextColor={Colors.gray_d1}
                    selectionColor={Colors.TheamColor2}
                  />

                  <LText style={[Style.text14_bold]}>Language</LText>
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
                    <Text style={[Style.text14, {marginLeft: 1, flex: 1}]}>
                      {selectedlang}
                    </Text>

                    <Image
                      style={{
                        marginLeft: 10,
                        width: 24,
                        height: 24,
                        resizeMode: 'contain',
                      }}
                      source={{uri: Urls.imageUrl + selectedlangimg}}
                    />
                  </TouchableOpacity>

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
                    // iconName={passwordView ? 'eye-off' : 'eye'}
                    // iconPress={() => {
                    //   setPasswordView(!passwordView);
                    // }}
                  />

                  <LText style={[Style.text14_bold]}>Mobile Number</LText>

                  <TextInput
                    style={[Style.textInput]}
                    value={'+' + countryCode + ' ' + mobile_no}
                    editable={false}
                    placeholderTextColor={Colors.gray_d1}
                    selectionColor={Colors.TheamColor2}
                    iconName={'account-edit'}
                    iconPress={() => {
                      navigation.navigate('UpdateMobilenumber', {
                        fname: fname,
                        lname: lname,
                        password: password,
                        mobile_code: countryCode,
                        mno: mobile_no,
                        email: email,
                        country: country,
                        city: city,
                        date: date,
                        lang_id: selectedlangid,
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
                    }}
                  />

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

                  <View
                    style={{
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                    }}>
                    <Icon
                      name={'ios-arrow-forward'}
                      type={'ionicon'}
                      size={25}
                      onPress={() => {
                        // const checkValid =
                        //   phoneInput.current?.isValidNumber(mobile_no);

                        if (
                          validationBlank(fname, 'Enter First Name') &&
                          validationBlank(lname, 'Enter Last Name') &&
                          validationBlank(mobile_no, 'Enter Mobile Number') &&
                          validationBlank(password, 'Enter Password') &&
                          validatePassword(password)
                        ) {
                          // if (checkValid) {
                          navigation.navigate('AccountDetail2', {
                            fname: fname,
                            lname: lname,
                            password: password,
                            mobile_code: countryCode,
                            mno: mobile_no,
                            email1: email,
                            country1: country,
                            city1: city,
                            date1: date,
                            lang_id: selectedlangid,
                            sex1: sex,
                            checked1: checked,
                            kids1: kids,
                            info1: info,
                            entartainment: entartainment,
                            travelings: travelings,
                            sports: sports,
                            electronic_games: electronic_games,
                            technolocgy: technolocgy,
                            food: food,
                            music: music,
                            nightlife: nightlife,
                          });
                          // } else {
                          //   showToast('Enter Valid Mobile Number', 'error');
                          // }
                        }
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            </Card>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  v_sty_close: {
    zIndex: 1,

    position: 'absolute',
    position: 'absolute',
    left: -16,
    top: -5,
  },
  bar_code_rg: {
    position: 'absolute',
    top: 8,
    right: 0,
    height: 40,
    width: 40,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  img_barcode_style: {height: 80, width: '100%'},
  img_copy_style: {height: 25, width: 22, marginLeft: 10},
  img_style: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cont_sty: {
    padding: 6,
    margin: 0,
    borderRadius: 55,
    borderWidth: 0.8,
    // width: WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '8%',
  },
});

export default UserInfo;
