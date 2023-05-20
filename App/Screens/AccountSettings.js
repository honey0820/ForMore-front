import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text, Modal,
  ImageBackground,
  TextInput,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { CheckLogin, Checkguest } from '../Common/CommonMethods';

import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../Compoment/Header';
import Home_header from '../Compoment/Home_header';
import { showToast } from '../Common/CommonMethods';
import { logout } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import LText from '../Compoment/LText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationempty } from '../Common/Validations';
import SugnUpModal from '../Compoment/SugnUpModal';

var email = "", lang_id = "", imag = "Images.icd4";
const MyRewardMain = ({ navigation }) => {
  const [loding, setLoding] = useState(false);
  const [addphotovisible, setaddphotovisible] = useState(false);

  const [signupickerVisible, setsignupickerVisible] = useState(false);

  useEffect(() => {
    Data();
  }, []);

  const Data = async () => {
    lang_id = await AsyncStorage.getItem('lang_id');
    console.log(lang_id)
    if (lang_id == "1") {
      imag = Images.icd4;
    }
    if (lang_id == "2") {
      imag = Images.icd3;
    }
    if (lang_id == "3") {
      imag = Images.icd2;
    }
    if (lang_id == "4") {
      imag = Images.icd1;
    }
    email = await AsyncStorage.getItem('email');
  }

  const ApicallDelete = async () => {
    setLoding(true);
    var id = await AsyncStorage.getItem('id');

    var response = await Helper.GET('delete_user_account/' + id);
    console.log('===>', response);
    if (response.status == 200) {
      setLoding(false);
      logout(navigation);
    } else {
      setLoding(false);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />

      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <Header navigation={navigation} />
        <Loader loading={loding} />

        <SugnUpModal
          isVisible={signupickerVisible}
          setIsVisible={setsignupickerVisible}
          navigation={navigation}

        />


        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Image
              source={Images.logo}
              style={[Style.auth_img_style, { height: HEIGHT / 8 }]}
              resizeMode="contain"
            />
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('MyWallet');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}>
                <Image style={[styles.iconStyle]} source={Images.ic_wallet} />
              </TouchableOpacity>

              <LText
                style={[
                  Style.text14_bold,
                  {
                    marginTop: 0,
                    flex: 1,
                    fontSize: 20,
                    textAlign: 'center',
                  },
                ]}>
                Account / Settings
              </LText>
            </View>
            <View style={{ paddingHorizontal: '8%' }}>
              <Home_header
                left={Images.ic_s4}
                text={'Account Details'}
                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('AccountDetail1');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s6}
                text={'Notifications'}

                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('Notification', { flag: '2' });
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}


                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />

              <Home_header
                left={Images.ic_s2}
                text={'Orders'}
                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('MyOrders');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />

              <Home_header
                left={Images.ic_s3}
                text={'Appointments'}
                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('Appointments');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}

                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s10}
                text={'Refer a Business'}

                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('ReferBusiness1');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}


                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s8}
                text={'Link Other Programs'}

                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('OtherprogramBrand');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s1}
                text={'Tutorial'}
                onPress={() => {
                  navigation.navigate('Tutorial', { flag: '1' });
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />

              <Home_header
                left={Images.ic_s5}
                text={'Rate App'}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
                onPress={() => {
                  const APP_STORE_LINK =
                    'itms://itunes.apple.com/us/app/apple-store/com.formore?mt=8';
                  const PLAY_STORE_LINK = 'market://details?id=com.formore';

                  if (Platform.OS == 'ios') {
                    Linking.openURL(APP_STORE_LINK).catch((err) =>
                      console.error('An error occurred', err),
                    );
                  } else {
                    Linking.openURL(PLAY_STORE_LINK).catch((err) =>
                      console.error('An error occurred', err),
                    );
                  }
                }}
              />

              <Home_header
                left={Images.ic_s7}
                text={'Get in touch'}
                onPress={() => {
                  navigation.navigate('Getintouch');
                  // Linking.openURL('mailto:' + 'vratimosdimitris@gmail.com');
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s8}
                text={'Terms & Conditions'}
                onPress={() => {
                  navigation.navigate('WebLoadApi', {
                    flag: '1',
                  });
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />
              <Home_header
                left={Images.ic_s9}
                text={'Privacy Policy'}
                onPress={() => {
                  navigation.navigate('WebLoadApi', {
                    flag: '2',
                  });
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />

              <Home_header
                left={Images.ic_delete}
                text={'Delete Account'}

                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    setaddphotovisible(true);
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
              />

              <Home_header
                textStyle={{
                  color: Colors.blue,
                  fontFamily: CustomeFonts.ComfortaaBold,
                }}
                left={Images.ic_s11}
                text={'Logout'}

                onPress={async () => {
                  logout(navigation);
                  // var id = await AsyncStorage.getItem('id');
                  // if (validationempty(id)) {
                  //   logout(navigation);
                  // }
                  // else {
                  //   setsignupickerVisible(true);
                  // }
                }}


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

                <View style={{ flex: 1, backgroundColor: 'white' }}>
                  <Loader loading={loding} />

                  <Pressable
                    onPress={() => {
                      setaddphotovisible(!addphotovisible);
                    }}
                    style={{
                      zIndex: 1,
                      position: 'absolute',
                      position: 'absolute',
                      left: 20,
                      top: 40
                    }}
                  >
                    <Image
                      source={Images.ic_close}
                      style={styles.img_back_style}
                      resizeMode="contain"
                    />
                  </Pressable>


                  <View style={{ width: '100%', height: '100%' }}>
                    <Image
                      source={imag}
                      resizeMode={'stretch'}
                      style={{ width: WIDTH, height: '100%' }}
                    >
                    </Image>

                    <Button
                      title="Delete Account"
                      onPress={() => {
                        Alert.alert(
                          'Are you sure you want to delete your account?\n',
                          'This action cannot be reversed and it will delete all your transactions, vouchers, offers etc. among with your  complete profile data!',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Delete',
                              onPress: () => {
                                ApicallDelete();
                              },
                            },
                          ],
                          {
                            cancelable: true,
                          },
                        );

                      }}
                      style={{ width: 160, position: 'absolute', bottom: 0, marginBottom: 30 }}
                      textstyle={{ fontSize: 14, marginTop: 0 }}
                    />
                  </View>

                  {/* <View style={{ marginBottom: 10 }}></View> */}


                  {/* <View style={{ marginLeft: 20 }} >
                      <Pressable
                        onPress={() => {
                          setaddphotovisible(!addphotovisible);
                        }}>
                        <Image
                          source={Images.ic_close}
                          style={styles.img_back_style}
                          resizeMode="contain"
                        />
                      </Pressable>
                    </View>

                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignSelf: 'center' }}>


                      <Image
                        source={Images.ic_delete_img}
                        style={{ width: WIDTH, height: WIDTH / 3 }}
                        resizeMode="contain"
                      />
                      <View style={{ margin: 20, marginTop: 25 }}>
                        <LText style={Style.text14}>
                          {'Keep in mind that it will permanently erase your entire transactions, points or stamps collected so far.'}
                        </LText>
                        <Text>{'\n'}</Text>
                        <LText style={Style.text14}>
                          {'Are you sure you want to delete your For More account? If yes, click to Send email to proceed with deleting your account.'}
                        </LText>
                      </View>

                      <LText style={[Style.text14_bold, { textAlign: 'center', marginTop: 10 }]}
                        onPress={() => {
                          Linking.openURL('mailto:' + 'support@for-more.eu');
                        }}>Send Email</LText>

                    </ScrollView> */}
                </View>

              </Modal>

            </View>
          </View>
        </ScrollView>
      </ImageBackground >
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: RFValue(30),
    height: RFValue(30),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  v_sty_close: {
    // zIndex: 1,
    // position: 'absolute',
    // position: 'absolute',
    // left: 6,
    // top: -12,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
});

export default MyRewardMain;
