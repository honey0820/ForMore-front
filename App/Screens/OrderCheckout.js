import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  ToastAndroid,
  AlertIOS,
  Platform,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import {showToast} from '../Common/CommonMethods';
import Loader from '../Compoment/Loader';
import {validationempty} from '../Common/Validations';
import {NoData} from '../Common/CommonMethods';

var first_name, last_name;
const App = ({navigation, route}) => {
  const {
    type,
    user_id,
    infotext,
    address,
    user_available_points,
    logo,
    storepick,
  } = route.params;
  const [loding, setLoding] = useState(false);
  const [checked, setchecked] = useState('');
  const [comments, setcomments] = useState('');
  const [cartlist, setcartlist] = useState([]);
  const [totalqty, settotalqty] = useState(0);
  const [totalpoints, settotalpoints] = useState(0);
  const [totalvalue, settotalvalue] = useState(0);
  const [finalpoints, setfinalpoints] = useState(0);
  const [finalvalue, setfinalvalue] = useState(0);
  const [couponlist, setcouponlist] = useState(false);
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [couponcode, setcouponcode] = useState('');
  const [couponcodeid, setcouponcodeid] = useState('');
  const [currency_code, setcurrency_code] = useState('');

  useEffect(() => {
    setLoding(true);
    GetName();
    apiCall_View_Cart();
  }, []);

  const GetName = async () => {
    first_name = await AsyncStorage.getItem('first_name');
    last_name = await AsyncStorage.getItem('last_name');
  };

  const apiCall_View_Cart = async () => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('type', type + '');
    formdata.append('user_id', id + '');
    formdata.append('business_id', user_id + '');

    var response = await Helper.POST(Urls.view_cart, formdata);
    if (response.status == 200) {
      console.log(response);
      setcartlist(response.view_cart);
      if (validationempty(response.view_cart)) {
        setcurrency_code(response.view_cart[0].currency_code);
      }
      Cal_Total(response.view_cart);
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const Cal_Total = async (prlist) => {
    let totalpn = 0;
    let totalval = 0;
    if (validationempty(prlist)) {
      for (let index = 0; index < prlist.length; index++) {
        const elementpr = prlist[index];

        totalpn =
          totalpn + parseFloat(1) * parseFloat(elementpr.points_per_quantity);
        totalval =
          totalval + parseFloat(1) * parseFloat(elementpr.price_per_quantity);
        if (validationempty(prlist[index].extra_details)) {
          for (let k = 0; k < prlist[index].extra_details.length; k++) {
            const elementpr = prlist[index].extra_details[k];
            totalpn =
              totalpn +
              parseFloat(elementpr.quantity) *
                parseFloat(elementpr.points_per_quantity);
            totalval =
              totalval +
              parseFloat(elementpr.quantity) *
                parseFloat(elementpr.price_per_quantity);
          }
        }
      }
    }

    settotalqty(prlist.length);
    settotalpoints(totalpn);
    settotalvalue(totalval);
    setfinalvalue(totalval);
    setfinalpoints(totalpn);
  };

  const list1 = (services) => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={true}
        data={services}
        renderItem={({item, index}) => (
          <View>
            <Text style={[Style.text8, {color: Colors.gray}]}>
              {item.name}
              <Text style={[Style.text8, {color: Colors.gray}]}>
                {services.length - 1 == index ? null : ', '}
              </Text>
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
    var response = await Helper.POST(Urls.order_coupon, formdata);

    setcouponlist([]);
    if (response.status == 200) {
      setLoding(false);
      setcouponlist(response.coupon);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_Add_Order = async (advance_payment) => {
    var id = await AsyncStorage.getItem('id');
    // setLoding(true);
    var formdata = new FormData();

    for (var i = 0; i < cartlist.length; i++) {
      formdata.append('product_id[]', cartlist[i].product_id);
      let extradata = '';
      let exarray = [];
      if (validationempty(cartlist[i].extra_details)) {
        for (let index = 0; index < cartlist[i].extra_details.length; index++) {
          const element = cartlist[i].extra_details[index];
          exarray.push(element.name + '(' + element.quantity + ')');
        }
        extradata = exarray.toString();
      } else {
        extradata = '';
      }

      formdata.append('product_name_extra[]', extradata);
    }

    formdata.append('user_id', id + '');
    formdata.append('member_name', first_name + ' ' + last_name + '');
    formdata.append('member_id', id + '');
    formdata.append('order_details', infotext + '');
    formdata.append('delivery_address', address + '');
    formdata.append('member_comments', comments + '');
    formdata.append('advance_payment', advance_payment + '');
    formdata.append('finalpoints', finalpoints);
    formdata.append('finalcash', finalvalue);
    formdata.append('points', totalpoints);
    formdata.append('cash', totalvalue);
    formdata.append('coupocode', couponcodeid);
    formdata.append('storepick', storepick);
    formdata.append('created_by', user_id + '');

    console.log('formdata==>>', formdata);
    var response = await Helper.POST(Urls.order_add, formdata);
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

        <Loader loading={loding} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, paddingHorizontal: '7%'}}>
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
                Check Out
              </LText>

              <Image
                style={[
                  Style.auth_img_style,
                  {height: HEIGHT / 9.5, marginTop: 5},
                ]}
                source={{uri: Urls.imageUrl + logo}}
                resizeMode={'center'}
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

              <View>
                <View
                  style={{
                    marginTop: 15,
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={[
                      Style.text11,
                      {
                        flexWrap: 'wrap',
                        flex: 1,
                        color: Colors.white,
                        backgroundColor: Colors.TheamColor2,
                        borderRadius: Platform.OS == 'ios' ? 8 : 18,
                        paddingHorizontal: 10,
                        paddingVertical: 1,
                      },
                    ]}>
                    DELIVERY ADDRESS
                  </Text>
                </View>

                <View style={{marginLeft: 5, marginTop: 2}}>
                  <Text style={[Style.text11, {}]}>
                    {first_name} {last_name},
                  </Text>
                  {storepick ? (
                    <Text style={[Style.text11, {}]}>Store pickup</Text>
                  ) : (
                    <View style={{flexDirection: 'column'}}>
                      <Text style={[Style.text11, {}]}>{address}</Text>
                      <Text style={[Style.text11, {}]}>{infotext}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  marginTop: 15,
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={[
                    Style.text11,
                    {
                      flexWrap: 'wrap',
                      flex: 1,
                      color: Colors.white,
                      backgroundColor: Colors.TheamColor2,
                      borderRadius: Platform.OS == 'ios' ? 8 : 18,
                      paddingHorizontal: 10,
                      paddingVertical: 1,
                    },
                  ]}>
                  ORDER DETAILS
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
                <Text style={[Style.text11, {flex: 1, marginHorizontal: 1}]}>
                  Sr.
                </Text>
                <Text style={[Style.text11, {flex: 7, marginHorizontal: 1}]}>
                  Item
                </Text>
                <Text style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                  Qty.
                </Text>
                <Text style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                  Points.
                </Text>
                <Text style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                  Value
                </Text>
              </View>
              <View style={Style.divider}></View>

              <FlatList
                showsVerticalScrollIndicator={false}
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
                          flex: 7,
                          flexDirection: 'column',
                          marginHorizontal: 1,
                        }}>
                        <Text style={[Style.text11]}>{item.name}</Text>
                        {validationempty(item.extra_details)
                          ? list1(item.extra_details)
                          : null}
                      </View>

                      <Text
                        style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                        {'1'}
                      </Text>
                      <Text
                        style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                        {item.points_per_quantity}
                      </Text>
                      <Text
                        style={[Style.text11, {flex: 3, marginHorizontal: 1}]}>
                        {item.price_per_quantity}({item.currency_code}).
                      </Text>
                    </View>
                    <View style={Style.divider}></View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
                <Text
                  style={[
                    Style.text11,
                    {flex: 3, marginHorizontal: 1, color: Colors.TheamColor2},
                  ]}></Text>
                <Text
                  style={[
                    Style.text11,
                    {flex: 5, marginHorizontal: 1, color: Colors.TheamColor2},
                  ]}>
                  TOTAL
                </Text>
                <Text
                  style={[
                    Style.text11,
                    {flex: 3, marginHorizontal: 1, color: Colors.TheamColor2},
                  ]}>
                  {totalqty}
                </Text>
                <Text
                  style={[
                    Style.text11,
                    {flex: 3, marginHorizontal: 1, color: Colors.TheamColor2},
                  ]}>
                  {totalpoints}
                </Text>
                <Text
                  style={[
                    Style.text11,
                    {flex: 3, marginHorizontal: 1, color: Colors.TheamColor2},
                  ]}>
                  {totalvalue}({currency_code})
                </Text>
              </View>

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
                        flex: 3,
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
                    Style.text11,
                    {
                      flex: 3,
                      marginBottom: 4,
                      color: Colors.blue,
                      fontFamily: CustomeFonts.ComfortaaBold,
                    },
                  ]}>
                  CHECK OUT :
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '28%',
                    }}>
                    <Text style={[Style.text12, {textAlign: 'left'}]}>
                      Total Qty :{' '}
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {totalqty}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '35%',
                    }}>
                    <Text style={[Style.text12, {textAlign: 'left'}]}>
                      Total Points :
                      <Text style={[Style.text12, {color: Colors.TheamColor2}]}>
                        {totalpoints}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '35%',
                    }}>
                    <Text style={[Style.text12, {textAlign: 'right'}]}>
                      Total Value :
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
                      Final Points :{' '}
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
                        {textAlign: 'center', color: Colors.blue},
                      ]}>
                      Final Value :{' '}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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
                  <NoData
                    itemtext={'No Coupon Code Available For The Moment'}
                  />
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </ImageBackground>
          </SafeAreaView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row_style: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs_style: {
    flexDirection: 'row',
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
export default App;
