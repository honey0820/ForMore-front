import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image, Pressable,
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
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast } from '../Common/CommonMethods';
import TopBar from '../Compoment/myTopBar';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import LanguageModal from '../Compoment/LanguageModal';
import { Icon } from 'react-native-elements';
import { validationempty } from '../Common/Validations';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserInfo = ({ navigation }) => {
  const [loading, setLoding] = useState(false);
  const [lang_id, setlang_id] = useState('');
  const [title, settitle] = useState('');
  const [refer_icon, setrefer_icon] = useState('');
  const [refer_text, setrefer_text] = useState('');
  const [refer_icon1, setrefer_icon1] = useState('');
  const [refer_text1, setrefer_text1] = useState('');
  const [refer_icon2, setrefer_icon2] = useState('');
  const [refer_text2, setrefer_text2] = useState('');
  const [term_details, setterm_details] = useState('');

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    setLoding(true);
    var lang_id = (await AsyncStorage.getItem('lang_id')) + '';
    setlang_id(lang_id);
    console.log("lang_id==", lang_id);
    var response = await Helper.GET(Urls.refer_businesses);
    console.log(response);
    setLoding(false);
    if (response.status == 200) {
      let array = response.referBusinesses;
      if (validationempty(array)) {
        setrefer_icon(array[0].refer_icon + '');
        setrefer_icon1(array[0].refer_icon1 + '');
        setrefer_icon2(array[0].refer_icon2 + '');
        if (lang_id == '1') {
          settitle(validationempty(array[0].title) ? array[0].title : '');
          setrefer_text(
            validationempty(array[0].refer_text) ? array[0].refer_text : null,
          );
          setrefer_text1(
            validationempty(array[0].refer_text1) ? array[0].refer_text1 : null,
          );
          setrefer_text2(
            validationempty(array[0].refer_text2) ? array[0].refer_text2 : null,
          );
          setterm_details(
            validationempty(array[0].term_details)
              ? array[0].term_details
              : null,
          );
        }
        if (lang_id == '2') {
          settitle(
            validationempty(array[0].albanian_title)
              ? array[0].albanian_title
              : null,
          );
          setrefer_text(
            validationempty(array[0].albanian_refer_text)
              ? array[0].albanian_refer_text
              : null,
          );
          setrefer_text1(
            validationempty(array[0].albanian_refer_text1)
              ? array[0].albanian_refer_text1
              : null,
          );
          setrefer_text2(
            validationempty(array[0].albanian_refer_text2)
              ? array[0].albanian_refer_text2
              : null,
          );
          setterm_details(
            validationempty(array[0].albanian_term_details)
              ? array[0].albanian_term_details
              : null,
          );
        }
        if (lang_id == '3') {
          settitle(
            validationempty(array[0].greek_title) ? array[0].greek_title : null,
          );
          setrefer_text(
            validationempty(array[0].greek_refer_text)
              ? array[0].greek_refer_text
              : null,
          );
          setrefer_text1(
            validationempty(array[0].greek_refer_text1)
              ? array[0].greek_refer_text1
              : null,
          );
          setrefer_text2(
            validationempty(array[0].greek_refer_text2)
              ? array[0].greek_refer_text2
              : null,
          );
          setterm_details(
            validationempty(array[0].greek_term_details)
              ? array[0].greek_term_details
              : null,
          );
        }
        if (lang_id == '4') {
          settitle(
            validationempty(array[0].italian_title)
              ? array[0].italian_title
              : null,
          );
          setrefer_text(
            validationempty(array[0].italian_refer_text)
              ? array[0].italian_refer_text
              : null,
          );
          setrefer_text1(
            validationempty(array[0].italian_refer_text1)
              ? array[0].italian_refer_text1
              : null,
          );
          setrefer_text2(
            validationempty(array[0].italian_refer_text2)
              ? array[0].italian_refer_text2
              : null,
          );
          setterm_details(
            validationempty(array[0].italian_term_details)
              ? array[0].italian_term_details
              : null,
          );
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>

        <Loader loading={loading} />

        {/* <View
          style={{
            width: '100%',
            margin: 10,
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

          <LText
            style={[
              styles.text14_bold,
              {
                fontSize: 18,
                marginTop: 0,
                color: Colors.blue,
                flex: 1,
                textAlign: 'center',
              },
            ]}>
            Refer a business for join
          </LText>
        </View> */}

        {loading ? null : <View style={{ flex: 1 }}>

          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              zIndex: 1,
              position: 'absolute',
              position: 'absolute',
              left: 10,
              top: 10
            }}
          >
            <Image
              source={Images.ic_close}
              tintColor={Colors.white}
              style={styles.img_back_style}
              resizeMode="contain"
            />
          </Pressable>

          {lang_id == '1' ?
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: Urls.imageUrl + refer_icon }}
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </View> : null}

          {lang_id == '2' ?
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: Urls.imageUrl + refer_icon1 }}
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </View> : null}

          {lang_id == '3' ?
            <View style={{ flex: 1, }}>
              <Image
                source={{ uri: Urls.imageUrl + refer_icon2 }}
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </View> : null}


          <Mybutton
            text="Continue"
            onPress={() => {
              navigation.navigate('ReferBusiness2');
            }}
            style={{ position: 'absolute', bottom: 0, width: '40%', height: 40, justifyContent: 'center', alignSelf: 'flex-end', marginBottom: 10, right: 20 }}
          />
        </View>}
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
});

export default UserInfo;
