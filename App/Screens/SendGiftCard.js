import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ImageBackground,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../Compoment/Loader';
import Mybutton from '../Compoment/mybutton';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import {
  validateEmail,
  validationBlank,
  validatePassword,
  validationempty,
} from '../Common/Validations';
import {showToast} from '../Common/CommonMethods';
import {SafeAreaView} from 'react-native-safe-area-context';

const SendGiftCard = ({navigation, route}) => {
  const {voucher_id} = route.params;
  const [loding, setLoding] = useState(false);
  const {width} = useWindowDimensions();
  const [info, setinfo] = useState('');
  const [msg, setmsg] = useState('');
  const [frname, setfrname] = useState('');
  const [email, setemail] = useState('');
  const [toname, settoname] = useState('');

  useEffect(() => {
    apiCallLanguage_Info();
  }, []);

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Gift card');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);

    if (response.status == 200) {
      setinfo(response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCall = async () => {
    if (
      validationBlank(toname, 'Enter Name of Receiver') &&
      validationBlank(email, 'Enter Email') &&
      validateEmail(email.trim(), 'Enter Valid Email') &&
      validationBlank(frname, 'Enter Your Name') &&
      validationBlank(msg, 'Enter Message')
    ) {
      var id = await AsyncStorage.getItem('id');
      setLoding(true);
      var formdata = new FormData();
      formdata.append('user_id', id);
      formdata.append('voucher_id', voucher_id);
      formdata.append('to_name', toname + '');
      formdata.append('to_email', email + '');
      formdata.append('from_name', frname + '');
      formdata.append('message', msg);

      console.log(formdata);

      var response = await Helper.POST(Urls.send_gift_card, formdata);
      console.log(response);
      setLoding(false);
      if (response.success == true) {
        showToast(response.message, 'success');
        navigation.popToTop();
      } else {
        showToast(response.message, 'error');
      }
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <Loader loading={loding} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              marginVertical: '5%',
              marginHorizontal: 10,
              backgroundColor: 'transparent',
            }}>
            <Card containerStyle={[styles.card_style]}>
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

              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <Image
                    source={Images.logo}
                    style={[Style.auth_img_style, {height: HEIGHT / 8}]}
                    resizeMode="contain"
                  />

                  <Image
                    source={Images.ic_giftcard}
                    style={[Style.auth_img_style, {height: HEIGHT / 8.5}]}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      Style.text14_bold,
                      {
                        fontSize: 20,
                        color: Colors.TheamColor2,
                        textAlign: 'center',
                      },
                    ]}>
                    Gift Card
                  </Text>

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

                  <View>
                    <Card containerStyle={[styles.card_input_style]}>
                      <TextInput
                        style={[Style.textInput, {marginHorizontal: 4}]}
                        placeholderTextColor={Colors.black}
                        placeholder="To (Name)"
                        value={toname}
                        onChangeText={(text) => settoname(text)}
                        selectionColor={Colors.TheamColor2}
                      />
                    </Card>

                    <Card containerStyle={[styles.card_input_style]}>
                      <TextInput
                        style={[Style.textInput, {marginHorizontal: 4}]}
                        placeholderTextColor={Colors.black}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => setemail(text)}
                        selectionColor={Colors.TheamColor2}
                      />
                    </Card>

                    <Card containerStyle={[styles.card_input_style]}>
                      <TextInput
                        style={[Style.textInput, {marginHorizontal: 4}]}
                        placeholderTextColor={Colors.black}
                        placeholder="From  (Name)"
                        value={frname}
                        onChangeText={(text) => setfrname(text)}
                        selectionColor={Colors.TheamColor2}
                      />
                    </Card>

                    <Card
                      containerStyle={[
                        styles.card_input_style,
                        {borderRadius: 18},
                      ]}>
                      <TextInput
                        style={[Style.textInput, {marginHorizontal: 4}]}
                        placeholderTextColor={Colors.black}
                        placeholder="Message"
                        numberOfLines={4}
                        value={msg}
                        onChangeText={(text) => setmsg(text)}
                        selectionColor={Colors.TheamColor2}
                      />
                    </Card>
                  </View>

                  <Mybutton
                    text="Send Gift Card"
                    iconname={Images.ic_send_gift}
                    onPress={() => {
                      apiCall();
                    }}
                    textstyle={{letterSpacing: 0}}
                    style={{marginTop: '10%'}}
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
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -38,
    top: -30,
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
  card_input_style: {
    borderRadius: 55,
    borderWidth: 0.8,
    padding: 0,
    margin: 1,
    marginTop: 10,
  },
  con_brand: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.6,
    borderRadius: 18,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: 80,
  },
  bottom_line: {
    height: 4,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default SendGiftCard;
