import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
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
import {validationempty} from '../Common/Validations';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

const App = ({navigation, route}) => {
  const {data, flag} = route.params;
  const [loding, setLoding] = useState(false);
  const [listdata, setlistdata] = useState(false);

  useEffect(() => {
    if (flag == '1') {
    } else {
      apiCalllist();
    }
  }, []);

  const apiCalllist = async () => {
    setLoding(true);

    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);
    console.log('formdata', formdata);
    var response = await Helper.POST(Urls.notification_masters, formdata);

    setLoding(false);
    console.log('notification_masters', response);
    if (response.status == 200) {
      setlistdata(response.notificationDetails);
    } else {
      showToast(response.Message, 'error');
    }
  };

  const apiCalllDelete = async (notification_id) => {
    setLoding(true);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('notification_id', notification_id);
    formdata.append('user_id', id);
    console.log('formdata===>', formdata);
    var response = await Helper.POST(Urls.delete_notification, formdata);
    console.log('apicall===>', response);
    if (response.success == true) {
      setLoding(false);
      if (flag == '1') {
        navigation.goBack();
      } else {
        apiCalllist();
      }
    } else {
      setLoding(false);
      showToast(response.message, 'error');
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <Loader loading={loding} />

        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            padding: 10,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <Icon
              name={'ios-arrow-back-outline'}
              type={'ionicon'}
              size={25}
              onPress={() => {
                navigation.goBack();
              }}
            />

            <Text
              style={[
                styles.text14_bold,
                {
                  fontSize: 18,
                  color: Colors.blue,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Notifications
            </Text>
          </View>
          {validationempty(data) ? (
            <Card
              containerStyle={[
                styles.card_style,
                {
                  borderRadius: 15,
                  borderWidth: 0.8,
                  marginTop: '5%',
                  marginBottom: 1,
                  marginHorizontal: 10,
                },
              ]}>
              <Text style={styles.text16_bold}>{data.title}</Text>
              <Text
                style={[
                  Style.text14,
                  {marginTop: 2, color: Colors.lightblack},
                ]}>
                {data.details}
              </Text>
              <Text style={[Style.text12, {marginTop: 2, color: Colors.gray}]}>
                {moment(data.date).format('DD-MMM-YYYY')}
              </Text>

              {validationempty(data.image) ? (
                <Image
                  onPress={() => {
                    navigation.navigate('ImageLoad', {
                      gallery_img: data.image,
                    });
                  }}
                  source={{uri: Urls.imageUrl + data.image}}
                  style={{
                    width: '80%',
                    height: 120,
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                  resizeMode="contain"
                />
              ) : null}

              <View style={{position: 'absolute', right: 0, bottom: 0}}>
                <Icon
                  name={'trash-outline'}
                  type={'ionicon'}
                  size={25}
                  color={Colors.gray}
                  onPress={() => {
                    apiCalllDelete(data.id);
                  }}
                />
              </View>
            </Card>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listdata}
              renderItem={({item, index}) => (
                <Card
                  containerStyle={[
                    styles.card_style,
                    {
                      borderRadius: 15,
                      borderWidth: 0.8,
                      marginTop: '5%',
                      marginBottom: 1,
                      marginHorizontal: 10,
                    },
                  ]}>
                  <Text style={styles.text16_bold}>{item.title}</Text>
                  <Text
                    style={[
                      Style.text14,
                      {marginTop: 2, color: Colors.lightblack},
                    ]}>
                    {item.details}
                  </Text>
                  <Text
                    style={[Style.text12, {marginTop: 2, color: Colors.gray}]}>
                    {moment(item.created_at).format('DD-MMM-YYYY')}
                  </Text>

                  {validationempty(item.notification_image) ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ImageLoad', {
                          gallery_img: item.notification_image,
                        });
                      }}>
                      <Image
                        source={{uri: Urls.imageUrl + item.notification_image}}
                        style={{
                          width: '80%',
                          height: 120,
                          marginTop: 10,
                          borderRadius: 4,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ) : null}

                  {/* <Text style={[styles.text12_bold, {marginTop: 5}]}>
                    check details
                  </Text> */}

                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                    }}>
                    <Icon
                      name={'trash-outline'}
                      type={'ionicon'}
                      size={25}
                      color={Colors.gray}
                      onPress={() => {
                        apiCalllDelete(item.notification_id);
                      }}
                    />
                  </View>
                </Card>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.gray,
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
});

export default App;
