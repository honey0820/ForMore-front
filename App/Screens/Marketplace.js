import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  FlatList,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions,
  PermissionsAndroid,
  ScrollView,
  KeyboardAvoidingView,
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
import { showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import MultiSelect from 'react-native-multiple-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { validationempty } from '../Common/Validations';
import Header from '../Compoment/Header';
import Geolocation from 'react-native-geolocation-service';
import { useIsFocused } from '@react-navigation/native';
import { sub } from 'react-native-reanimated';

var latitude = '0';
var longitude = '0';

const { height, width } = Dimensions.get('window');
const itemWidth = (width - 10) / 2;

const App = ({ navigation }) => {
  const focus = useIsFocused(); // use if focus as shown
  const { width } = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [info, setinfo] = useState('');
  const [catid, setcatid] = useState('');
  const [catname, setcatname] = useState('');
  const multiSelect = React.useRef(null);
  const multiSelect1 = React.useRef(null);
  const [selectedItems, setselecteditem] = useState([]);
  const [selectedItems1, setselecteditem1] = useState([]);
  const [catlist, setcatlist] = useState([]);
  const [subcatlist, setsubcatlist] = useState([]);
  const [brandlist, setbrandlist] = useState([]);
  const [businesslist1, setbusinesslist1] = useState([]);

  // useEffect(() => {
  //   setLoding(true);
  //   if (Platform.OS == 'android') {
  //     Checkpermission();
  //   } else {
  //     GetLocation();
  //   }
  //   setsubcatlist([]);
  //   setselecteditem([]);
  //   setselecteditem1([]);
  //   apiCallLanguage_Info();
  //   apiCallcategories();
  //   apiCallBrandlist();
  // }, [focus]);

  useEffect(() => {
    setLoding(true);
    if (Platform.OS == 'android') {
      Checkpermission();
    } else {
      GetLocation();
    }

    apiCallLanguage_Info();
    apiCallcategories();
    apiCallBrandlist();
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
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        showToast(error.message, 'error');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 3600000 },
    );
  };
  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    console.log("lang_id", lang_id);
    var formdata = new FormData();
    formdata.append('screen_name', 'Marketplace');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log("app_screen_language_wise", response);
    if (response.status == 200) {
      setinfo(response.data.content);
      console.log('content', response.data.content);
    }
  };

  const apiCallsubcategories = async (cat_idid) => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('lang_id', lang_id);
    formdata.append('cat_id[]', cat_idid);
    // for (var i = 0; i < selectedItems.length; i++) {
    //   formdata.append('cat_id[]', selectedItems[i]);
    // }
    console.log('formdata', formdata);
    var response = await Helper.POST(
      Urls.sub_category_categorie_wise,
      formdata,
    );

    if (response.status == 200) {
      console.log('response', response);
      setLoding(false);
      setsubcatlist(response.sub_category);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
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
      var ss = response.categories.splice(1);
      // var ss = response.categories;
      setcatlist(ss);
      apiCallrecomndedlist();
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallBrandlist = async () => {
    setLoding(true);

    var response = await Helper.GET(Urls.marketplace_logos);
    console.log("cars", response);
    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      var cars = response.marketplaceLogos;
      if (validationempty(cars)) {
        const updatedCarsArray2 = [...cars, cars].sort(function (a, b) {
          return a.position - b.position;
        });
        setbrandlist(updatedCarsArray2);
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const onSelectedItemsChange = (selectedItems) => {
    console.log('selectedItems', selectedItems);
    setselecteditem(selectedItems);
  };
  const onSelectedItemsChange1 = (selectedItems) => {
    console.log('selectedItems', selectedItems);
    setselecteditem1(selectedItems);
  };

  const apiCallBusinesslist = async (sub_cat_id) => {
    setLoding(true);

    var formdata = new FormData();
    formdata.append('sub_cat_id[]', sub_cat_id);
    // for (var i = 0; i < selectedItems1.length; i++) {
    //   formdata.append('sub_cat_id[]', selectedItems1[i]);
    // }
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    var response = await Helper.POST(Urls.sub_category_business, formdata);

    if (response.status == 200) {
      console.log(response);
      setLoding(false);
      if (validationempty(response.sub_category_business)) {
        navigation.navigate('SearchMarketplace', {
          businesslist: response.sub_category_business,
          latitude: latitude,
          longitude: longitude,
        });
      } else {
        Alert.alert(
          'Formore',
          'For the moment we don’t have registrered business in this category',
          [
            {
              text: 'close',
              onPress: () => { },
            },
          ],
          { cancelable: true },
        );

        // showToast('Not available', 'error');
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallrecomndedlist = async () => {
    setLoding(true);
    var selcountry = await AsyncStorage.getItem('residence_country_id');
    var formdata = new FormData();
    formdata.append('country_id', selcountry);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    var response = await Helper.POST(
      Urls.country_wise_business_position,
      formdata,
    );

    if (response.status == 200) {
      if (validationempty(response.brands)) {
        const newArrayList = [];
        const arr3 = [...response.brands];
        arr3.forEach((obj) => {
          if (!newArrayList.some((o) => o.id === obj.id)) {
            newArrayList.push({ ...obj });
          }
        });
        setbusinesslist1(newArrayList);
      }
      setLoding(false);
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
        <Header navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: HEIGHT / 5 }}>
            <View>
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
                    fontSize: 20,
                    textAlign: 'center',
                  },
                ]}>
                Marketplace
              </LText>

              {validationempty(info) ? (
                <AutoHeightWebView
                  style={{
                    width: '90%',
                    margin: 8,
                    marginHorizontal: 10,
                  }}
                  source={{
                    html: info,
                  }}
                  customStyle={`* {text-align: justify; } `}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}

              <FlatList
                style={{ paddingRight: 4, paddingTop: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={brandlist}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setcatid(item.id + '');
                      navigation.navigate('BusinessInfo', {
                        user_id: item.user_id,
                        latitude: latitude,
                        longitude: longitude,
                      });
                    }}
                    style={[
                      styles.image,
                      {
                        justifyContent: 'center',
                        marginHorizontal: 4,
                      },
                      catid === item.id
                        ? { borderColor: Colors.TheamColor2 }
                        : { borderColor: Colors.blue },
                    ]}>
                    <Image
                      source={
                        validationempty(item.brand_icon)
                          ? { uri: Urls.imageUrl + item.brand_icon }
                          : Images.ic_placeholder
                      }
                      style={[
                        {
                          alignSelf: 'center',
                          width: 46,
                          height: 46,
                          borderRadius: 8,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <View style={{ backgroundColor: '#E9E9E9', width: '30%' }}>
                  <Text
                    numberOfLines={2}
                    onPress={() => {
                      setcatid('');
                      setcatname('');
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
                    showsHorizontalScrollIndicator={false}
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
                          apiCallsubcategories(item.id + '');
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

                {catid == '' ? (
                  <View style={{ flex: 1 }}>
                    <FlatList
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                      data={businesslist1}
                      renderItem={({ item, index }) => (
                        <View style={{ flex: 1 / 3 }}>
                          <View style={styles.con_brand}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('BusinessInfo', {
                                  user_id: item.user_id,
                                  latitude: latitude,
                                  longitude: longitude,
                                });
                              }}>
                              <Image
                                style={{
                                  height: WIDTH/5,
                                  borderRadius: 8,
                                }}
                                source={
                                  validationempty(item.brand_icon)
                                    ? { uri: Urls.imageUrl + item.brand_icon }
                                    : Images.ic_placeholder
                                }
                                resizeMode={'center'}
                              />
                            </TouchableOpacity>
                          </View>
                          <Text
                            numberOfLines={2}
                            style={[
                              Style.text12,
                              {
                                marginHorizontal: 2,
                                textAlign: 'center',
                                marginBottom: 4,
                              },
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                ) : (
                  <View style={{ flex: 1 }}>
                    <FlatList
                      ListEmptyComponent={<NoData />}
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                      data={subcatlist}
                      renderItem={({ item, index }) => (
                        <View style={{ flex: 1 / 3 }}>
                          <View style={styles.con_brand}>
                            <Pressable
                              style={{ flex: 1 }}
                              onPress={() => {
                                apiCallBusinesslist(item.id);
                              }}>
                              <Image
                                style={{
                                  width: '100%',
                                  height: WIDTH/5,
                                  borderRadius: 8,
                                }}
                                source={
                                  validationempty(item.icon)
                                    ? { uri: Urls.imageUrl + item.icon }
                                    : Images.ic_placeholder
                                }
                                resizeMode={'contain'}
                              />
                            </Pressable>
                          </View>
                          <Text
                            numberOfLines={2}
                            style={[
                              Style.text12,
                              {
                                marginHorizontal: 2,
                                marginBottom: 4,
                                textAlign: 'center',
                              },
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                )}
              </View>

              {/* <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                }}>
                <MultiSelect
                  hideTags={false}
                  fixedHeight={false}
                  hideSubmitButton={true}
                  single={false}
                  items={catlist}
                  uniqueKey="id"
                  ref={(component) => {
                    multiSelect.current = component;
                  }}
                  onSelectedItemsChange={onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Select Categories"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  styleRowList={{
                    fontSize: 12,
                    lineHeight: 20,
                    marginVertical: 3,
                  }}
                  fontFamily={CustomeFonts.ComfortaaRegular}
                  itemFontFamily={CustomeFonts.ComfortaaRegular}
                  itemFontSize={12}
                  fontSize={12}
                  styleDropdownMenuSubsection={{
                    paddingLeft: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderColor: Colors.blue,
                    borderWidth: 1,
                  }}
                  styleTextTag={{fontSize: 12, lineHeight: 20}}
                  tagContainerStyle={{
                    padding: 0,
                    borderRadius: 8,
                    height: 30,
                    borderWidth: 0.6,
                  }}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#000"
                  selectedItemTextColor={Colors.TheamColor2}
                  selectedItemIconColor={Colors.TheamColor2}
                  itemTextColor="#000"
                  displayKey="name"
                  submitButtonColor={Colors.TheamColor2}
                  submitButtonText="Search"
                />

                <View>
                  <Mybutton
                    text="Search"
                    onPress={() => {
                      if (multiSelect.current.state.selector) {
                        multiSelect.current._toggleSelector();
                      }
                      apiCallsubcategories();
                    }}
                    style={{
                      marginTop: 20,
                      marginBottom: 5,
                      width: '50%',
                      backgroundColor: Colors.blue,
                    }}
                  />
                </View>
              </View>

              {validationempty(subcatlist) ? (
                <View
                  style={{
                    marginTop: 30,
                    marginHorizontal: 20,
                  }}>
                  <MultiSelect
                    hideTags={false}
                    hideSubmitButton={true}
                    single={false}
                    items={subcatlist}
                    uniqueKey="id"
                    ref={(component) => {
                      multiSelect1.current = component;
                    }}
                    fontFamily={CustomeFonts.ComfortaaRegular}
                    itemFontFamily={CustomeFonts.ComfortaaRegular}
                    onSelectedItemsChange={onSelectedItemsChange1}
                    selectedItems={selectedItems1}
                    selectText="Select Sub Categories"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={(text) => console.log(text)}
                    styleRowList={{
                      fontSize: 12,
                      lineHeight: 20,
                      marginVertical: 3,
                    }}
                    itemFontSize={12}
                    fontSize={12}
                    styleInputGroup={{borderRadius: 18}}
                    styleDropdownMenuSubsection={{
                      paddingLeft: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      borderColor: Colors.blue,
                      borderWidth: 1,
                    }}
                    styleTextTag={{fontSize: 12, lineHeight: 18}}
                    tagContainerStyle={{
                      padding: 0,
                      borderRadius: 8,
                      height: 30,
                      borderWidth: 0.6,
                    }}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#000"
                    selectedItemTextColor={Colors.TheamColor2}
                    selectedItemIconColor={Colors.TheamColor2}
                    itemTextColor="#000"
                    displayKey="name"
                  />
                </View>
              ) : null}

              {validationempty(subcatlist) && validationempty(catlist) ? (
                <Mybutton
                  text="Search"
                  onPress={() => {
                    if (multiSelect1.current.state.selector) {
                      multiSelect1.current._toggleSelector();
                    }
                    if (validationempty(selectedItems)) {
                      if (validationempty(selectedItems1)) {
                        apiCallBusinesslist();
                      } else {
                        showToast('Select subCategory', 'error');
                      }
                    } else {
                      showToast('Select Category', 'error');
                    }
                  }}
                  style={{marginVertical: 10, width: '45%'}}
                />
              ) : null} */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
  },
  con_brand: {
    marginHorizontal: 4,
    flexDirection: 'column',
    borderWidth: 0.8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
    flex: 1 / 3,
  },
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 7,
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
    height: HEIGHT / 4.6,
    width: '100%',
    marginTop: '6%',
    borderRadius: 10,
  },
});

export default App;
