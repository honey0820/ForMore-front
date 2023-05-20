import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  ToastAndroid,
  AlertIOS,
  Switch,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import {ScrollView} from 'react-native-gesture-handler';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Header from '../Compoment/Header';
import {Card} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import Mybutton from '../Compoment/mybutton';
import {CheckBox} from 'react-native-elements';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validationempty} from '../Common/Validations';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import {showToast} from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Compoment/Loader';
import {NoData} from '../Common/CommonMethods';

var first_name, last_name;
const App = ({navigation, route}) => {
  const {type, user_id, user_available_points, logo, comments1} = route.params;
  const [loding, setLoding] = useState(false);
  const [checked, setchecked] = useState('');
  const [comments, setcomments] = useState(comments1);
  const [isa, setisa] = useState(false);
  const [isb, setisb] = useState(false);
  const [cartlist, setcartlist] = useState([]);
  const [totalpoints, settotalpoints] = useState(0);
  const [totalvalue, settotalvalue] = useState(0);
  const [finalpoints, setfinalpoints] = useState(0);
  const [finalvalue, setfinalvalue] = useState(0);
  const [couponlist, setcouponlist] = useState(false);
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [couponcode, setcouponcode] = useState('');
  const [couponcodeid, setcouponcodeid] = useState('');
  const [currency_code, setcurrency_code] = useState('');

  const toggleSwitchA = () => {
    setisa((previousState) => !previousState);
    setisb(false);
  };
  const toggleSwitchB = () => {
    setisb((previousState) => !previousState);
    setisa(false);
  };

  const apiCall_View_Cart = async (productlist) => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('type', type + '');
    formdata.append('user_id', id + '');
    formdata.append('business_id', user_id + '');

    var response = await Helper.POST(Urls.booking_view_cart, formdata);
    if (response.status == 200) {
      console.log(response);
      setcartlist(response.booking_view_cart);
      if (validationempty(response.booking_view_cart)) {
        setcurrency_code(response.booking_view_cart[0].currency_code);
      }
      Cal_Total(response.booking_view_cart);
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const list1 = (services) => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={true}
        data={services}
        renderItem={({item, index}) => (
          <View>
            <Text style={[Style.text10, {color: Colors.blue}]}>
              {item.name}
              <Text style={[Style.text10, {color: Colors.blue}]}>
                {services.length - 1 == index ? null : ', '}
              </Text>
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const list2 = (services) => {
    return (
      <FlatList
        // horizontal
        showsHorizontalScrollIndicator={true}
        data={services}
        renderItem={({item, index}) => (
          <View
            style={{
              flexDirection: 'column',
            }}>
            {index == 0 ? (
              <Text style={[Style.text10, {color: Colors.gray}]}>
                {item.date}
              </Text>
            ) : null}
            <Text style={[Style.text10, {color: Colors.blue}]}>
              {item.time}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const apiCallcouponlist = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('business_id', user_id);
    var response = await Helper.POST(Urls.booking_coupon, formdata);

    setcouponlist([]);
    if (response.status == 200) {
      setLoding(false);
      setcouponlist(response.coupon);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const Cal_Total = async (prlist) => {
    let totalpn = 0;
    let totalval = 0;
    if (validationempty(prlist)) {
      setLoding(true);
      for (let index = 0; index < prlist.length; index++) {
        const elementpr = prlist[index];

        let slotlength = prlist[index].booking_add_cart_time.length;
        totalpn =
          totalpn +
          parseFloat(slotlength) * parseFloat(elementpr.point_per_slot);
        totalval =
          totalval +
          parseFloat(slotlength) * parseFloat(elementpr.price_per_slot);

        if (validationempty(prlist[index].extra_details)) {
          for (let k = 0; k < prlist[index].extra_details.length; k++) {
            const elementpr1 = prlist[index].extra_details[k];
            totalpn =
              totalpn +
              parseFloat(slotlength) *
                parseFloat(elementpr1.points_per_quantity);
            totalval =
              totalval +
              parseFloat(slotlength) *
                parseFloat(elementpr1.price_per_quantity);
          }
        }
      }

      setLoding(false);
    }

    settotalpoints(totalpn);
    settotalvalue(totalval);
    setfinalpoints(totalpn);
    setfinalvalue(totalval);
  };

  const GetName = async () => {
    first_name = await AsyncStorage.getItem('first_name');
    last_name = await AsyncStorage.getItem('last_name');
  };

  useEffect(() => {
    GetName();
    apiCall_View_Cart();
  }, []);

  const apiCall_Add_Order = async (advance_payment) => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();

    for (var i = 0; i < cartlist.length; i++) {
      formdata.append('product_id[]', cartlist[i].id);
      formdata.append('cart_id[]', cartlist[i].a_cart_id);
      let extradata = '';
      let extratime = '';
      let exarray = [];
      let exarray1 = [];
      if (validationempty(cartlist[i].extra_details)) {
        for (let index = 0; index < cartlist[i].extra_details.length; index++) {
          const element = cartlist[i].extra_details[index];
          exarray.push(element.name);
        }
        extradata = exarray.toString();
      } else {
        extradata = '';
      }

      for (
        let index = 0;
        index < cartlist[i].booking_add_cart_time.length;
        index++
      ) {
        const element = cartlist[i].booking_add_cart_time[index];
        if (index == 0) {
          formdata.append('booking_date[]', element.date);
        }
        exarray1.push(element.time);
      }
      extratime = exarray1.toString();
      formdata.append('product_name_extra[]', extradata);
      formdata.append('product_time_array[]', extratime);
    }

    formdata.append('user_id', id + '');
    formdata.append('member_name', first_name + ' ' + last_name + '');
    formdata.append('member_id', id + '');
    formdata.append('comments', comments + '');
    formdata.append('advance_payment', advance_payment + '');
    formdata.append('finalpoints', finalpoints);
    formdata.append('finalcash', finalvalue);
    formdata.append('points', totalpoints);
    formdata.append('cash', totalvalue);
    formdata.append('coupocode', couponcodeid);
    formdata.append('created_by', user_id + '');

    console.log('formdata==>>', formdata);
    var response = await Helper.POST(Urls.booking_add, formdata);
    if (response.status == 200) {
      console.log('order_add', response);
      showToast(response.Message, 'success');
      setLoding(false);
      navigation.popToTop();
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
        style={Style.auth_img_back_style}>
        <TopBar
          left={Images.ic_close}
          // style={{marginTop: 8}}
          iconstyle={{height: 30, width: 30}}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingHorizontal: '7%'}}>
            <View style={{height: '100%'}}>
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
                    marginBottom: 10,
                    color: Colors.TheamColor2,
                    fontSize: 20,
                    textAlign: 'center',
                  },
                ]}>
                Booking
              </LText>

              <Image
                style={[
                  Style.auth_img_style,
                  {height: HEIGHT / 9.5, marginTop: 5},
                ]}
                source={{uri: Urls.imageUrl + logo}}
                resizeMode={'contain'}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={[
                    Style.text12,
                    {
                      flexWrap: 'wrap',
                      color: Colors.blue,
                      borderColor: Colors.blue,
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderRadius: Platform.OS == 'ios' ? 8 : 18,
                      paddingHorizontal: 10,
                    },
                  ]}>
                  Available Points : {user_available_points}
                </Text>
              </View>

              <Text
                style={[
                  Style.text14,
                  {
                    marginTop: 10,
                    color: Colors.TheamColor2,
                    fontFamily: CustomeFonts.ComfortaaBold,
                  },
                ]}>
                DETAILS :
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                <Text style={[Style.text11, {flex: 1, marginHorizontal: 1}]}>
                  Sr.
                </Text>
                <Text style={[Style.text11, {flex: 6, marginHorizontal: 1}]}>
                  Service Name.
                </Text>
                <Text style={[Style.text11, {flex: 4, marginHorizontal: 2}]}>
                  Time.
                </Text>
                <Text style={[Style.text11, {flex: 4, marginHorizontal: 1}]}>
                  Points.
                </Text>
                <Text style={[Style.text11, {flex: 4, marginHorizontal: 1}]}>
                  Value.
                </Text>
              </View>
              <View style={[Style.divider, {marginRight: '2%'}]}></View>
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 10}}
                data={cartlist}
                renderItem={({item, index}) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 5,
                        marginTop: 5,
                      }}>
                      <Text
                        style={[Style.text11, {flex: 1, marginHorizontal: 1}]}>
                        {index + 1}
                      </Text>
                      <View
                        style={{
                          flex: 6,
                          flexDirection: 'column',
                          marginHorizontal: 1,
                        }}>
                        <Text style={[Style.text11]}>{item.name}</Text>
                        {validationempty(item.extra_details)
                          ? list1(item.extra_details)
                          : null}
                      </View>

                      <View style={{flex: 4}}>
                        {validationempty(item.booking_add_cart_time)
                          ? list2(item.booking_add_cart_time)
                          : null}
                      </View>

                      <Text
                        style={[Style.text11, {flex: 4, marginHorizontal: 1}]}>
                        {item.point_per_slot}
                      </Text>
                      <Text
                        style={[Style.text11, {flex: 4, marginHorizontal: 1}]}>
                        {item.price_per_slot}({item.currency_code}).
                      </Text>
                    </View>
                    <View style={[Style.divider, {marginRight: '2%'}]}></View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <Card
                containerStyle={{
                  borderRadius: 8,
                  borderWidth: 0.5,
                  padding: 4,
                  margin: 0,
                  marginTop: 10,
                }}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={[
                      Style.text11,
                      {
                        marginHorizontal: 1,
                        color: Colors.blue,
                        fontFamily: CustomeFonts.ComfortaaBold,
                      },
                    ]}>
                    COMMENTS
                  </Text>

                  <TextInput
                    value={comments}
                    keyboardType="email-address"
                    placeholder="add text here"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => {
                      setcomments(text);
                    }}
                    numberOfLines={2}
                    multiline={true}
                    underlineColor={'transparent'}
                    style={[
                      Style.textInput,
                      {marginHorizontal: 4, fontSize: 12},
                    ]}
                    placeholderTextColor={Colors.divider}
                    selectionColor={Colors.TheamColor2}
                  />
                </View>
              </Card>

              <View style={{flexDirection: 'column', marginTop: 10}}>
                <Text
                  style={[
                    Style.text14,
                    {
                      marginBottom: 4,
                      color: Colors.TheamColor2,
                      fontFamily: CustomeFonts.ComfortaaBold,
                    },
                  ]}>
                  CHECK OUT :
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        {textAlign: 'left', color: Colors.blue},
                      ]}>
                      Points :{' '}
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {totalpoints}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        {textAlign: 'left', color: Colors.blue},
                      ]}>
                      Value :{' '}
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {totalvalue}
                      </Text>
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{flexDirection: 'row', marginVertical: 10}}
                  onPress={() => {
                    apiCallcouponlist();
                    setaddphotovisible(true);
                  }}>
                  <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                    Coupon Code
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      flexWrap: 'wrap',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        {
                          flexWrap: 'wrap',
                          flex: 1,
                          borderColor: Colors.lg_gray,
                          color: Colors.gray_d1,
                          borderWidth: 1,
                          borderRadius: Platform.OS == 'ios' ? 8 : 18,
                          paddingHorizontal: 10,
                        },
                      ]}>
                      {couponcode}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        {textAlign: 'left', color: Colors.blue},
                      ]}>
                      Total Points :{' '}
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {finalpoints}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        {textAlign: 'left', color: Colors.blue},
                      ]}>
                      Total Value :{' '}
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {finalvalue}({currency_code})
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginVertical: 15}}>
                <Mybutton
                  text="PAY WITH POINTS"
                  onPress={() => {
                    if (user_available_points > finalpoints) {
                      Alert.alert(
                        'Formore',
                        'This order will cost you ' + finalpoints + ' points',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Confirm',
                            onPress: () => {
                              apiCall_Add_Order('yes');
                            },
                          },
                        ],
                        {cancelable: true},
                      );
                    } else {
                      showToast(
                        'Not enough points available for order...pay with cash',
                        'error',
                      );
                    }
                  }}
                  textstyle={{fontSize: 10}}
                  style={{width: '50%', paddingHorizontal: 0, marginRight: 6}}
                />
                <Mybutton
                  text="PAY WITH CASH"
                  onPress={() => {
                    Alert.alert(
                      'Formore',
                      'This order will cost you ' +
                        finalvalue +
                        '(' +
                        currency_code +
                        ')',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Confirm',
                          onPress: () => {
                            apiCall_Add_Order('no');
                          },
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  textstyle={{fontSize: 10}}
                  style={{
                    width: '50%',
                    paddingHorizontal: 0,
                    marginLeft: 6,
                    backgroundColor: Colors.blue,
                  }}
                />
              </View>

              {/* <View style={{flexDirection: 'row', marginVertical: 15}}>
                <View style={{flexDirection: 'row', flex: 1, marginRight: 5}}>
                  <Text
                    style={[
                      Style.text14_bold,
                      {color: Colors.blue, marginTop: 0},
                    ]}>
                    Pay With Points
                  </Text>
                  <Switch
                    trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                    thumbColor={'white'}
                    onValueChange={toggleSwitchA}
                    value={isa}
                  />
                </View>

                <View style={{flexDirection: 'row', flex: 1, marginLeft: 10}}>
                  <Text
                    style={[
                      Style.text14_bold,
                      {color: Colors.blue, marginTop: 0},
                    ]}>
                    Pay With Cash
                  </Text>
                  <Switch
                    trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                    thumbColor={'white'}
                    onValueChange={toggleSwitchB}
                    value={isb}
                  />
                </View>
              </View> */}

              {/* <Mybutton
                text="CONFIRM"
                onPress={() => {}}
                textstyle={{fontSize: 14}}
                style={{
                  paddingHorizontal: 6,
                  width: '50%',
                  marginTop: 10,
                }}
              /> */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
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
        <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
          <CustomStatusBar hidden={false} />
          <ImageBackground
            source={Images.back_auth}
            style={Style.auth_img_back_style1}>
            <Loader loading={loding} />

            <TopBar
              left={Images.ic_close}
              // style={{marginTop: 8}}
              iconstyle={{height: 30, width: 30}}
              onPressLeft={() => {
                setaddphotovisible(!addphotovisible);
              }}
            />
            <Image
              source={Images.logo}
              style={[Style.auth_img_style, {height: HEIGHT / 8, marginTop: 5}]}
              resizeMode="contain"
            />

            <LText
              style={[
                Style.text14_bold,
                {
                  marginTop: 0,
                  marginBottom: 10,
                  color: Colors.TheamColor2,
                  fontSize: 20,
                  textAlign: 'center',
                },
              ]}>
              Available Offers
            </LText>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={couponlist}
              renderItem={({item, index}) => (
                <View>
                  <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
                    <Image
                      style={[
                        {
                          width: 50,
                          height: 50,
                        },
                      ]}
                      source={{uri: Urls.imageUrl + logo}}
                      resizeMode={'cover'}
                    />
                    <View style={{}}>
                      {/* <Text
                    style={[Style.text14_bold, {flex: 1, color: Colors.black}]}>
                    Lipsum generator: Lorem Ipsum - All the facts
                  </Text> */}
                      <Text style={[Style.text12, {flex: 1}]}>
                        {item.coupon_info}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            marginTop: 6,
                            flexWrap: 'wrap',
                          }}>
                          <Text
                            style={[
                              Style.text14,
                              {
                                flexWrap: 'wrap',
                                flex: 1,
                                borderColor: Colors.gray_d1,
                                color: Colors.black,
                                borderWidth: 1,
                                borderRadius: 4,
                                paddingHorizontal: 10,
                              },
                            ]}>
                            {item.coupon_code}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{alignSelf: 'center', marginTop: 2}}
                          onPress={() => {
                            if (item.amount_type == 'Amount') {
                              if (item.amount < totalvalue) {
                                let finaldisvalue;
                                if (
                                  parseFloat(item.amount) >
                                  parseFloat(item.amount_discount)
                                ) {
                                  finaldisvalue = item.amount_discount;
                                } else {
                                  finaldisvalue = item.amount;
                                }

                                setfinalvalue(
                                  parseFloat(totalvalue) -
                                    parseFloat(finaldisvalue),
                                );
                                setfinalpoints(totalpoints);
                                setcouponcode(item.coupon_code);
                                setcouponcodeid(item.id);
                                setaddphotovisible(false);
                              } else {
                                if (Platform.OS == 'ios') {
                                  AlertIOS.alert(
                                    'This coupon code is not valid for your order.',
                                  );
                                } else {
                                  ToastAndroid.show(
                                    'This coupon code is not valid for your order.',
                                    ToastAndroid.SHORT,
                                  );
                                }
                              }
                            }

                            if (item.amount_type == 'Percentage') {
                              let disvalue =
                                (parseFloat(totalvalue) *
                                  parseFloat(item.amount)) /
                                100;

                              let finaldisvalue;
                              if (
                                parseFloat(disvalue) < parseFloat(totalvalue)
                              ) {
                                if (
                                  parseFloat(disvalue) >
                                  parseFloat(item.amount_discount)
                                ) {
                                  finaldisvalue = item.amount_discount;
                                } else {
                                  finaldisvalue = disvalue;
                                }
                                setfinalvalue(
                                  parseFloat(totalvalue) -
                                    parseFloat(finaldisvalue),
                                );
                                setfinalpoints(totalpoints);
                                setcouponcode(item.coupon_code);
                                setcouponcodeid(item.id);
                                setaddphotovisible(false);
                              } else {
                                if (Platform.OS == 'ios') {
                                  AlertIOS.alert(
                                    'This coupon code is not valid for your order.',
                                  );
                                } else {
                                  ToastAndroid.show(
                                    'This coupon code is not valid for your order.',
                                    ToastAndroid.SHORT,
                                  );
                                }
                              }
                            }

                            if (item.amount_type == 'Points') {
                              if (item.amount < totalpoints) {
                                let finaldisvalue;
                                if (
                                  parseFloat(item.amount) >
                                  parseFloat(item.amount_discount)
                                ) {
                                  finaldisvalue = item.amount_discount;
                                } else {
                                  finaldisvalue = item.amount;
                                }

                                setfinalpoints(
                                  parseFloat(totalpoints) -
                                    parseFloat(finaldisvalue),
                                );
                                setfinalvalue(totalvalue);
                                setcouponcode(item.coupon_code);
                                setcouponcodeid(item.id);
                                setaddphotovisible(false);
                              } else {
                                if (Platform.OS == 'ios') {
                                  AlertIOS.alert(
                                    'This coupon code is not valid for your order.',
                                  );
                                } else {
                                  ToastAndroid.show(
                                    'This coupon code is not valid for your order.',
                                    ToastAndroid.SHORT,
                                  );
                                }
                              }
                            }
                          }}>
                          <Text style={Style.text14_bold}>APPLY</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={Style.divider}></View>
                </View>
              )}
              ListEmptyComponent={
                <NoData itemtext={'No Coupon Code Available For The Moment'} />
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </ImageBackground>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default App;
