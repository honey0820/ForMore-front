import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Modal,
  Dimensions,
  Image,
  TextInput,
  Text,
  useWindowDimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationBlank, validationempty } from '../Common/Validations';
import { showToast, NoData } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Mybutton from '../Compoment/mybutton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const DealList = ({ navigation, route }) => {
  const { buss_id, bussLogo } = route.params;
  const [loding, setLoding] = useState(false);
  const { width } = useWindowDimensions();
  const [name, setname] = useState('');
  const [srname, setsrname] = useState('');
  const [code, setcode] = useState('');
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [addphotovisible1, setaddphotovisible1] = useState(false);
  const [profileImage, setProfileImage] = useState({});
  const [pImage, setPImage] = useState('');
  const [profileImage1, setProfileImage1] = useState({});
  const [pImage1, setPImage1] = useState('');
  const [profileImage2, setProfileImage2] = useState({});
  const [pImage2, setPImage2] = useState('');
  const [icclick, seticclick] = useState('1');

  useEffect(() => { }, []);

  const CapturePhoto1 = () => {

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

        if (icclick == '1') {
          setPImage(source);
          setProfileImage({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
        if (icclick == '2') {
          setPImage1(source);
          setProfileImage1({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
        if (icclick == '3') {
          setPImage2(source);
          setProfileImage2({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
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

  const TakePhoto = async () => {
    console.log('Camera');
    if (Platform.OS == 'ios') {
      console.log('Camera1');
      selectImage();
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
        selectImage();

      } else {
        console.log('Camera permission denied');
      }
    }

  };

  const selectImage = () => {

    launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
    }, (response) => {
      if (response.didCancel) {
        console.log('responce didCancel');
      } else {
        console.log(response);
        const source = response.uri;

        if (icclick == '1') {
          setPImage(source);
          setProfileImage({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
        if (icclick == '2') {
          setPImage1(source);
          setProfileImage1({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
        if (icclick == '3') {
          setPImage2(source);
          setProfileImage2({
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
        }
      }
    });
  }

  const ApicallSubmit = async () => {
    if (
      validationBlank(name, 'Enter Name') &&
      validationBlank(srname, 'Enter Surname') &&
      validationBlank(code, 'Enter Code')
    ) {
      setLoding(true);
      var id = await AsyncStorage.getItem('id');
      var formdata = new FormData();
      formdata.append('buss_id', buss_id + '');
      formdata.append('user_id', id + '');
      formdata.append('name', name + '');
      formdata.append('surname', srname);
      formdata.append('type_code', code);
      if (Object.keys(profileImage).length == 0) {
        formdata.append('upload_photo', '');
      } else {
        formdata.append('upload_photo', profileImage);
      }
      if (Object.keys(profileImage1).length == 0) {
        formdata.append('upload_photo_1', '');
      } else {
        formdata.append('upload_photo_1', profileImage1);
      }
      // if (Object.keys(profileImage2).length == 0) {
      //   formdata.append('barcode_image', '');
      // } else {
      //   formdata.append('barcode_image', profileImage2);
      // }

      console.log('formdata', formdata);
      var response = await Helper.POST(Urls.other_program_add, formdata);
      setLoding(false);
      console.log('response', response);
      if (response.status == 200) {
        showToast(response.Message, 'success');
        navigation.goBack();
      } else {
        showToast(response.Message, 'error');
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
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
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
          <TopBar
            left={Images.ic_close}
            style={{ left: -40, top: -5, height: 20 }}
            iconstyle={{ height: 30, width: 30 }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View>
              <View style={{ flexGrow: 1 }}>
                <View
                  style={[styles.con_brand, { width: 100, marginBottom: 10 }]}>
                  <Image
                    style={[styles.imageThumbnail, { marginVertical: 10 }]}
                    source={
                      validationempty(bussLogo)
                        ? { uri: Urls.imageUrl + bussLogo }
                        : Images.logo
                    }
                    resizeMode={'contain'}
                  />
                  <View style={styles.bottom_line}></View>
                </View>

                <View style={{ justifyContent: 'center' }}>
                  <Card containerStyle={[styles.card_input_style]}>
                    <TextInput
                      style={[Style.textInput, { marginHorizontal: 4 }]}
                      placeholderTextColor={Colors.black}
                      placeholder="Name"
                      onChangeText={(text) => setname(text)}
                      value={name}
                      selectionColor={Colors.TheamColor2}
                    />
                  </Card>
                </View>
                <View>
                  <Card containerStyle={[styles.card_input_style]}>
                    <TextInput
                      style={[Style.textInput, { marginHorizontal: 4 }]}
                      placeholderTextColor={Colors.black}
                      placeholder="Surname"
                      onChangeText={(text) => setsrname(text)}
                      value={srname}
                      selectionColor={Colors.TheamColor2}
                    />
                  </Card>
                </View>
                <View>
                  <Card containerStyle={[styles.card_input_style]}>
                    <TextInput
                      style={[Style.textInput, { marginHorizontal: 4 }]}
                      placeholderTextColor={Colors.black}
                      placeholder="Type Code"
                      onChangeText={(text) => setcode(text)}
                      value={code}
                      maxLength={15}
                      selectionColor={Colors.TheamColor2}
                    />
                  </Card>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}>
                  <Mybutton
                    text="Upload Image1"
                    onPress={() => {
                      seticclick('1');
                      setaddphotovisible(true);
                    }}
                    textstyle={{ letterSpacing: 0, color: Colors.TheamColor2 }}
                    style={{
                      flex: 1,
                      borderColor: Colors.TheamColor2,
                      borderWidth: 1,
                      backgroundColor: 'transparent',
                    }}
                  />
                  {validationempty(pImage) ? (
                    <TouchableOpacity
                      onPress={() => {
                        seticclick('1');
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
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}>
                  <Mybutton
                    text="Upload Image2"
                    onPress={() => {
                      seticclick('2');
                      setaddphotovisible(true);
                    }}
                    textstyle={{ letterSpacing: 0, color: Colors.TheamColor2 }}
                    style={{
                      flex: 1,
                      borderColor: Colors.TheamColor2,
                      borderWidth: 1,
                      backgroundColor: 'transparent',
                    }}
                  />
                  {validationempty(pImage1) ? (
                    <TouchableOpacity
                      onPress={() => {
                        seticclick('2');
                        setaddphotovisible1(!addphotovisible1);
                      }}>
                      <Image
                        source={{ uri: pImage1 }}
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
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}>
                  <Mybutton
                    text="Barcode Image"
                    onPress={() => {
                      seticclick('3');
                      setaddphotovisible(true);
                    }}
                    textstyle={{letterSpacing: 0, color: Colors.TheamColor2}}
                    style={{
                      flex: 1,
                      borderColor: Colors.TheamColor2,
                      borderWidth: 1,
                      backgroundColor: 'transparent',
                    }}
                  />
                  {validationempty(pImage2) ? (
                    <TouchableOpacity
                      onPress={() => {
                        seticclick('3');
                        setaddphotovisible1(!addphotovisible1);
                      }}>
                      <Image
                        source={{uri: pImage2}}
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
                </View> */}
              </View>
            </View>

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
                        style={[Style.text14, { textAlign: 'center', flex: 1 }]}>
                        Upload Image
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
                      source={{
                        uri:
                          icclick == '1'
                            ? pImage
                            : icclick == '2'
                              ? pImage1
                              : pImage2,
                      }}
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
          </ScrollView>

          <Mybutton
            text="Save"
            onPress={() => {
              ApicallSubmit();
            }}
            textstyle={{ letterSpacing: 0 }}
            style={{
              width: '50%',
              marginVertical: '6%',
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
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
  con_brand: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.8,
    borderRadius: 8,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: 70,
  },
  bottom_line: {
    height: 4,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  img_banner: {
    height: HEIGHT / 6,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    // borderColor: Colors.lg_gray,
    // borderWidth: 0.2,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '8%',
  },
  card_input_style: {
    borderRadius: 55, justifyContent: 'center', alignItems: 'center',
    height: 56,
    borderWidth: 0.8,
    padding: 0,
    margin: 1,
    marginTop: 10,
  },
});

export default DealList;
