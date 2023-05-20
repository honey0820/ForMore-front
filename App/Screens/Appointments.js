import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast, NoData } from '../Common/CommonMethods';
import TopBar from '../Compoment/myTopBar';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import LanguageModal from '../Compoment/LanguageModal';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationempty } from '../Common/Validations';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import moment1 from 'moment';

const UserInfo = ({ navigation }) => {
  const [loading, setLoding] = useState(false);
  const [selected, setselected] = useState(true);
  const [TRLIST, setTRLIST] = useState([]);

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    setLoding(true);
    setTRLIST([]);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);
    var response = await Helper.POST(Urls.active_apportionment_view, formdata);
    console.log('===active_apportionment_view==>', response);
    if (response.status == 200) {
      setLoding(false);
      setTRLIST(response.booking_user_view);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall1 = async () => {
    setLoding(true);
    setTRLIST([]);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);
    var response = await Helper.POST(Urls.history_apportionment_view, formdata);
    console.log('===history_apportionment_view==>', response);
    if (response.status == 200) {
      setLoding(false);
      setTRLIST(response.booking_user_view);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const list2 = (booking_slot) => {
    console.log('booking_slot', booking_slot);
    return (
      <FlatList
        showsHorizontalScrollIndicator={true}
        data={booking_slot}
        renderItem={({ item, index }) => (
          // <View style={{flexDirection: 'column'}}>
          <Text style={[Style.text8, { color: Colors.black }]}>{item.time}</Text>
          // </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    console.log('===', date1);
    console.log('===', date2);
    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  }

  const list = (enddate) => {
    var date = moment(new Date()).format('DD-MM-YYYY');
    let days = getNumberOfDays(
      moment(date, 'DD-MM-YYYY'),
      moment(new Date(enddate), 'DD-MM-YYYY'),
    );
    return (
      <Text
        style={[
          Style.text12,
          { textAlign: 'center', fontSize: 9, textAlignVertical: 'center' },
        ]}>
        {days > 0 ? days + '\n' + 'Days' : '0'}
      </Text>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <Loader loading={loading} />

        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            paddingVertical: 10,
          }}>
          <View style={styles.v_sty_close}>
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

          <Loader loading={loading} />

          <Image
            source={Images.logo}
            style={[Style.auth_img_style, { height: HEIGHT / 8.5 }]}
            resizeMode="contain"
          />

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LText
              style={[
                Style.text14_bold,
                {
                  fontSize: 20,
                  textAlign: 'center',
                  marginTop: 0,
                },
              ]}>
              Appointments
            </LText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              marginHorizontal: 20,
            }}>
            <Mybutton
              text="Active"
              onPress={() => {
                apiCall();
                setselected(true);
              }}
              style={selected ? styles.buttonStyle1 : styles.buttonStyle2}
              textstyle={selected ? {} : { color: Colors.TheamColor2 }}
            />
            <Mybutton
              text="History"
              onPress={() => {
                apiCall1();
                setselected(false);
              }}
              style={!selected ? styles.buttonStyle1 : styles.buttonStyle2}
              textstyle={!selected ? {} : { color: Colors.TheamColor2 }}
            />
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              marginHorizontal: '6%',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                apiCall();
                setselected(true);
              }}>
              <Text
                style={[
                  Style.text12,
                  {
                    color: selected ? Colors.TheamColor2 : Colors.gray,
                  },
                ]}>
                ACTIVE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                apiCall1();
                setselected(false);
              }}>
              <Text
                style={[
                  Style.text12,
                  {
                    textAlign: 'right',
                    color: selected ? Colors.gray : Colors.TheamColor2,
                  },
                ]}>
                HISTORY
              </Text>
            </TouchableOpacity>
          </View> */}

          <View
            style={{
              marginTop: 6,
              flexDirection: 'row',
              width: '100%',
              paddingHorizontal: 10,
            }}>
            <Image
              style={[styles.img_main, { flex: 1.2 }]}
              source={Images.at1}
              resizeMode="contain"
            />

            <Image
              style={[styles.img_main, { flex: 1.2 }]}
              source={Images.at2}
              resizeMode={'contain'}
            />

            <Image
              style={[styles.img_main, { flex: 1.45 }]}
              source={Images.ic_buss}
              resizeMode={'contain'}
            />
            <Image
              style={[styles.img_main, { flex: 1 }]}
              source={Images.at4}
              resizeMode={'contain'}
            />
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={TRLIST}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AppointmentDetails', {
                    order_id: item.id,
                  });
                }}
                style={{
                  paddingHorizontal: 10,
                  marginBottom: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                {/* <Text
                  style={[
                    Style.text12,
                    styles.con_brand,
                    {
                      flex: 1.2,
                      fontSize: 9,
                      textAlignVertical: 'center',
                      textAlign: 'center',justifyContent:'center'
                    },
                  ]}>
                  {validationempty(item.booking_slot)
                    ? item.booking_slot[0].date
                    : ''}
                </Text> */}

                <View
                  style={[
                    styles.con_brand,
                    { flex: 1.2, justifyContent: 'center' },
                  ]}>

                  <Text style={[Style.text8, { color: Colors.black }]}> {validationempty(item.booking_slot)
                    ? item.booking_slot[0].date
                    : ''}</Text>


                </View>


                <View
                  style={[
                    styles.con_brand,
                    { flex: 1.2, justifyContent: 'center' },
                  ]}>
                  {list2(item.booking_slot)}
                </View>

                <View
                  style={[
                    styles.con_brand,
                    { flex: 1.6, justifyContent: 'center' },
                  ]}>
                  <FastImage
                    style={[
                      {
                        height: 35,
                        width: '100%',
                      },
                    ]}
                    source={
                      validationempty(item.brand_icon)
                        ? { uri: Urls.imageUrl + item.brand_icon }
                        : Images.ic_placeholder
                    }
                    resizeMode={'contain'}
                  />
                </View>

                {validationempty(item.booking_slot) ? (
                  <View
                    style={[
                      styles.con_brand,
                      { flex: 0.9, justifyContent: 'center' },
                    ]}>
                    {list(item.booking_slot[0].date)}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.con_brand,
                      { flex: 0.9, justifyContent: 'center' },
                    ]}></View>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<NoData />}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonStyle1: {
    margin: 0,
    marginRight: 10,
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: Colors.TheamColor2,
  },
  buttonStyle2: {
    margin: 0,
    marginRight: 8,
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingHorizontal: 0,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 4,
  },
  bottom_line: {
    height: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  iconStyle: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
  },
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -10,
    top: -10,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
  text16_bold: {
    fontSize: 16,
    color: Colors.TheamColor2,
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text14_bold: {
    fontSize: 14,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text12_bold: {
    fontSize: 12,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaRegular,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    borderWidth: 0.8,
  },
  img_main: {
    flex: 1,
    height: 40,
  },
  con_brand: {
    marginHorizontal: 5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  con_brand_m: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lg_gray,
  },
});

export default UserInfo;
