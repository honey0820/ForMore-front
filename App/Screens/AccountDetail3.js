import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  FlatList,
  Switch,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import Mybutton from '../Compoment/mybutton';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import LText from '../Compoment/LText';
import {validationempty} from '../Common/Validations';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {showToast} from '../Common/CommonMethods';
import {Card} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import TextInput from '../Compoment/TextInput';
import {Picker} from '@react-native-picker/picker';
import {RadioButton} from 'react-native-paper';
import Row from '../Compoment/Row';
import CountryListView from '../Compoment/CountryListView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation, route}) => {
  const {
    fname,
    lname,
    password,
    mobile_code,
    mno,
    country,
    city,
    date,
    sex,
    checked,
    kids,
    info,
    entartainment,
    travelings,
    sports,
    electronic_games,
    technolocgy,
    food,
    music,
    nightlife,
    lang_id,
  } = route.params;

  const [loding, setLoding] = useState(false);
  const [isa, setisa] = useState(entartainment == '1' ? true : false);
  const [isb, setisb] = useState(travelings == '1' ? true : false);
  const [isc, setisc] = useState(sports == '1' ? true : false);
  const [isd, setisd] = useState(electronic_games == '1' ? true : false);
  const [ise, setise] = useState(technolocgy == '1' ? true : false);
  const [isf, setisf] = useState(food == '1' ? true : false);
  const [isg, setisg] = useState(music == '1' ? true : false);
  const [ish, setish] = useState(nightlife == '1' ? true : false);

  const toggleSwitchA = () => setisa((previousState) => !previousState);
  const toggleSwitchB = () => setisb((previousState) => !previousState);
  const toggleSwitchC = () => setisc((previousState) => !previousState);
  const toggleSwitchD = () => setisd((previousState) => !previousState);
  const toggleSwitchE = () => setise((previousState) => !previousState);
  const toggleSwitchF = () => setisf((previousState) => !previousState);
  const toggleSwitchG = () => setisg((previousState) => !previousState);
  const toggleSwitchH = () => setish((previousState) => !previousState);

  const apiCall = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('id', LocalData.Id + '');
    formdata.append('first_name', fname);
    formdata.append('last_name', lname);
    formdata.append('password', password);
    formdata.append('mobile_code', mobile_code);
    formdata.append('mobile_no', mno);
    formdata.append('sex', sex);
    formdata.append('city', city);
    formdata.append('residence_country_id', country);
    formdata.append('marital_status', checked);
    formdata.append('no_kids', kids);
    formdata.append('entartainment', isa ? '1' : '0');
    formdata.append('travelings', isb ? '1' : '0');
    formdata.append('sports', isc ? '1' : '0');
    formdata.append('electronic_games', isd ? '1' : '0');
    formdata.append('technolocgy', ise ? '1' : '0');
    formdata.append('food', isf ? '1' : '0');
    formdata.append('music', isg ? '1' : '0');
    formdata.append('nightlife', ish ? '1' : '0');
    formdata.append('info', info);
    formdata.append('lang_id', lang_id);

    console.log('user_detils_update formdata', formdata);
    var response = await Helper.POST(Urls.account_setting_update, formdata);
    console.log('user_detils_update response', response);
    setLoding(false);
    if (response.status == 200) {
      showToast(response.Message + '', 'success');
      await AsyncStorage.setItem('lang_id', response.user.lang_id + '');
      await AsyncStorage.setItem('last_name', response.user.last_name + '');
      await AsyncStorage.setItem('first_name', response.user.first_name + '');
      await AsyncStorage.setItem('mobile_no', response.user.mobile_no + '');
      await AsyncStorage.setItem('email', response.user.email + '');
      await AsyncStorage.setItem('name', response.user.name + '');
      await AsyncStorage.setItem(
        'country_name',
        response.user.country_name + '',
      );
      await AsyncStorage.setItem(
        'residence_country_id',
        response.user.residence_country_id + '',
      );

      navigation.popToTop();
      navigation.navigate('AccountSettings');
    } else {
      showToast(response.Message, 'error');
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
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
                    justifyContent: 'center',
                    marginTop: '4%',
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

                  <LText
                    style={[
                      Style.text14_bold,
                      {
                        fontFamily: CustomeFonts.ComfortaaBold,
                        fontSize: 18,
                        marginTop: 0,
                      },
                    ]}>
                    Select your interests
                  </LText>

                  <LText
                    style={[
                      Style.text14,
                      {
                        fontFamily: CustomeFonts.ComfortaaBold,
                        marginBottom: 30,
                      },
                    ]}>
                    Choose the areas of your Interest
                  </LText>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Entertainment / Arts
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchA}
                      value={isa}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Travelings
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchB}
                      value={isb}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Sports
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchC}
                      value={isc}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Electronic games
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchD}
                      value={isd}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Technology
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchE}
                      value={ise}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Food
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchF}
                      value={isf}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Music
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchG}
                      value={isg}
                    />
                  </View>

                  <View style={styles.row_style}>
                    <View style={styles.rs_style}>
                      <Image
                        source={Images.ic_tooltip}
                        style={styles.lg_style}
                        resizeMode="contain"
                      />
                      <LText
                        style={[
                          Style.text14_bold,
                          {
                            fontSize: 15,
                            flex: 1,
                            textAlign: 'left',
                            marginTop: 0,
                          },
                        ]}>
                        Nightlife
                      </LText>
                    </View>
                    <Switch
                      trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                      thumbColor={'white'}
                      onValueChange={toggleSwitchH}
                      value={ish}
                    />
                  </View>

                  <Mybutton
                    text="Save"
                    onPress={() => {
                      apiCall();
                    }}
                    style={{
                      marginTop: 10,
                      width: '50%',
                    }}
                  />
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
  lg_style: {height: 15, width: 15, marginRight: 12},
  row_style: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs_style: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
