import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../Compoment/Header';
import Mybutton from '../Compoment/mybutton';
import NfcManager, { NfcTech, Ndef, NfcAdapter } from 'react-native-nfc-manager';
import { showToast } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../Compoment/Loader';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validationempty } from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';

const MyRewardMain = ({ navigation }) => {
  const [loding, setLoding] = useState(false);
  const [info, setinfo] = useState('');
  const [info1, setinfo1] = useState('');
  const [addphotovisible, setaddphotovisible] = useState(false);

  useEffect(() => {
    apiCallLanguage_Info();
    apiCallLanguage_Info1();
  }, []);

  const apiCallLanguage_Info = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'My Rewards');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    setLoding(false);
    if (response.status == 200) {
      setinfo(response.data.content);
    }
  };
  const apiCallLanguage_Info1 = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Scan Tag');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    setLoding(false);
    if (response.status == 200) {
      setinfo1(response.data.content);
    }
  };

  const apiCall_Nfc = async (nfc_code) => {
    setLoding(true);
    var user_id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('nfc_code', nfc_code);
    formdata.append('user_id', user_id + '');

    var response = await Helper.POST(Urls.nfc_scan, formdata);
    console.log('response', response);
    setLoding(false);
    if (response.status == 200) {
      showToast(response.Message, 'success');
      if (response?.rewards.stamps == response?.rewards.setup_level) {
        navigation.navigate('RewardVoucher', {
          business_id: response?.rewards.buss_id,
          bussLogo: '',
          flag: 'stamp',
        });
      } else {
        navigation.navigate('LoyaltyPoints', { itemdata: response.rewards });
      }
    } else {
      showToast(response.Message, 'error');
    }
  };

  const readNdef = async () => {
    try {
      // await NfcManager.requestTechnology(NfcTech.Ndef);

      await NfcManager.requestTechnology([NfcTech.Ndef], {
        isReaderModeEnabled: true,
        readerModeFlags:
          // eslint-disable-next-line no-bitwise
          NfcAdapter.FLAG_READER_NFC_A |
          NfcAdapter.FLAG_READER_NFC_V |
          NfcAdapter.FLAG_READER_NFC_BARCODE |
          NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK |
          NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS,
      });

      const tag = await NfcManager.getTag();
      console.log(tag);
      setaddphotovisible(false);
      if (validationempty(tag)) {
        if (validationempty(tag.id)) {
          apiCall_Nfc(tag.id);
        } else {
          showToast('Tag not found!');
        }
      } else {
        showToast('Tag not found!!');
      }
    } catch (ex) {
      setaddphotovisible(false);
      console.log('Tag ex', ex);
      showToast(ex + '', 'error');
    } finally {
      // stop the nfc scanning
      setaddphotovisible(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Header navigation={navigation} />
        <Loader loading={loding} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: '100%',
          }}>
          <View>
            <Image
              source={Images.logo}
              style={[Style.auth_img_style, { height: HEIGHT / 6 }]}
              resizeMode="contain"
            />

            <Mybutton
              text="User ID"
              iconname={Images.ic_user_white}
              onPress={() => {
                navigation.navigate('Userinfo');
              }}
              style={{ marginBottom: '20%', marginTop: 10, width: '50%' }}
            />

            <View style={{ flexDirection: 'row', flex: 1 }}>

              {Platform.OS == 'ios' ? <Image style={styles.iconStyle} /> :
                <TouchableOpacity
                  onPress={() => {
                    NfcManager.isSupported().then((supported) => {
                      if (supported) {
                        NfcManager.start();
                        readNdef();
                        setaddphotovisible(true);
                      } else {
                        showToast('no nfc support', 'error');
                      }
                    });
                  }}>
                  <Image style={styles.iconStyle} source={Images.ic_nfc_scan} />
                </TouchableOpacity>
              }
              <View style={{ flex: 1 }}>
                {validationempty(info) ? (
                  <AutoHeightWebView
                    style={{
                      width: '90%',
                      marginHorizontal: 10,
                    }}
                    source={{
                      html: info,
                    }}
                    viewportContent={'width=device-width, user-scalable=no'}
                  />
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TransactionHistory');
                }}>
                <Image style={styles.iconStyle} source={Images.ic_info} />
              </TouchableOpacity>
            </View>

            <Mybutton
              text="My Rewards"
              onPress={() => {
                navigation.navigate('MyReward');
              }}
              style={{ marginTop: '20%', width: '50%' }}
            />

            <Modal
              // animated
              animationType="slide"
              swipeDirection={['down']}
              visible={addphotovisible}
              onRequestClose={() => {
                setaddphotovisible(!addphotovisible);
              }}
              onBackdropPress={() => {
                setaddphotovisible(!addphotovisible);
              }}
              transparent>
              <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
                <ImageBackground
                  source={Images.back_auth}
                  style={Style.auth_img_back_style}>
                  <View style={{ flex: 1, margin: 20 }}>
                    <Image
                      source={Images.logo}
                      style={[Style.auth_img_style, { height: HEIGHT / 6 }]}
                      resizeMode="contain"
                    />

                    <View
                      style={{
                        backgroundColor: Colors.white,
                        borderRadius: 18,
                        borderWidth: 0.8,
                        borderColor: Colors.lg_gray,
                        paddingVertical: 20,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                      }}>
                      <Text
                        style={[
                          Style.text14_bold,
                          {
                            marginTop: 0,
                            fontSize: 18,
                            textAlign: 'center',
                          },
                        ]}>
                        Ready to Scan
                      </Text>

                      {validationempty(info1) ? (
                        <AutoHeightWebView
                          style={{
                            marginTop: 15,
                            width: '90%',
                            marginHorizontal: 16,
                          }}
                          source={{
                            html: info1,
                          }}
                          customStyle={`* {text-align: justify; } `}
                          viewportContent={
                            'width=device-width, user-scalable=no'
                          }
                        />
                      ) : null}

                      <Image
                        style={[styles.imageThumbnail, { marginVertical: 10 }]}
                        source={Images.ic_scan_p}
                        resizeMode={'contain'}
                      />

                      <Mybutton
                        text="Cancel"
                        onPress={() => {
                          setaddphotovisible(false);
                          NfcManager.cancelTechnologyRequest();
                        }}
                        style={{ marginTop: '8%', width: '55%' }}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </SafeAreaView>
            </Modal>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: RFValue(30),
    height: RFValue(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageThumbnail: {
    width: '100%',
    height: 100,
  },
});

export default MyRewardMain;
