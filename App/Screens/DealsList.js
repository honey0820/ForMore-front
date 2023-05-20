import React, { useEffect, useState } from 'react';
import {
  Linking,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Modal,
  Dimensions,
  Image,
  Text,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import Button from '../Compoment/mybutton';
import Header from '../Compoment/Header';
import Mybutton from '../Compoment/mybutton';
import LText from '../Compoment/LText';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationempty } from '../Common/Validations';
import { showToast, NoData } from '../Common/CommonMethods';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../Compoment/myTopBar';
import Swiper from 'react-native-swiper';

var latitude = '0';
var longitude = '0';

const DealList = ({ navigation }) => {
  const [selected, setselected] = useState(true);
  const [BRANDPOPUP, setBRANDPOPUP] = useState(false);
  const { width } = useWindowDimensions();
  const [info, setinfo] = useState('');
  const [catid, setcatid] = useState('');
  const [catname, setcatname] = useState('');
  const [catlist, setcatlist] = useState([]);
  const [businesslist, setbusinesslist] = useState([]);
  const [brandlist, setbrandlist] = useState([]);
  const [loding, setLoding] = useState(false);
  const [addphotovisible1, setaddphotovisible1] = useState(false);
  const [item, setitem] = useState({});
  const [index, setindex] = useState({});

  useEffect(() => {
    setLoding(true);
    if (Platform.OS == 'android') {
      Checkpermission();
    } else {
      GetLocation();
    }
  }, []);

  const Checkpermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message:
            'needs access to your current location so you can search for business',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the geolocation');
        GetLocation();
      } else {
        console.log('Geolocation permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const GetLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords);
        latitude = position.coords.latitude + '';
        longitude = position.coords.longitude + '';
        apiCallLanguage_Info();
        apiCallcategories();
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        showToast(error.message, 'error');

        apiCallLanguage_Info();
        apiCallcategories();
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000 },
    );
  };

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Deals');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log(response);
    if (response.status == 200) {
      setinfo(response.data.content);
      console.log('content', response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCallcategories = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('lang_id', lang_id);

    var response = await Helper.POST(Urls.categories, formdata);

    if (response.status == 200) {
      setcatlist(response.categories);
      if (validationempty(response.categories)) {
        setcatid('');
        setcatname('All');
        apiCallBusinesslist(response.categories[0].id + '');
        apiCallBrandlist();
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallBusinesslist = async (catid) => {
    setLoding(true);
    setbusinesslist([]);

    var formdata = new FormData();
    formdata.append('cat_id', catid);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    console.log('formdata', formdata);

    var response = await Helper.POST(Urls.offer_banners_buss_wise, formdata);

    console.log('responselist---', response);

    if (response.status == 200) {
      setLoding(false);
      setbusinesslist(response.brands);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };
  const apibrandOfferlist = async (brand_id) => {
    setLoding(true);
    setbusinesslist([]);

    var formdata = new FormData();
    formdata.append('brand_id', brand_id);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    console.log('formdata', formdata);

    var response = await Helper.POST(Urls.offer_banners_brand_wise, formdata);

    console.log('responselist', response);

    if (response.status == 200) {
      setLoding(false);
      setbusinesslist(response.brands);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallBrandlist = async () => {
    setLoding(true);
    var response = await Helper.GET(Urls.brands);
    console.log('brands', response);
    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.brands);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ marginHorizontal: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MyWallet');
                }}>
                <Image style={[styles.iconStyle]} source={Images.ic_wallet} />
              </TouchableOpacity>

              <Image
                source={Images.logo}
                style={[
                  Style.auth_img_style,
                  { flex: 1, height: HEIGHT / 8, marginTop: 5 },
                ]}
                resizeMode="contain"
              />
            </View>

            <LText
              style={[
                Style.text14_bold,
                {
                  marginTop: 0,
                  fontSize: 20,
                  textAlign: 'center',
                },
              ]}>
              Deals
            </LText>
            <View style={{ marginHorizontal: '5%' }}>
              {validationempty(info) ? (
                <AutoHeightWebView
                  // customStyle={`@font-face {font-family: ae_AlArabiya;src:url(https://arbfonts.com/wp-content/fonts/new-arabic-fonts//22326-alarabiyafont.ttf);} * {font-family: ae_AlArabiya;}`}
                  style={{
                    width: '90%',
                    margin: 10,
                  }}
                  customStyle={`* {text-align: justify; } `}
                  source={{
                    html: info,
                  }}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: '5%',
                marginHorizontal: '5%',
              }}>
              <Mybutton
                text="Business"
                onPress={() => {
                  setselected(true);
                  apiCallcategories();
                }}
                style={selected ? styles.buttonStyle1 : styles.buttonStyle2}
                textstyle={selected ? {} : { color: Colors.TheamColor2 }}
              />
              <Mybutton
                text="Brand"
                onPress={() => {
                  setselected(false);
                  setBRANDPOPUP(true);
                }}
                style={!selected ? styles.buttonStyle1 : styles.buttonStyle2}
                textstyle={!selected ? {} : { color: Colors.TheamColor2 }}
              />
            </View>

            {selected ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{ backgroundColor: '#E9E9E9', width: '30%' }}>
                  <Text
                    numberOfLines={2}
                    onPress={() => {
                      setcatid('');
                      setcatname('Recommended');
                      apiCallBusinesslist('0');
                    }}
                    style={[
                      Style.text12,
                      {
                        padding: 8,
                        backgroundColor:
                          catid == '' ? Colors.white : 'transparent',
                        color: catid == '' ? Colors.TheamColor2 : Colors.black,
                        ...Platform.select({
                          ios: { marginTop: 4 },
                          android: {},
                        }),
                      },
                    ]}>
                    {'Recommended'}
                  </Text>
                  <FlatList
                    data={catlist}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setcatid(item.id);
                          if (item.id == '0') {
                            setcatname('All');
                          } else {
                            setcatname(item.name);
                          }
                          apiCallBusinesslist(item.id + '');
                        }}>
                        <Text
                          numberOfLines={2}
                          style={[
                            Style.text12,
                            {
                              padding: 8,
                              backgroundColor:
                                catid == item.id ? Colors.white : 'transparent',
                              color:
                                catid == item.id
                                  ? Colors.TheamColor2
                                  : Colors.black,
                              ...Platform.select({
                                ios: {
                                  marginTop: 4, // as same as height
                                },
                                android: {},
                              }),
                            },
                          ]}>
                          {item.id == '0' ? 'All' : validationempty(item.name) ? item.name : ''}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={businesslist}
                    renderItem={({ item, index }) => (
                      <View style={{ marginHorizontal: 8, marginBottom: 8 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setitem(item);
                            setaddphotovisible1(true);
                            setindex(index);
                          }}
                          style={{
                            borderWidth: 1,
                            borderColor: Colors.lg_gray,
                            borderRadius: 8,
                          }}>
                          <Image
                            source={
                              validationempty(item.offer_image)
                                ? { uri: Urls.imageUrl + item.offer_image }
                                : Images.ic_placeholder
                            }
                            style={{
                              width: '100%',
                              height: WIDTH/3,
                              borderRadius: 6,
                            }}
                            resizeMode={
                              validationempty(item.offer_image)
                                ? 'cover'
                                : 'center'
                            }
                          />
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 5, marginBottom: 5 }}>
                          {validationempty(item.title_for_deals) ? (
                            <Text
                              style={[
                                Style.text14_bold,
                                { color: Colors.black, marginTop: 0 },
                              ]}>
                              {item.title_for_deals}
                            </Text>
                          ) : null}
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                Style.text14,
                                { flex: 1, color: Colors.black },
                              ]}>
                              {item.catName}
                            </Text>

                            <Pressable onPress={() => {
                              const latitude = item.latitude;
                              const longitude = item.longitude;
                              const url = Platform.select({
                                ios: `comgooglemaps://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
                                android: `geo://?q=${latitude},${longitude}`,
                              });

                              Linking.canOpenURL(url)
                                .then((supported) => {
                                  if (supported) {
                                    return Linking.openURL(url);
                                  } else {
                                    const browser_url = `https://www.google.de/maps/@${latitude},${longitude}`;
                                    return Linking.openURL(browser_url);
                                  }
                                })
                                .catch(() => {
                                  if (Platform.OS === 'ios') {
                                    Linking.openURL(
                                      `maps://?q=${latitude},${longitude}`,
                                    );
                                  }
                                });
                            }}>
                              <Text style={[Style.text14, { color: Colors.black }]}>

                                {validationempty(item.distance) ? ((item.distance).toFixed(2)) + ' Km' : ''}


                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={businesslist}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={{ marginHorizontal: 8, marginBottom: 8 }}
                      onPress={() => {
                        setitem(item);
                        setaddphotovisible1(true);
                        setindex(index);
                      }}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.lg_gray,
                          borderRadius: 8,
                        }}>
                        <Image
                          source={
                            validationempty(item.offer_image)
                              ? { uri: Urls.imageUrl + item.offer_image }
                              : Images.ic_placeholder
                          }
                          style={{
                            width: '100%',
                            height: WIDTH/3,
                            borderRadius: 6,
                          }}
                          resizeMode={'cover'}
                        />
                      </View>
                      <View style={{ marginHorizontal: 10 }}>
                        <Text
                          style={[
                            Style.text14_bold,
                            { marginTop: 0, color: Colors.black },
                          ]}>
                          {item.title_for_deals}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>

      <Modal
        // animated
        animationType="slide"
        swipeDirection={['down']}
        visible={BRANDPOPUP}
        onRequestClose={() => {
          setBRANDPOPUP(!BRANDPOPUP);
        }}
        onBackdropPress={() => {
          setBRANDPOPUP(!BRANDPOPUP);
        }}
        transparent>
        <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
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
                  setBRANDPOPUP(!BRANDPOPUP);
                }}
              />

              <View style={{ width: '100%' }}>
                <Image
                  source={Images.logo}
                  style={[
                    Style.auth_img_style,
                    { height: HEIGHT / 8, marginTop: 5 },
                  ]}
                  resizeMode="contain"
                />

                <Mybutton
                  text="Choose Brand"
                  textstyle={{ fontSize: 14 }}
                  style={{ width: WIDTH / 2, marginVertical: 10 }}
                />

                <View>
                  <FlatList
                    data={brandlist}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.con_brand,
                          {
                            width: '31%',
                            margin: 4,
                            flex: 0,
                          },
                        ]}
                        onPress={() => {
                          setBRANDPOPUP(!BRANDPOPUP);
                          apibrandOfferlist(item.id);
                        }}>
                        <Image
                          style={[styles.imageThumbnail]}
                          source={
                            validationempty(item.brand_icon)
                              ? { uri: Urls.imageUrl + item.brand_icon }
                              : Images.ic_placeholder
                          }
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    )}
                    //Setting the number of column
                    numColumns={3}
                    key={3}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<NoData />}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
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
                backgroundColor: Colors.white,
                marginTop: '10%',
                marginHorizontal: '5%',
                borderRadius: 18,
                borderWidth: 0.8,
                borderColor: Colors.lg_gray,
                paddingHorizontal: 10,
              }}>
              <TopBar
                left={Images.ic_close}
                style={{ left: -40, top: -5, height: 20 }}
                iconstyle={{ height: 30, width: 30 }}
                onPressLeft={() => {
                  setaddphotovisible1(!addphotovisible1);
                }}
              />
              <View
                style={{
                  height: '90%',
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Swiper
                  index={index}
                  showsButtons={true}
                  showsPagination={false}>
                  {businesslist.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            validationempty(item.offer_image)
                              ? { uri: Urls.imageUrl + item.offer_image }
                              : Images.ic_placeholder
                          }
                          style={{
                            width: '100%',
                            height: '50%',
                          }}
                          resizeMode={'cover'}
                        />
                        <Mybutton
                          text="Visit Business"
                          onPress={() => {
                            setaddphotovisible1(false);
                            navigation.navigate('BusinessInfo', {
                              user_id: item.user_id,
                              latitude: latitude,
                              longitude: longitude,
                            });
                          }}
                          style={{ width: '50%', marginTop: '5%' }}
                        />
                      </View>
                    );
                  })}
                </Swiper>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    resizeMode: 'contain',
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
