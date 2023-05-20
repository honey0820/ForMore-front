import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  Alert,
  Pressable,
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
import {validationempty} from '../Common/Validations';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation}) => {
  const {width} = useWindowDimensions();
  const [unique_no, setunique_no] = useState('');
  const [bar_code, setbar_code] = useState('');
  const [qr_code, setqr_code] = useState('');
  const [info, setinfo] = useState('');
  const [loding, setLoding] = useState(false);

  useEffect(() => {
    apiCall_Profile();
    apiCallLanguage_Info();
  }, []);

  const apiCall_Profile = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('id', LocalData.Id + '');
    var response = await Helper.POST(Urls.user_detils_show, formdata);
    setLoding(false);
    if (response.status == 200) {
      console.log(response);
      setunique_no(response.user.unique_no);
      setbar_code(response.user.bar_code);
      setqr_code(response.user.qr_code);
      // setinfo(response.user.info);
    } else {
      showToast(response.message, 'error');
      apiCallCountry('2');
    }
  };

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'View ID');
    formdata.append('language_id', lang_id + '');
    console.log(formdata);
    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);

    if (response.status == 200) {
      setinfo(response.data.content);
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        {/* <TopBar
          right={Images.ic_settings}
          onPressRight={() => {
            navigation.navigate('AccountSettings');
          }}
        /> */}

      
         <View
          style={{
            marginTop: Platform.OS == 'ios'?'15%':0,

            backgroundColor: Colors.white,
            margin: '5%',
            flex: 1,
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
            <View style={styles.v_sty_close}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={Images.ic_close}
                  style={styles.img_back_style}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Image
              source={{uri: Urls.imageUrl + qr_code}}
              style={styles.bar_code_rg}
              resizeMode="stretch"
              onPress={() => {}}
            />

            <ScrollView showsVerticalScrollIndicator={false} >
              <View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: '10%',
                  }}>
                  <Image
                    // source={Images.logo}
                    style={[
                      Style.auth_img_style,
                      {opacity: 0.1, marginVertical: 0},
                    ]}
                    resizeMode="contain"
                  />

                  {/* <Image
                    source={Images.ic_tooltip}
                    style={[
                      styles.img_style,
                      {opacity: 0.1, position: 'absolute'},
                    ]}
                    resizeMode="contain"
                  /> */}

                  <Image
                    source={Images.ic_user}
                    style={[styles.img_style, {position: 'absolute'}]}
                    resizeMode="contain"
                    onPress={() => {}}
                  />
                </View>

                <LText
                  style={[
                    Style.text14_bold,
                    {
                      alignSelf: 'center',
                      marginTop: 0,
                      marginBottom: 10,
                      fontSize: 18,
                    },
                  ]}>
                  User ID
                </LText>

                <Card
                  containerStyle={[styles.cont_sty, {paddingHorizontal: 15}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: CustomeFonts.ComfortaaBold,
                        letterSpacing: 10,
                        fontSize: 25,
                      }}>
                      {unique_no}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(unique_no);
                        showToast('Copied!!', 'info');
                      }}>
                      <Image
                        source={Images.ic_copy}
                        style={styles.img_copy_style}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  </View>
                </Card>

                {/* <Card containerStyle={{margin: 0}}> */}
                <Image
                  source={{uri: Urls.imageUrl + bar_code}}
                  style={styles.img_barcode_style}
                  resizeMode="stretch"
                  onPress={() => {}}
                />
                {/* </Card> */}

                <View>
                  <LText
                    style={[Style.text14_bold, {fontSize: 16, marginTop: 20}]}>
                    Info
                  </LText>

                  {validationempty(info) ? (
                    <AutoHeightWebView
                      style={{
                        width: '100%',
                        marginVertical: 10,
                      }}
                      customStyle={`* {text-align: justify; } `}
                      // customStyle={`@font-face {font-family: Comfortaa-Regular;src:url(file:///assets/fonts/Comfortaa-Regular.ttf);} * {font-family: Comfortaa-Regular;}`}
                      source={{
                        html: info,
                      }}
                      viewportContent={'width=device-width, user-scalable=no'}
                    />
                  ) : null}
                </View>
              </View>
            </ScrollView>
          </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -10,
    top: -10,
  },
  bar_code_rg: {
    position: 'absolute',
    top: 15,
    right: 15,
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
