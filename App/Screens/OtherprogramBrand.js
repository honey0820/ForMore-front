import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
  View,
  Modal,
  Dimensions,
  Image,
  Text,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {validationempty} from '../Common/Validations';
import {showToast, NoData} from '../Common/CommonMethods';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from 'react-native-elements';
import AutoHeightWebView from 'react-native-autoheight-webview';

const DealList = ({navigation, route}) => {
  const [addphotovisible1, setaddphotovisible1] = useState(false);
  const [loding, setLoding] = useState(false);
  const [bussLogo, setbussLogo] = useState('');
  const [code, setcode] = useState('');
  const [barcode, setbarcode] = useState('');
  const [qr_code_img, setqr_code_img] = useState('');
  const [info, setinfo] = useState('');
  const [brandlist, setbrandlist] = useState([]);
  const [progrom_list, setprogrom_list] = useState([]);

  useEffect(() => {
    apiCallLanguage_Info();
    apiCallBrandlist();
  }, []);

  const apiCallBrandlist = async () => {
    setLoding(true);
    var selcountry = await AsyncStorage.getItem('residence_country_id');
    var formdata = new FormData();
    formdata.append('country_id', selcountry);
    var response = await Helper.POST(Urls.other_business_list, formdata);
    console.log(formdata);
    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.business_list);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallLanguage_Info = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Other Programs');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    setLoding(false);
    if (response.status == 200) {
      setinfo(response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const Apicheck = async (buss_id, other_program_icon) => {
    setLoding(true);
    var user_id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('buss_id', buss_id);
    formdata.append('user_id', user_id);
    var response = await Helper.POST(Urls.other_progrom_list, formdata);
    console.log(response);
    setprogrom_list([]);
    if (response.status == 200) {
      setLoding(false);
      setprogrom_list(response.progrom_list);
      if (validationempty(response.progrom_list)) {
        setcode(response.progrom_list[0].type_code);
        setbarcode(response.progrom_list[0].barcode_image);
        setqr_code_img(response.progrom_list[0].qr_code_img);
        setaddphotovisible1(true);
      } else {
        navigation.navigate('OtherProgramAdd', {
          buss_id: buss_id,
          bussLogo: other_program_icon,
        });
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
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
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
          <TopBar
            left={Images.ic_close}
            style={{left: -40, top: -5, height: 20}}
            iconstyle={{height: 30, width: 30}}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View>
              <View
                style={{
                  flexGrow: 1,
                }}>
                <Image
                  source={Images.logo}
                  style={[
                    Style.auth_img_style,
                    {height: HEIGHT / 8, marginTop: 5},
                  ]}
                  resizeMode="contain"
                />

                <LText
                  style={[
                    Style.text14_bold,
                    {
                      marginTop: 0,
                      marginBottom: 0,
                      color: Colors.TheamColor2,
                      fontSize: 20,
                      textAlign: 'center',
                    },
                  ]}>
                  Other Programs
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

                <FlatList
                  data={brandlist}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.con_brand,
                        {
                          width: '31%',
                          margin: 4,
                          padding: 4,
                          flex: 0,
                        },
                      ]}
                      onPress={() => {
                        setbussLogo(
                          validationempty(item.other_program_icon)
                            ? item.other_program_icon
                            : item.brand_icon,
                        );
                        Apicheck(
                          item.id,
                          validationempty(item.other_program_icon)
                            ? item.other_program_icon
                            : item.brand_icon,
                        );
                      }}>
                      <Image
                        style={[styles.imageThumbnail]}
                        source={
                          validationempty(item.other_program_icon)
                            ? {uri: Urls.imageUrl + item.other_program_icon}
                            : {uri: Urls.imageUrl + item.brand_icon}
                        }
                        resizeMode={'center'}
                      />
                      <View style={styles.bottom_line}></View>
                    </TouchableOpacity>
                  )}
                  numColumns={3}
                  key={3}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<NoData />}
                />
              </View>
            </View>
          </ScrollView>

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
            <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
              <ImageBackground
                source={Images.back_auth}
                style={Style.auth_img_back_style1}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: Colors.white,
                      margin: '6%',
                      borderRadius: 18,
                      borderWidth: 0.8,
                      borderColor: Colors.lg_gray,
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                    }}>
                    <TopBar
                      left={Images.ic_close}
                      style={{left: -40, top: -5, height: 20}}
                      iconstyle={{height: 30, width: 30}}
                      onPressLeft={() => {
                        setaddphotovisible1(!addphotovisible1);
                      }}
                    />

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View>
                        <View
                          style={[
                            styles.con_brand,
                            {
                              width: 100,
                              marginBottom: 10,
                              justifyContent: 'center',
                              alignSelf: 'center',
                            },
                          ]}>
                          <Image
                            style={[
                              styles.imageThumbnail,
                              {marginVertical: 10},
                            ]}
                            source={
                              validationempty(bussLogo)
                                ? {uri: Urls.imageUrl + bussLogo}
                                : Images.logo
                            }
                            resizeMode={'contain'}
                          />
                          <View style={styles.bottom_line}></View>
                        </View>

                        <LText
                          style={[
                            Style.text14_bold,
                            {
                              alignSelf: 'center',
                              marginTop: 20,
                              marginBottom: 10,
                              fontSize: 18,
                              color: Colors.black,
                            },
                          ]}>
                          Member Already Linked
                        </LText>

                        <Card
                          containerStyle={[
                            styles.cont_sty,
                            {paddingHorizontal: 15},
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: CustomeFonts.ComfortaaBold,
                                letterSpacing: 2,
                                textAlign: 'center',
                                fontSize: 15,
                              }}>
                              {code}
                            </Text>
                          </View>
                        </Card>

                        {/* <Card containerStyle={{margin: 0}}> */}
                        <Image
                          source={{
                            uri: Urls.imageUrl + barcode,
                          }}
                          style={styles.img_barcode_style}
                          resizeMode="stretch"
                          onPress={() => {}}
                        />
                        <Image
                          source={{
                            uri: Urls.imageUrl + qr_code_img,
                          }}
                          style={[styles.img_qrcode_style, {marginTop: 10}]}
                          resizeMode="stretch"
                          onPress={() => {}}
                        />
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </ImageBackground>
            </SafeAreaView>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img_barcode_style: {height: 80, width: '100%'},
  img_qrcode_style: {height: 100, width: 100, alignSelf: 'center'},
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
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -38,
    top: -30,
  },
  con_brand: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 4,
    borderRadius: 18,
  },
  buttonStyle1: {
    flex: 1,
    margin: 0,
    marginRight: 10,
    backgroundColor: Colors.TheamColor2,
    // borderColor: Colors.blue,
    // borderWidth: 1,
  },
  buttonStyle2: {
    flex: 1,
    margin: 0,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lg_gray,
  },
  bottom_line: {
    height: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderColor: Colors.lightblack,
    borderWidth: 1.8,
    borderRadius: 35,
  },
  cno_left: {
    width: WIDTH / 4.5,
    height: 102,
    borderRadius: 8,
    borderWidth: 0.5,
    justifyContent: 'center',
    marginVertical: 0,
    marginHorizontal: 0,
  },
  cno_right: {
    flex: 1,
    borderWidth: 0.5,
    paddingLeft: 8,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginHorizontal: 0,
  },
});

export default DealList;
