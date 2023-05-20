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
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation}) => {
  const [loading, setLoding] = useState(false);
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
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            padding: 10,
            justifyContent: 'center',
          }}>
          <Loader loading={loading} />

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
              {title}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={Style.container2}>
            <View style={{flexGrow: 1, marginVertical: 20}}>
              <View style={{flex: 1}}>
                <Image
                  source={{uri: Urls.imageUrl + refer_icon}}
                  style={[Style.auth_img_style, {height: 45, marginTop: 20}]}
                  resizeMode="contain"
                />

                <Text
                  numberOfLines={3}
                  style={[
                    styles.text12_bold,
                    {marginTop: 6, textAlign: 'justify', marginHorizontal: 20},
                  ]}>
                  {refer_text}
                </Text>
              </View>

              <View style={{flex: 1}}>
                <Image
                  source={{uri: Urls.imageUrl + refer_icon1}}
                  style={[Style.auth_img_style, {height: 45, marginTop: 25}]}
                  resizeMode="contain"
                />

                <Text
                  numberOfLines={3}
                  style={[
                    styles.text12_bold,
                    {marginTop: 6, textAlign: 'justify', marginHorizontal: 20},
                  ]}>
                  {refer_text1}
                </Text>
              </View>

              <View style={{flex: 1}}>
                <Image
                  source={{uri: Urls.imageUrl + refer_icon2}}
                  style={[Style.auth_img_style, {height: 45, marginTop: 25}]}
                  resizeMode="contain"
                />

                <Text
                  numberOfLines={3}
                  style={[
                    styles.text12_bold,
                    {marginTop: 6, textAlign: 'justify', marginHorizontal: 20},
                  ]}>
                  {refer_text2}
                </Text>
              </View>

              <View
                style={{flex: 1, justifyContent: 'flex-end', marginTop: 10}}>
                <Mybutton
                  text="Continue"
                  onPress={() => {
                    navigation.navigate('ReferBusiness2');
                  }}
                  style={{width: '60%'}}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (validationempty(term_details)) {
                      navigation.navigate('WebLoad', {
                        flag: 'title',
                        WebLoad: term_details,
                      });
                    }
                  }}>
                  <Text
                    style={[
                      styles.text12_bold,
                      {
                        marginTop: 6,
                        textAlign: 'center',
                        textDecorationLine: 'underline',
                        fontFamily: CustomeFonts.ComfortaaLight,
                      },
                    ]}>
                    Read full terms conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
