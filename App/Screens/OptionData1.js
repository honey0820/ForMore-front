import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  useWindowDimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-picker/picker';
import TextInput1 from '../Compoment/TextInput';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import LText from '../Compoment/LText';
import CountryListView from '../Compoment/CountryListView';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validationempty } from '../Common/Validations';

import AutoHeightWebView from 'react-native-autoheight-webview';
import Row from '../Compoment/Row';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

var entartainment,
  travelings,
  sports,
  electronic_games,
  technolocgy,
  food,
  music,
  nightlife;
const OpData1 = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [country, setcountry] = useState('');
  const [countryname, setcountryname] = useState('');
  const [countryicon, setcountryicon] = useState('');
  const [countryarray, setcountryarray] = useState([]);
  const [city, setcity] = useState('');
  const [date, setDate] = useState();
  const [sex, setsex] = useState('');
  const [kids, setkids] = useState('');
  const [info, setinfo] = useState('');
  // const [Vehicle, setVehicle] = useState('');
  const [placeholder, setPlaceHolder] = useState('YYYY-MM-DD');
  const [checked, setChecked] = useState('');
  const [visibleModalCountry, setVisibleModalCountry] = useState(false);

  const isPlaceholder = (value) => {
    return value == '';
  };

  useEffect(() => {
    apiCall_Profile();
    apiCallLanguage_Info();
  }, []);

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Registration 2');
    formdata.append('language_id', lang_id + '');
    console.log('formdata==>', formdata);

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log('app_screen_language_wise==>', response);

    if (response.status == 200) {
      setinfo(response.data.content);
      console.log('esponse.data.content==>', response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCall_Profile = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('id', LocalData.Id + '');
    var response = await Helper.POST(Urls.user_detils_show, formdata);

    console.log('user_detils_show==>', response);

    setLoding(false);
    if (response.status == 200) {
      if (validationempty(response.user.residence_country_id)) {
        apiCallCountry('1');
        setcountry(response.user.residence_country_id);
      } else {
        apiCallCountry('2');
      }

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
      // setinfo(validationempty(response.user.info) ? response.user.info : '');

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
    } else {
      showToast(response.message, 'error');
      apiCallCountry('2');
    }
  };

  const apiCallCountry = async (flag) => {
    setLoding(true);
    var response = await Helper.GET(Urls.countries);
    console.log('countriesaa==>', response.countries);
    setLoding(false);
    var dataaraay = response.countries;
    if (validationempty(dataaraay)) {
      setcountryarray(dataaraay);
      if (validationempty(country)) {
        console.log('aaaa');
        for (let index = 0; index < dataaraay.length; index++) {
          const element = dataaraay[index];
          if (element.id == country) {
            setcountry(element.id);
            setcountryname(element.country_name);
          }
        }
      } else {
        console.log('bbb');
        // setcountry(dataaraay[0].id);
        // setcountryname(dataaraay[0].country_name);
      }
    }
  };

  let items = countryarray.map((item, index) => {
    return (
      <Picker.Item key={item.id} label={item.country_name} value={item.id} />
    );
  });

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Loader loading={loding} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: '70%',
              flexGrow: 1,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Image
                source={Images.logo}
                style={[Style.auth_img_style, { height: HEIGHT / 6 }]}
                resizeMode="contain"
              />

              {validationempty(info) ? (
                <AutoHeightWebView
                  style={{
                    width: '100%',
                    margin: 8,
                  }}
                  source={{
                    html: info,
                  }}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}

              <LText style={[Style.text14_bold]}>Birthday Date</LText>

              <View style={Style.textInputView}>

                <DatePicker
                  maxDate={new Date(moment())}
                  cancelBtnText={'Cancel'}
                  confirmBtnText={"Confirm"}
                  // minDate={moment().subtract(18, "years")}
                  mode="date"
                  locale="en"
                  formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                  date={date}
                  androidMode="spinner"
                  placeholder={placeholder}
                  format="YYYY-MM-DD"
                  showIcon={true}
                  iconComponent={
                    <Icon
                      size={20}
                      color={Colors.lightblack}
                      name="calendar"
                      style={{ marginRight: 15 }}
                    />
                  }
                  style={{
                    height: 35,
                    width: '100%',
                  }}
                  customStyles={{
                    placeholderText: {
                      fontSize: 14,
                      color: Colors.gray,
                    },
                    dateText: {
                      width: '100%',
                      fontFamily: CustomeFonts.ComfortaaRegular,

                    },
                    dateIcon: {
                      position: 'absolute',
                      right: 4,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      width: '100%',
                      paddingLeft: 6,
                      marginLeft: 5,
                      fontSize: 14,
                      justifyContent: 'center',
                      borderWidth: 0,
                    },
                  }}
                  onDateChange={(date) => {
                    setDate(date);
                  }}
                />
              </View>

              <LText style={[Style.text14_bold]}>Sex</LText>
              <View style={Style.textInputView}>
                <Picker
                  selectedValue={sex}
                  style={
                    isPlaceholder(sex) ? styles.placeholder : styles.picker
                  }
                  itemStyle={{
                    height: 50,
                    fontSize: 14,
                    fontFamily: CustomeFonts.ComfortaaRegular,
                  }}
                  onValueChange={(itemValue, itemIndex) => setsex(itemValue)}>
                  <Picker.Item label="Select Sex" value="" />
                  <Picker.Item label="Male" value="1" />
                  <Picker.Item label="Female" value="2" />
                  <Picker.Item label="Other" value="3" />
                </Picker>
              </View>

              <LText style={[Style.text14_bold]}>City</LText>
              <TextInput
                style={[
                  Style.textInput,
                  {
                    marginTop: 0,
                    paddingLeft: 20,
                    borderBottomColor: Colors.lg_gray,
                    borderBottomWidth: 1,
                    height: 45,
                  },
                ]}
                onChangeText={(text) => setcity(text)}
                placeholderTextColor={Colors.gray}
                value={city}
                placeholder={'Type City'}
                selectionColor={Colors.TheamColor2}
              />

              <LText style={[Style.text14_bold]}>Residence Country</LText>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: Colors.lg_gray,
                  borderBottomWidth: 1,
                  height: 45,
                }}
                onPress={() => {
                  setVisibleModalCountry(true);
                }}>
                <Image
                  style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  source={{ uri: Urls.imageUrl + countryicon }}
                />

                <TextInput
                  style={[
                    Style.textInput,
                    {
                      marginTop: 0,
                      flex: 1,
                      paddingLeft: 10,
                    },
                  ]}
                  editable={false}
                  placeholderTextColor={Colors.gray}
                  value={countryname}
                  selectionColor={Colors.TheamColor2}
                />

                <Icon
                  name="md-caret-down-outline"
                  type={'ionicon'}
                  size={13}
                  style={{ marginRight: 20 }}
                  color={Colors.gray}
                />
              </TouchableOpacity>

              <LText style={[Style.text14_bold]}>Marital Status</LText>

              <RadioButton.Group
                onValueChange={(newValue) => {
                  setChecked(newValue);
                }}
                style={{ height: 45 }}
                value={checked}>
                <View style={Style.rowView}>
                  <View style={[Style.rowView, { width: '50%' }]}>
                    <RadioButton
                      value="1"
                      color={Colors.TheamColor2}
                      uncheckedColor={Colors.gray}
                    />
                    <Text style={[Style.text14]}>Married</Text>
                  </View>
                  <View style={[Style.rowView, { width: '50%' }]}>
                    <RadioButton
                      value="2"
                      color={Colors.TheamColor2}
                      uncheckedColor={Colors.gray}
                    />
                    <Text style={[Style.text14]}>Not Married</Text>
                  </View>
                </View>
              </RadioButton.Group>

              <LText style={[Style.text14_bold]}>Kids (Below 14)</LText>
              <View style={Style.textInputView}>
                <Picker
                  selectedValue={kids}
                  style={
                    isPlaceholder(kids) ? styles.placeholder : styles.picker
                  }
                  itemStyle={{
                    height: 50,
                    fontSize: 14,
                    fontFamily: CustomeFonts.ComfortaaRegular,
                  }}
                  onValueChange={(itemValue, itemIndex) => setkids(itemValue)}>
                  <Picker.Item label="0" value="0" />
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                </Picker>
              </View>

              <Modal
                animationType="slide"
                swipeDirection={['down']}
                visible={visibleModalCountry}
                onRequestClose={() => {
                  setVisibleModalCountry(false);
                }}
                onBackdropPress={() => {
                  setVisibleModalCountry(false);
                }}
                transparent>
                <SafeAreaView
                  style={{
                    backgroundColor: 'rgba(22, 27, 70, 0.5)',
                    height: '100%',
                    padding: '5%',
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      padding: '2%',
                      height: '100%',
                    }}>
                    <Row style={{ padding: 10, flex: 0 }}>
                      <Text
                        style={[
                          Style.text14_bold,
                          { marginTop: 0, textAlign: 'center', flex: 1 },
                        ]}>
                        Select Country
                      </Text>

                      <Icon
                        name="close-outline"
                        type={'ionicon'}
                        size={25}
                        color={'#AEB2BF'}
                        onPress={() => {
                          setVisibleModalCountry(false);
                        }}
                      />
                    </Row>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={countryarray}
                      style={{ paddingBottom: '5%' }}
                      renderItem={({ item, index }) => (
                        <CountryListView
                          item={item}
                          index={index}
                          navigation={navigation}
                          onPress={() => {
                            setcountry(item.id + '');
                            setcountryname(item.country_name + '');
                            setcountryicon(item.country_icon);
                            setVisibleModalCountry(false);
                          }}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </SafeAreaView>
              </Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={{
            width: '90%',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            {/* <Button
              title="Skip"
              onPress={() => {
                navigation.navigate('OptionData2', {
                  country: country,
                  city: city,
                  date: date,
                  sex: sex,
                  checked: checked,
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
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'transparent',
              }}
              textstyle={{color: Colors.black}}
            /> */}
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Next"
              onPress={() => {
                if (validationempty(country)) {
                  navigation.navigate('OptionData2', {
                    country: country,
                    city: city,
                    date: date,
                    sex: sex,
                    checked: checked,
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
                }
                else {
                  showToast("Select Country", "error");
                }
              }}
              style={{ alignSelf: 'flex-end', backgroundColor: 'transparent' }}
              textstyle={{ color: Colors.blue }}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    width: '100%',
    color: Colors.gray,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
});

export default OpData1;
