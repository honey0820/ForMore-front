import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Linking,
  PermissionsAndroid,
  TouchableNativeFeedback,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../Compoment/Loader';
import Mybutton from '../Compoment/mybutton';
import TopBar from '../Compoment/myTopBar';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationempty } from '../Common/Validations';
import Geolocation from 'react-native-geolocation-service';

const UserInfo = ({ navigation, route }) => {
  const { flag, businesslist, latitude, longitude } = route.params;
  const { width } = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [isclick, setisclick] = useState(false);
  const [info, setinfo] = useState('');
  const [catid, setcatid] = useState('');
  const [catlist, setcatlist] = useState([]);
  const [businesslist1, setbusinesslist1] = useState([]);
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    apiCallcategories();
    apiCallLanguage_Info();
  }, []);

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'By Distance');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);

    if (response.status == 200) {
      setinfo(response.data.content);
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
      setLoding(false);
      // var ss = response.categories.splice(1);
      var ss = response.categories;
      setcatlist(ss);
      if (flag == '1') {
        setisclick(true);
        setcatid(ss[0].id + '');
        apiCallBusinesslist(ss[0].id + '');
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallBusinesslist = async (selectedItems) => {
    var residence_country_id = await AsyncStorage.getItem(
      'residence_country_id',
    );
    setLoding(true);
    setbusinesslist1([]);
    var formdata = new FormData();
    formdata.append('cat_id[]', selectedItems);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);
    formdata.append('country_id', residence_country_id);

    console.log('formdata', formdata);
    var response = await Helper.POST(Urls.category_search_business, formdata);
    console.log(response);
    if (response.status == 200) {
      setLoding(false);
      setbusinesslist1(response.brands);
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
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <TopBar
          left={Images.ic_close}
          style={{ left: -10, top: 12, height: 20 }}
          iconstyle={{ height: 30, width: 30 }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{}}>
            <Image
              source={Images.logo}
              style={[Style.auth_img_style, { height: HEIGHT / 8 }]}
              resizeMode="contain"
            />
            <View style={{ marginHorizontal: '5%' }}>
              {validationempty(info) ? (
                <AutoHeightWebView
                  style={{
                    width: '100%',
                    marginVertical: 8,
                  }}
                  source={{
                    html: info,
                  }}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}
            </View>

            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <View style={{ backgroundColor: '#E9E9E9', width: '30%' }}>
                <FlatList
                  data={catlist}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setcatid(item.id);
                        setisclick(true);
                        apiCallBusinesslist(item.id);
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
                        {item.id == '0' ? 'All' : item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  style={{ width: '100%', flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                  data={isclick ? businesslist1 : businesslist}
                  renderItem={({ item, index }) => (
                    <View>
                      <View
                        style={{
                          marginHorizontal: 10,
                          marginBottom: 10,
                        }}>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('BusinessInfo', {
                                user_id: item.user_id,
                                latitude: latitude,
                                longitude: longitude,
                              });
                            }}>
                            <Image
                              source={
                                validationempty(item.header_banner)
                                  ? { uri: Urls.imageUrl + item.header_banner }
                                  : Images.nophoto
                              }
                              style={styles.img_banner}
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>

                          <LText
                            style={[
                              Style.text12,
                              {
                                marginRight: 22,
                                marginBottom: 8,
                                paddingHorizontal: 4,
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                backgroundColor: Colors.white,
                                borderRadius: Platform.OS == 'ios' ? 8 : 5,
                              },
                            ]}>

                            {validationempty(item.distance) ? ((item.distance).toFixed(2)) + ' Km' : ''}

                          </LText>

                          <View
                            style={[
                              styles.con_brand,
                              {
                                marginLeft: '10%',
                                position: 'absolute',
                                left: 0,
                              },
                            ]}>
                            <Image
                              style={styles.imageThumbnail}
                              source={
                                validationempty(item.brand_icon)
                                  ? { uri: Urls.imageUrl + item.brand_icon }
                                  : Images.ic_placeholder
                              }
                              resizeMode={'center'}
                            />
                          </View>
                        </View>

                        <View
                          style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                          <LText
                            style={[
                              Style.text12,
                              {
                                color: Colors.blue,
                                flex: 1,
                                fontFamily: CustomeFonts.ComfortaaBold,
                              },
                            ]}>
                            {item.name}
                          </LText>
                          <Mybutton
                            onPress={() => {
                              const latitude = item.latitude;
                              const longitude = item.longitude;

                              const daddr = `${latitude},${longitude}`;
                              const company = Platform.OS === "ios" ? "apple" : "google";
                              Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);

                              // const url = Platform.select({
                              //   ios: `maps://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
                              //   android: `geo://?q=${latitude},${longitude}`,
                              // });
                              // Linking.canOpenURL(url)
                              //   .then((supported) => {
                              //     if (supported) {
                              //       console.log("supported",url);
                              //       return Linking.openURL(url);
                              //     } else {
                              //       const browser_url = `https://www.google.de/maps/@${latitude},${longitude}`;
                              //       return Linking.openURL(browser_url);
                              //     }
                              //   })
                              // .catch(() => {});
                            }}
                            text="Directions"
                            style={{
                              backgroundColor: Colors.blue,
                              paddingHorizontal: 4,
                              paddingVertical: 4,
                            }}
                            textstyle={{ fontSize: 10 }}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<NoData />}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  con_brand: {
    width: 60,
    height: 60,
    borderWidth: 0.8,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    // borderRadius: 8,
    // borderWidth: 1,
    // resizeMode: 'center',
  },
  img_back_style: {
    height: 30,
    width: 30,
    marginRight: 5,
    marginBottom: 5,
  },
  card_style: {
    borderRadius: 18,
    width: '91%',
    borderWidth: 0.8,
    paddingHorizontal: '2%',
  },
  img_banner: {
    height: HEIGHT / 5.2,
    width: '100%',
    marginTop: '6%',
    borderRadius: 10,
  },
});

export default UserInfo;
