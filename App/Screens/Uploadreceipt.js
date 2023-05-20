import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Dimensions,
  Modal,
  Image,
  Text,
  useWindowDimensions,
  ImageBackground,
  TextInput,
  Platform,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationBlank, validationempty } from '../Common/Validations';
import { showToast, NoData } from '../Common/CommonMethods';
import { Card } from 'react-native-elements';
import Mybutton from '../Compoment/mybutton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
const popAction = StackActions.pop(3);

const SendGiftCard = ({ navigation, route }) => {
  const { flag, business_id, voucher_id, bussLogo, banner_image } = route.params;

  const [loding, setLoding] = useState(false);
  const { width } = useWindowDimensions();
  const [info, setinfo] = useState('');
  const [vat, setvat] = useState('');
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [addphotovisible1, setaddphotovisible1] = useState(false);
  const [profileImage, setProfileImage] = useState({});
  const [pImage, setPImage] = useState('');

  useEffect(() => {
    // setLoding(true);
    apiCallLanguage_Info();
  }, []);

  const ApicallSubmit = async (qrvalue1) => {
    if (
      validationBlank(pImage, 'Upload Receipt') &&
      validationBlank(vat, 'Enter Business VAT/NPT')
    ) {
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds

      setLoding(true);
      var id = await AsyncStorage.getItem('id');
      var formdata = new FormData();
      formdata.append('business_id', business_id + '');
      formdata.append('voucher_id', voucher_id + '');
      formdata.append('user_id', id + '');
      formdata.append('vat_number', vat + '');
      formdata.append('upload_receipt', profileImage);
      formdata.append('date_of_purchase', year + '-' + month + '-' + date);
      formdata.append('time', hours + ':' + min + ':' + sec);

      console.log('formdata', formdata);
      var response = await Helper.POST(
        Urls.add_voucher_upload_receipts,
        formdata,
      );
      setLoding(false);
      console.log('response', response);
      if (response.success == true) {
        showToast(response.message, 'success');
        navigation.dispatch(popAction);
      } else {
        showToast(response.message, 'error');
      }
    }
  };

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Upload receipt');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log(response);
    if (response.status == 200) {
      setinfo(response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const CapturePhoto1 = async () => {
    const options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose From Gallery',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      noData: true,
      saveToPhotos: false,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('responce didCancel');
      } else {
        console.log('responce ', response);
        const source = response.uri;
        setPImage(source);
        setProfileImage({
          uri: response.uri,
          name: response.fileName,
          type: response.type,
        });
      }
    });

  }
  const CapturePhoto = async () => {

    if (Platform.OS == 'ios') {
      CapturePhoto1();
    }
    else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'needs access to your camera ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        CapturePhoto1();
      }
    }


  };

  const TakePhotoselect = async () => {
    const options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose From Gallery',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      noData: true,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('responce didCancel');
      } else {
        const source = response.uri;
        setPImage(source);
        setProfileImage({
          uri: response.uri,
          name: response.fileName,
          type: response.type,
        });
      }
    });
  }

  const TakePhoto = async () => {
    if (Platform.OS == 'ios') {
      TakePhotoselect();
    }
    else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'needs access to your camera ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        TakePhotoselect();

      } else {
        console.log('Camera permission denied');
      }
    }


  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <TopBar
          left={Images.ic_close}
          style={{ marginVertical: 10 }}
          iconstyle={{ height: 30, width: 30 }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                marginHorizontal: '10%',
                flexGrow: 1,
              }}>
              <Image
                source={Images.logo}
                style={[Style.auth_img_style, { height: HEIGHT / 7 }]}
                resizeMode="contain"
              />

              <LText
                style={[
                  Style.text14_bold,
                  {
                    marginTop: 0,
                    color: Colors.TheamColor2,
                    fontSize: 20,
                    textAlign: 'center',
                  },
                ]}>
                Upload Receipt
              </LText>
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
              <View
                style={[
                  styles.con_brand,
                  { width: 100, marginTop: 20, marginBottom: 10 },
                ]}>
                <Image
                  style={[styles.imageThumbnail]}
                  source={
                    validationempty(bussLogo)
                      ? { uri: Urls.imageUrl + bussLogo }
                      : Images.ic_placeholder
                  }
                  resizeMode={'contain'}
                />

                <View style={styles.bottom_line}></View>
              </View>
              <Image
                source={
                  validationempty(banner_image)
                    ? { uri: Urls.imageUrl + banner_image }
                    : Images.logo
                }
                style={styles.img_banner}
                resizeMode="center"
              />

              <View>
                <Card containerStyle={[styles.card_input_style]}>
                  <TextInput
                    style={[Style.textInput, { marginHorizontal: 4 }]}
                    placeholderTextColor={Colors.black}
                    placeholder="Enter Business VAT/NIPT"
                    onChangeText={(text) => setvat(text)}
                    value={vat}
                    selectionColor={Colors.TheamColor2}
                  />
                </Card>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: '10%',
                }}>
                <Mybutton
                  text="Upload Receipt"
                  onPress={() => {
                    setaddphotovisible(true);
                  }}
                  textstyle={{ letterSpacing: 0, color: Colors.TheamColor2 }}
                  style={{
                    width: '70%',
                    borderColor: Colors.TheamColor2,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  }}
                />
                {validationempty(pImage) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setaddphotovisible1(!addphotovisible1);
                    }}>
                    <Image
                      source={{ uri: pImage }}
                      style={{
                        height: 50,
                        width: 50,
                        marginLeft: 6,
                        alignSelf: 'center',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Mybutton
                text="Confirm"
                onPress={() => {
                  ApicallSubmit();
                }}
                textstyle={{ letterSpacing: 0 }}
                style={{ width: '70%', marginVertical: '3%' }}
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
                <View style={styles.overlay}>
                  <View
                    style={[
                      {
                        height: 180,
                        backgroundColor: 'white',
                        elevation: 2,
                        paddingHorizontal: 15,
                        borderTopRightRadius: 12,
                        borderTopLeftRadius: 12,
                      },
                    ]}>
                    <ScrollView
                      contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}>
                      <View
                        style={{
                          marginTop: 10,
                          paddingHorizontal: 10,
                          flex: 0,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            Style.text14,
                            { textAlign: 'center', flex: 1 },
                          ]}>
                          Upload Receipt
                        </Text>

                        <Icon
                          name="close-outline"
                          type={'ionicon'}
                          size={25}
                          color={'#AEB2BF'}
                          onPress={() => {
                            setaddphotovisible(!addphotovisible);
                          }}
                        />
                      </View>

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          paddingHorizontal: 10,
                          flex: 0,
                        }}
                        onPress={() => {
                          setaddphotovisible(!addphotovisible);
                          TakePhoto();
                        }}>
                        <Icon
                          name="camera"
                          type={'ionicon'}
                          size={25}
                          color={'#AEB2BF'}
                        />
                        <LText
                          style={[
                            styles.labelText1,
                            {
                              marginLeft: 10,
                              marginTop: 1,
                              flex: 1,
                              color: Colors.gray,
                            },
                          ]}>
                          Take a Photo
                        </LText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setaddphotovisible(!addphotovisible);
                          CapturePhoto();
                        }}
                        style={{
                          flexDirection: 'row',
                          marginVertical: 10,
                          paddingHorizontal: 10,
                          flex: 0,
                        }}>
                        <Icon
                          name="image"
                          type={'ionicon'}
                          size={25}
                          color={'#AEB2BF'}
                        />
                        <LText
                          style={[
                            styles.labelText1,
                            {
                              marginLeft: 10,
                              marginTop: 1,
                              flex: 1,
                              color: Colors.gray,
                            },
                          ]}>
                          Photo Library
                        </LText>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              <Modal
                // animated
                animationType="slide"
                swipeDirection={['down']}
                visible={addphotovisible1}
                onRequestClose={() => {
                  setaddphotovisible1(!addphotovisible1);
                }}
                onBackdropPress={() => {
                  setaddphotovisible1(!addphotovisible1);
                }}
                transparent>
                <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
                  <ImageBackground
                    source={Images.back_auth}
                    style={Style.auth_img_back_style1}>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 20,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{ uri: pImage }}
                        style={{
                          height: WIDTH,
                          width: '100%',
                          alignItems: 'center',
                          borderRadius: 8,
                        }}
                        resizeMode="contain"
                      />
                      {/* </Card> */}
                    </View>

                    <View
                      style={{
                        zIndex: 1,
                        bottom: 0,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginBottom: '8%',
                        position: 'absolute',
                      }}>
                      <TouchableOpacity
                        onPressIn={() => {
                          setaddphotovisible1(!addphotovisible1);
                        }}>
                        <Image
                          source={Images.ic_close}
                          style={{
                            tintColor: Colors.blue,
                            height: 30,
                            width: 30,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </SafeAreaView>
              </Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(22, 27, 70, 0.5)',
    height: HEIGHT,
    justifyContent: 'flex-end',
  },
  img_banner: {
    height: HEIGHT / 6,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
  },
  cno_left: {
    width: WIDTH / 4,
    height: WIDTH / 4,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 0,
    marginHorizontal: 0,
  },

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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default SendGiftCard;
