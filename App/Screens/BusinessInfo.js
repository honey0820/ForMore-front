import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  PermissionsAndroid,
  Text,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  Linking,
  Platform,
  StyleSheet,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import { ScrollView } from 'react-native-gesture-handler';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Header from '../Compoment/Header';
import { Card } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Mybutton from '../Compoment/mybutton';
import { CheckBox } from 'react-native-elements';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationempty, validationBlank } from '../Common/Validations';
import { showToast, NoData } from '../Common/CommonMethods';
import { Rating, RatingProps, AirbnbRating } from 'react-native-elements';
import TopBar from '../Compoment/myTopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import LText from '../Compoment/LText';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import { cos } from 'react-native-reanimated';
import SugnUpModal from '../Compoment/SugnUpModal';


const Businessinfo = ({ navigation, route }) => {
  const { user_id, latitude, longitude } = route.params;
  const [checked, setchecked] = useState('');
  const [checkedpoint, setcheckedpoint] = useState('');
  const [checkedcode, setcheckedcode] = useState('');
  const [Mainarray, setMainarray] = useState([]);
  const [brands, setbrands] = useState([]);
  const [social_icon, setsocial_icon] = useState([]);
  const [web_link_banners, setweb_link_banners] = useState([]);
  const [offer_banner, setoffer_banner] = useState([]);
  const [purchase_options, setpurchase_options] = useState([]);
  const [about_us, setabout_us] = useState([]);
  const [gallery, setgallery] = useState([]);
  const [loyalty_banner, setloyalty_banner] = useState([]);
  const [ratingarray, setratingarray] = useState(0);
  const [loding, setLoding] = useState(false);
  const [datafound, setdatafound] = useState(false);
  const [addphotovisible1, setaddphotovisible1] = useState(false);
  const [signupickerVisible, setsignupickerVisible] = useState(false);

  useEffect(() => {
    apiCall_Info();
  }, []);

  const apiCall_Info = async () => {
    setLoding(true);
    var formdata = new FormData();
    var id = await AsyncStorage.getItem('id');
    formdata.append('current_user_id', id + '');
    formdata.append('user_id', user_id + '');
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);
    console.log(formdata);
    var response = await Helper.POST(Urls.informative_page, formdata);
    +'';
    if (response.status == 200) {
      console.log(response);
      if (validationempty(response.informative_page)) {
        console.log("+++", response.informative_page.user_business_details);
        if (validationempty(response.informative_page.user_business_details)) {
          setdatafound(true);
        }
        setMainarray(response.informative_page.user_business_details);
        setsocial_icon(response.informative_page.social_icon);
        setweb_link_banners(response.informative_page.web_link_banners);
        setoffer_banner(response.informative_page.offer_banner);
        setpurchase_options(response.informative_page.purchase_options);
        setabout_us(response.informative_page.about_us);
        setgallery(response.informative_page.gallery);
        setloyalty_banner(response.informative_page.loyalty_banner);
        setbrands(response.informative_page.brands);
        setratingarray(response.informative_page.finel_rating + '');

        setLoding(false);
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const ApiVouchercredit = async (qrvalue1) => {
    console.log(qrvalue1);
    var lang_id = await AsyncStorage.getItem('lang_id');
    if (validationBlank(checkedpoint, 'Select Option')) {
      setLoding(true);
      var id = await AsyncStorage.getItem('id');
      var formdata = new FormData();
      formdata.append('user_id', id + '');
      formdata.append('code', qrvalue1 + '');
      formdata.append('language_id', lang_id + '');
      formdata.append('option', 'BUY');
      console.log('formdata', formdata);
      var response = await Helper.POST(Urls.add_code, formdata);
      console.log(response);
      setLoding(false);
      if (response.status == 200) {
        showToast(response.Message, 'success');
        apiCall_Info();
        setcheckedpoint('');
        setcheckedcode('');
        setchecked('');
      } else {
        showToast(response.Message, 'error');
      }
    }
  };

  const Apicheck = async () => {
    setLoding(true);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('buss_id', user_id + '');
    formdata.append('user_id', id + '');
    console.log(formdata);
    var response = await Helper.POST(Urls.business_loyalty_card, formdata);
    console.log(response);
    if (response.status == 200) {
      console.log(response);
      setLoding(false);
      setaddphotovisible1(false);
      showToast(response.Message, 'success');

      if (validationempty(response.business_loyalty_card)) {
        setaddphotovisible1(false);
        navigation.navigate('LoyaltyPoints', {
          itemdata: response.business_loyalty_card[0],
        });
      }
    } else {
      setLoding(false);
      setaddphotovisible1(false);
      showToast(response.Message, 'error');
    }
  };

  const GetLocationName = async (flag) => {
    var currentcntry = '';
    var logincntry = await AsyncStorage.getItem('country_name');
    Geocoder.init('AIzaSyA82P0p4R_ghXe9Fs0QCOdB4dEv1LG5vQY'); // use a valid API key

    Geocoder.from(latitude, longitude)
      .then((json) => {
        console.log(json)
        if (json.results[0]) {
          var add = json.results[0].formatted_address;
          var value = add.split(',');

          var count = value.length;
          currentcntry = value[count - 1];

          if (
            currentcntry.toLocaleLowerCase().trim() ===
            logincntry.toLocaleLowerCase().trim()
          ) {
            if (flag == '1') {
              navigation.navigate('OrderPage', {
                offer_banner: offer_banner,
                web_link_banners: web_link_banners,
                Mainarray: Mainarray,
                brands: brands,
                user_id: user_id,
                type: '1',
                logo: Mainarray[0]?.logo,
              });
            }
            if (flag == '2') {
              navigation.navigate('OrderBooking', {
                offer_banner: offer_banner,
                web_link_banners: web_link_banners,
                Mainarray: Mainarray,
                brands: brands,
                user_id: user_id,
                type: '2',
                logo: Mainarray[0]?.logo,
              });
            }
            if (flag == '3') {

              var nameArr = checkedcode.split(',');
              ApiVouchercredit(nameArr[0]);
            }
          } else {
            showToast(
              'You have no access for this location business.',
              'error',
            );
          }
        } else {
          console.log('address not found');
        }
      })
      .catch((error) => console.warn(error));
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <TopBar
          left={Images.ic_close}
          style={{ marginVertical: 10 }}
          iconstyle={{ height: 30, width: 30 }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <Loader loading={loding} />

        <SugnUpModal
          isVisible={signupickerVisible}
          setIsVisible={setsignupickerVisible}
          navigation={navigation}

        />

        {datafound ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ height: '100%' }}>
              <Image
                source={{
                  uri: Urls.imageUrl + Mainarray[0]?.header_banner,
                }}
                style={[styles.img_banner1, { marginTop: 0 }]}
                resizeMode="stretch"
              />
              <View
                style={{
                  position: 'relative',
                  top: -(HEIGHT / 14),
                  width: '80%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{ flex: 1 }}>
                  <Card containerStyle={styles.card_style}>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <Image
                        source={{
                          uri: Urls.imageUrl + Mainarray[0]?.logo,
                        }}
                        style={styles.img_gallery_list}
                        resizeMode={'stretch'}
                      />
                      <View
                        style={{
                          justifyContent: 'center',
                          alignSelf: 'flex-start',
                          marginHorizontal: 6,
                          marginTop: '5%',
                        }}>
                        <Icon
                          name="map-marker-alt"
                          size={20}
                          type={'font-awesome-5'}
                          color={Colors.TheamColor2}
                          onPress={() => {
                            console.log(Mainarray[0]?.map_link);
                            return Linking.openURL(Mainarray[0]?.map_link);


                          }}
                        />
                      </View>

                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text
                          numberOfLines={2}
                          style={[
                            Style.text13,
                            {
                              lineHeight: 15,
                              marginBottom: 2,
                              textAlign: 'left',
                              marginTop: 0,
                              color: Colors.blue,
                            },
                          ]}>
                          {brands[0]?.name}
                        </Text>

                        {validationempty(ratingarray) ? (
                          <View
                            style={{
                              paddingTop: 5,
                              flexDirection: 'row',
                              width: '100%',
                              justifyContent: 'flex-start',
                              alignSelf: 'flex-start',
                            }}>
                            <Rating
                              type="custom"
                              ratingColor="#3498db"
                              startingValue={ratingarray}
                              showRating={false}
                              size={12}
                              selectedColor="#3498db"
                              count={5}
                              readonly
                              imageSize={15}
                              containerStyle={{
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                              }}
                            />

                            <Text style={[Style.text12, { marginLeft: 4 }]}>
                              {ratingarray}
                            </Text>
                          </View>
                        ) : null}

                        <Text
                          style={[
                            Style.text12,
                            {
                              ...Platform.select({
                                ios: {
                                  lineHeight: 18, // as same as height
                                },
                                android: {},
                              }),
                            },
                          ]}>
                          {validationempty(brands[0]?.distance) ? 'Distance : ' + ((brands[0]?.distance).toFixed(2)) + ' Km' : ''}
                        </Text>
                        <Text
                          style={[
                            Style.text12,
                            {
                              color: Colors.TheamColor2,
                              fontFamily: CustomeFonts.ComfortaaBold,
                              ...Platform.select({
                                ios: {
                                  lineHeight: 18, // as same as height
                                },
                                android: {},
                              }),
                            },
                          ]}>
                          Your Points : {Mainarray[0]?.user_available_points}
                        </Text>
                      </View>
                    </View>

                    <View style={Style.divider}></View>
                    <LText
                      style={[
                        Style.text14_bold,
                        {
                          marginTop: 0,
                          color: Colors.blue,
                          ...Platform.select({
                            ios: {
                              marginTop: 10, // as same as height
                            },
                            android: {},
                          }),
                        },
                      ]}>
                      About Us:
                    </LText>

                    {validationempty(about_us) ? (
                      <View pointerEvents="none">
                        <AutoHeightWebView
                          style={{
                            width: '100%',
                            marginVertical: 8,
                          }}
                          source={{
                            html: about_us[0].content,
                          }}
                          viewportContent={
                            'width=device-width, user-scalable=no'
                          }
                        />
                      </View>
                    ) : null}

                    <Text
                      style={[
                        Style.text14_bold,
                        { marginTop: 0, color: Colors.blue },
                      ]}>
                      Gallery:
                    </Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={gallery}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ImageSliderLoad', {
                              index: index,
                              gallery: gallery,
                              flag: '1',
                            });
                          }}>
                          <Image
                            source={
                              validationempty(item.gallery_img)
                                ? { uri: Urls.imageUrl + item.gallery_img }
                                : Images.logo
                            }
                            style={styles.img_gallery_list}
                            resizeMode={'stretch'}
                          />
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10, marginLeft: 10,
                        flexDirection: 'row'
                      }}>

                      {validationempty(Mainarray[0]?.mobile_no) ?
                        <Pressable
                          onPress={async () => {
                            var id = await AsyncStorage.getItem('id');
                            if (validationempty(id)) {
                              let number = Mainarray[0]?.mobile_no;
                              let phoneNumber = '';
                              if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
                              else { phoneNumber = `telprompt:${number}`; }
                              Linking.openURL(phoneNumber);
                            }
                            else {
                              setsignupickerVisible(true);
                            }


                          }}>
                          <Image
                            source={Images.email}
                            style={{ width: 24, height: 24, marginRight: 6 }}
                            resizeMode={'contain'}
                          />
                        </Pressable>
                        : null}

                      {validationempty(Mainarray[0]?.mobile_no) ?
                        <Pressable
                          onPress={async () => {
                            var id = await AsyncStorage.getItem('id');
                            if (validationempty(id)) {
                              let email_id = Mainarray[0]?.email_id;
                              Linking.openURL('mailto:' + email_id);
                            }
                            else {
                              setsignupickerVisible(true);
                            }


                          }}>
                          <Image
                            source={Images.phone}
                            style={{ width: 24, height: 24, marginRight: 6 }}
                            resizeMode={'stretch'}
                          />
                        </Pressable>
                        : null}


                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={social_icon}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={async () => {
                              var id = await AsyncStorage.getItem('id');
                              if (validationempty(id)) {
                                navigation.navigate('WebLoad', {
                                  WebLoad: item.link,
                                });
                              }
                              else {
                                setsignupickerVisible(true);
                              }
                            }}>
                            <Image
                              source={
                                validationempty(item.social_icon)
                                  ? { uri: Urls.imageUrl + item.social_icon }
                                  : Images.logo
                              }
                              style={{ width: 24, height: 24, marginRight: 6 }}
                              resizeMode={'contain'}
                            />
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </Card>

                  {/* loyalty banner */}
                  {validationempty(loyalty_banner) ? (
                    <TouchableOpacity
                      onPress={async () => {

                        var id = await AsyncStorage.getItem('id');
                        if (validationempty(id)) {
                          setaddphotovisible1(true);
                        }
                        else {
                          setsignupickerVisible(true);
                        }


                      }}>
                      <Image
                        source={{
                          uri: Urls.imageUrl + loyalty_banner[0].banner_img,
                        }}
                        style={styles.img_banner}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  ) : null}

                  {validationempty(Mainarray[0]?.e_shop_banner) ? (
                    <TouchableOpacity
                      onPress={async () => {

                        var id = await AsyncStorage.getItem('id');
                        if (validationempty(id)) {
                          GetLocationName('1');
                        }
                        else {
                          setsignupickerVisible(true);
                        }


                      }}>
                      <Image
                        source={{
                          uri: Urls.imageUrl + Mainarray[0]?.e_shop_banner,
                        }}
                        style={styles.img_banner}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  ) : null}

                  {validationempty(Mainarray[0]?.booking_banner) ? (
                    <TouchableOpacity
                      onPress={async () => {
                        var id = await AsyncStorage.getItem('id');
                        if (validationempty(id)) {
                          GetLocationName('2');
                        }
                        else {
                          setsignupickerVisible(true);
                        }
                      }}>
                      <Image
                        source={{
                          uri: Urls.imageUrl + Mainarray[0]?.booking_banner,
                        }}
                        style={styles.img_banner}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  ) : null}

                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={web_link_banners}
                    horizontal
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={async () => {
                          var id = await AsyncStorage.getItem('id');
                          if (validationempty(id)) {
                            navigation.navigate('WebLoad', {
                              WebLoad: item.link,
                            });
                          }
                          else {
                            setsignupickerVisible(true);
                          }


                        }}>
                        <Image
                          source={
                            validationempty(item.web_image)
                              ? { uri: Urls.imageUrl + item.web_image }
                              : Images.logo
                          }
                          style={[
                            {
                              height: HEIGHT / 5,
                              width:
                                web_link_banners.length < 2
                                  ? WIDTH / 1.25
                                  : WIDTH / 2.55,
                              marginTop: 10,
                              marginHorizontal:
                                web_link_banners.length < 2 ? 0 : 2,
                              padding: 2,
                              backgroundColor: Colors.gray,
                              borderRadius: 8,
                            },
                          ]}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />

                  <View>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={offer_banner}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={{ marginRight: 10 }}
                          onPress={async () => {

                            var id = await AsyncStorage.getItem('id');
                            if (validationempty(id)) {
                              navigation.navigate('ImageSliderLoad', {
                                index: index,
                                gallery: offer_banner,
                                flag: '2',
                              });
                            }
                            else {
                              setsignupickerVisible(true);
                            }



                          }}>
                          <Image
                            source={
                              validationempty(item.offer_image)
                                ? { uri: Urls.imageUrl + item.offer_image }
                                : Images.logo
                            }
                            style={[styles.img_list, { borderRadius: 8 }]}
                            resizeMode={'cover'}
                          />
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>

                  {purchase_options.length > 0 ? (
                    <View>
                      <LText
                        style={[
                          Style.text18,
                          { color: Colors.TheamColor2, marginVertical: 20 },
                        ]}>
                        Super Deals
                      </LText>

                      <Card containerStyle={styles.card_style}>
                        <View
                          style={{
                            marginTop: 10,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            flexWrap: 'wrap',
                          }}>
                          <Text
                            style={[
                              Style.text14,
                              {
                                borderColor: Colors.blue,
                                borderWidth: 1,
                                borderRadius: 18,
                                paddingHorizontal: 10,
                              },
                            ]}>
                            Available Points :{' '}
                            {Mainarray[0]?.user_available_points}
                          </Text>
                        </View>

                        {/* <Text
                      style={[
                        Style.text14,
                        {textAlign: 'center', marginTop: 10},
                      ]}>
                      Pre-Purchase Burgers and avail extra discounts
                    </Text>

                    <Text
                      style={[
                        Style.text12,
                        {textAlign: 'center', color: Colors.gray},
                      ]}>
                      (Terms: Only applicable on Weekdays)
                    </Text> */}

                        <LText
                          style={[
                            Style.text14,
                            { textAlign: 'center', marginTop: 10 },
                          ]}>
                          Purchase Options
                        </LText>

                        {/* <LText
                      style={[
                        Style.text12,
                        {textAlign: 'center', color: Colors.gray},
                      ]}>
                      (Get a Loyalty Stamp on every purchase)
                    </LText> */}

                        <View>
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            data={purchase_options}
                            style={{ marginBottom: 10 }}
                            renderItem={({ item, index }) => (
                              <View style={styles.unsel_act}>
                                <View
                                  style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    marginTop: 5,
                                    paddingRight: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <CheckBox
                                    checked={checked === item.id}
                                    onPress={() => {
                                      console.log("itemitem", item)
                                      setchecked(item.id);
                                      setcheckedpoint(item.points);
                                      setcheckedcode(item.v_code);
                                    }}
                                    iconType="font-awesome"
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    containerStyle={{
                                      paddingTop: 0,
                                      paddingBottom: 0,
                                      paddingLeft: 0,
                                      paddingRight: 0,
                                      marginRight: 0,
                                      textAlignVertical: 'center',

                                      fontFamily: CustomeFonts.Poppins_Regular,
                                      borderWidth: 0,
                                      backgroundColor: 'transparent',
                                    }}
                                  />
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                      <Text
                                        style={[
                                          Style.text12,
                                          {
                                            marginLeft: 4,
                                            textAlignVertical: 'center',
                                          },
                                        ]}>
                                        {item.title}
                                      </Text>
                                    </View>

                                    <Text
                                      style={[
                                        Style.text12,
                                        {
                                          marginHorizontal: 4,
                                          color: Colors.TheamColor2,
                                        },
                                      ]}>
                                      {item.points} Pts
                                    </Text>
                                  </View>
                                  {/* <Image
                                style={{width: 20, height: 20}}
                                resizeMode="contain"
                                source={Images.ic_ar_right}
                              />
                              <TouchableOpacity
                                onPress={() => {}}></TouchableOpacity> */}
                                </View>
                              </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </View>
                      </Card>

                      <Mybutton
                        text="Buy"
                        onPress={async () => {

                          var id = await AsyncStorage.getItem('id');
                          if (validationempty(id)) {
                            if (
                              validationempty(Mainarray[0]?.user_available_points)
                            ) {
                              if (Mainarray[0]?.user_available_points > 0) {
                                if (
                                  parseFloat(Mainarray[0]?.user_available_points) >=
                                  parseFloat(checkedpoint)
                                ) {
                                  console.log("=", checkedpoint)
                                  GetLocationName('3');
                                } else {
                                  console.log("==", checkedpoint)
                                  showToast(
                                    'You don’t have enough points',
                                    'error',
                                  );
                                }
                              } else {
                                console.log("===", checkedpoint)
                                showToast(
                                  'You don’t have enough points',
                                  'error',
                                );
                              }
                            } else {
                              console.log("====", checkedpoint)
                              showToast('You don’t have enough points', 'error');
                            }
                          }
                          else {
                            setsignupickerVisible(true);
                          }


                        }}
                        style={{ width: '50%', marginTop: 10 }}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={Style.container1}>
            <NoData />
          </View>
        )}

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
              style={[
                {
                  resizeMode: 'cover',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                  paddingBottom: '6%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Loader loading={loding} />

              <View
                style={{
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
                    setaddphotovisible1(!addphotovisible1);
                  }}
                />

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    margin: 10,
                  }}>
                  <View>
                    <View style={{ flexGrow: 1 }}>
                      <View
                        style={[
                          styles.con_brand,
                          {
                            width: 100,
                            marginBottom: 10,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          },
                        ]}>
                        <Image
                          style={[styles.imageThumbnail, { marginVertical: 10 }]}
                          source={
                            validationempty(Mainarray[0]?.logo)
                              ? { uri: Urls.imageUrl + Mainarray[0]?.logo }
                              : Images.ic_placeholder
                          }
                          resizeMode={'contain'}
                        />
                        <View style={styles.bottom_line}></View>
                      </View>

                      <View style={{ marginHorizontal: 10, marginVertical: 15 }}>
                        <Text style={[Style.text12, {}]}>
                          {loyalty_banner[0]?.terms_of_loyalty}
                        </Text>

                        <Text style={[Style.text12, { marginTop: 15 }]}>
                          {loyalty_banner[0]?.schema}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <Mybutton
                  text="Open Card"
                  onPress={async () => {

                    var id = await AsyncStorage.getItem('id');
                    if (validationempty(id)) {
                      Apicheck();
                    }
                    else {
                      setsignupickerVisible(true);
                    }


                  }}
                  style={{ width: '50%', marginTop: 10 }}
                />
              </View>
            </ImageBackground>
          </SafeAreaView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  img_banner1: {
    height: HEIGHT / 5,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 12,
  },
  img_banner: {
    height: HEIGHT / 5,
    width: '100%',
    marginTop: 10,
    borderRadius: 12,
  },
  img_list: {
    height: HEIGHT / 7,
    width: WIDTH / 6,
    marginTop: 10,
    borderRadius: 12,
  },
  img_gallery_list: {
    height: WIDTH / 5,
    width: WIDTH / 5,
    marginTop: 5,
    marginHorizontal: 5,
    borderRadius: 12,
  },
  card_style: {
    marginVertical: 0,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 0.2,
  },
});

export default Businessinfo;
