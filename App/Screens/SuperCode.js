import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  Dimensions,
  PermissionsAndroid,
  StyleSheet,
  Modal,
  BackHandler,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import Mybutton from '../Compoment/mybutton';
import LText from '../Compoment/LText';
import { showToast } from '../Common/CommonMethods';
import BarcodeScanner from 'react-native-scan-barcode';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationBlank, validationempty } from '../Common/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { onBackPress } from '../Compoment/backPressHandler';
import { CameraScreen } from 'react-native-camera-kit';

const Supercode = ({ navigation }) => {
  const [loding, setLoding] = useState(false);
  const [opneScanner, setopneScanner] = useState(false);
  const [qrvalue, setqrvalue] = useState('');
  const [info, setinfo] = useState('');
  const { width } = useWindowDimensions();

  useEffect(() => {
    console.log(WIDTH + '');
    apiCallLanguage_Info();
  }, []);

  const apiCallLanguage_Info = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Super code info');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    setLoding(false);
    if (response.status == 200) {
      setinfo(response.data.content);
      console.log('content', response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };
  const ApicallSubmit = async (qrvalue1) => {
    var lang_id = await AsyncStorage.getItem('lang_id');

    if (validationBlank(qrvalue1, 'Scan Code')) {
      setLoding(true);
      var id = await AsyncStorage.getItem('id');
      var formdata = new FormData();
      formdata.append('user_id', id + '');
      formdata.append('code', qrvalue1 + '');
      formdata.append('language_id', lang_id + '');
      console.log('formdata', formdata);
      var response = await Helper.POST(Urls.add_code, formdata);
      console.log(response);
      setLoding(false);
      if (response.status == 200) {
        showToast(response.Message, 'success');
      } else {
        showToast(response.Message, 'error');
      }
    }
  };

  const onOpneScanner = async () => {
    //To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'App Camera Permission',
              message: 'App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            console.warn('CAMERA Permission is granted');
            setqrvalue('');
            setopneScanner(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      setqrvalue('');
      setopneScanner(true);
    }
  };

  const renderCamera = () => {
    const isFocused = navigation.isFocused();

    if (!isFocused) {
      console.warn('isFocused not');
      return null;
    } else if (isFocused) {
      console.warn('isFocused');
      return (
        <View style={{ flex: 1,}}>
          {Platform.OS == 'android' ?
            <BarcodeScanner
              onBarCodeRead={(e) => {
                // showToast('barcode detected' + e.data, 'info');
                setqrvalue(e.data);
                setopneScanner(false);
                ApicallSubmit(e.data);
              }}
              style={{
                flex: 1,
                width: '100%',
              }}
              torchMode="off"
              cameraType="back"
            />
            :
            <CameraScreen
              style={{
                flex: 1,
                height:'100%',
                width: '100%',
              }}
              scanBarcode={true}
              showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
              laserColor='red' // (default red) optional, color of laser in scanner frame
              frameColor='white' // (default white) optional, color of border of scann
              onReadCode={(e) => {
                // showToast('barcode detected' + e.data, 'info');
                setqrvalue(e.data);
                setopneScanner(false);
                ApicallSubmit(e.data);
              }}
            >

            </CameraScreen>
          }
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <TopBar
          left={Images.ic_close}
          style={{ marginVertical: 10 }}
          iconstyle={{ height: 30, width: 30 }}
          onPressLeft={() => {
            if (!opneScanner) {
              navigation.goBack();
            } else {
              setopneScanner(false);
            }
          }}
        />
        <Loader loading={loding} />

        {!opneScanner ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={Style.container2}>
            <View>
              <Image
                source={Images.logo}
                style={[
                  Style.auth_img_style,
                  { height: HEIGHT / 7, marginTop: 20 },
                ]}
                resizeMode="contain"
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                  source={Images.ic_star}
                  style={[{ width: 30, height: 30, marginRight: 6 }]}
                  tintColor={Colors.blue}
                />

                <Text
                  style={[Style.text18, { fontSize: 22, color: Colors.blue }]}>
                  Super Code
                </Text>
              </View>

              {/* <Mybutton
                text="Super Code"
                iconname={Images.ic_star}
                tintColor={Colors.blue}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  marginBottom: 20,
                }}
                iconstyle={{width: 30, height: 30}}
                textstyle={{fontSize: 20, color: Colors.blue}}
              /> */}

              <LText style={[Style.text14_bold, { fontSize: 16 }]}>Info</LText>
              {validationempty(info) ? (
                <AutoHeightWebView
                  style={{
                    width: '95%',
                    marginVertical: 10,
                  }}
                  customStyle={`* {text-align: justify; } `}
                  source={{
                    html: info,
                  }}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}

              <Mybutton
                text="Campaigns"
                onPress={() => {
                  navigation.navigate('ChooseBrand', { flag: 'campaign' });
                }}
                style={{
                  marginTop: '15%',
                  backgroundColor: Colors.TheamColor2,
                  width: '70%',
                }}
              />

              <Mybutton
                text="Enter Code"
                onPress={() => {
                  navigation.navigate('EnterCode');
                }}
                style={{
                  marginTop: 10,
                  backgroundColor: Colors.blue,
                  width: '70%',
                }}
              />
              <Mybutton
                text="Scan Code"
                iconname={Images.ic_scan}
                onPress={() => {
                  onOpneScanner();
                }}
                style={{
                  backgroundColor: Colors.blue,
                  marginTop: 10,
                  width: '70%',
                }}
              />
              <Mybutton
                text="Upload Receipt"
                iconname={Images.ic_upload}
                onPress={() => {
                  navigation.navigate('ChooseBrand', { flag: 'uploadreceipt' });
                  // setaddphotovisible(true);
                }}
                style={{ marginVertical: 10, width: '70%' }}
              />
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              backgroundColor: Colors.black,
              flex: 1,
            }}>
            {renderCamera()}
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    width: '100%',
    color: Colors.gray,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
});

export default Supercode;
