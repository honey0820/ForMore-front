import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Linking,
  StyleSheet,
  Platform,
  Modal,
  Alert,
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
import TopBar from '../Compoment/myTopBar';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import MultiSelect from 'react-native-multiple-select';
import { validationempty } from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import { showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Compoment/Loader';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

let holiday_dis = {};
let week_dis = {};

const App = ({ navigation, route }) => {
  const { Mainarray, brands, user_id, logo, type } = route.params;
  const [loding, setLoding] = useState(false);
  const [catlist, setcatlist] = useState([]);
  const [prlist, setprlist] = useState([]);
  const [prlist1, setprlist1] = useState([]);
  const [cartlist, setcartlist] = useState([]);
  const [catid, setcatid] = useState('');
  const [item1, setitem] = useState({});
  const [totalqty, settotalqty] = useState(0);
  const [totalpoints, settotalpoints] = useState(0);
  const [totalvalue, settotalvalue] = useState(0);
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [fromdate, setFromdate] = useState(
    Moment(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
    ).format('YYYY-MM-DD'),
  );
  const [today, settoday] = useState(
    Moment(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
    ).format('YYYY-MM-DD'),
  );

  const [selectedtime, setselectedtime] = useState('');
  const [comments, setcomments] = useState('');
  const multiSelect = React.useRef(null);
  const [selectedItems, setselecteditem] = useState([]);
  const [timeshowarray, settimeshowarray] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setselecteditem(selectedItems);

    let ar = [];
    for (var i = 0; i < selectedItems.length; i++) {
      for (var k = 0; k < timeslotarray.length; k++) {
        if (selectedItems[i] == timeslotarray[k].id) {
          ar.push(timeslotarray[k]);
        }
      }
    }
    settimeshowarray(ar);
    console.log('===', timeshowarray);
  };
  const [markedDates, setmarkedDates] = useState({});
  const [DISABLED_DAYS, setDISABLED_DAYS] = useState([]);
  const [show, setShow] = useState(false);
  const [modaladdcart, setmodaladdcart] = useState(false);
  const [showtime, setShowtime] = useState(false);
  const [timeslotarray, settimeslotarray] = useState([]);

  useEffect(() => {
    settimeshowarray([]);
    apiCall_cat();
    apiCall_get_slot();
  }, []);

  const apiCall_get_slot = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('business_id', user_id + '');
    var response = await Helper.POST(Urls.get_slot, formdata);
    console.log('====>get_slot', response);
    if (response.status == 200) {
      if (validationempty(response.week_off)) {
        let ar = [];
        for (let index = 0; index < response.week_off.length; index++) {
          const element = response.week_off[index];
          ar.push(element.day);
        }
        setDISABLED_DAYS(ar);
        if (ar.length > 0) {
          week_dis = getDaysInMonth(
            moment().month(),
            moment().year(),
            DISABLED_DAYS,
          );
        }
      }

      if (validationempty(response.holiday)) {
        let dates = {};
        for (let index = 0; index < response.holiday.length; index++) {
          const element = response.holiday[index];
          dates[moment(element.holiday_date).format('YYYY-MM-DD')] = {
            disabled: true,
            disableTouchEvent: true,
          };
        }
        holiday_dis = dates;
      }

      let employee = {
        ...week_dis,
        ...holiday_dis,
      };

      if (validationempty(response.slot_master)) {
        // Slot_Part(
        //   response.slot_master[0].start_time,
        //   response.slot_master[0].end_time,
        // );
        Slot_Part(response.slot_master);
      }
      setmarkedDates(employee);
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };
  const apiCall_cat = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('business_id', user_id + '');
    var response = await Helper.POST(
      Urls.booking_categories_business_wise,
      formdata,
    );
    if (response.status == 200) {
      setcatlist(response.categories);
      if (validationempty(response.categories)) {
        setcatid(response.categories[0].id);
        apiCall_product(response.categories[0].id);
      }
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_product = async (cr_id) => {
    setprlist([]);
    setLoding(true);
    var formdata = new FormData();
    formdata.append('cat_id', cr_id + '');
    formdata.append('business_id', user_id + '');
    var response = await Helper.POST(
      Urls.booking_products_business_wise,
      formdata,
    );

    console.log(formdata);
    if (response.status == 200) {
      console.log('====>1111', response);
      if (validationempty(response.booking_products)) {
        apiCall_View_Cart(response.booking_products, '1');
      }
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_Add_Cart = async () => {
    var id = await AsyncStorage.getItem('id');

    let ar = [];
    for (var i = 0; i < selectedItems.length; i++) {
      for (var k = 0; k < timeslotarray.length; k++) {
        if (selectedItems[i] == timeslotarray[k].id) {
          ar.push(timeslotarray[k].name);
        }
      }
    }
    setLoding(true);
    var formdata = new FormData();
    formdata.append('type', type);
    formdata.append('business_id', user_id + '');
    formdata.append('cat_id', catid + '');
    formdata.append('user_id', id + '');
    formdata.append('product_id', item1.id + '');
    formdata.append('date', fromdate + '');
    for (var i = 0; i < selectedItems.length; i++) {
      formdata.append('slot_id[]', selectedItems[i]);
    }
    for (var i = 0; i < ar.length; i++) {
      formdata.append('time[]', ar[i]);
    }

    console.log('add_cartformdata', formdata);
    var response = await Helper.POST(Urls.booking_add_cart, formdata);
    if (response.status == 200) {
      console.log('add_cart', response);
      // showToast(response.Message, 'success');
      setLoding(false);
      console.log('---->', item1.isextra);
      if (item1.isextra > 0) {
        navigation.navigate('CustomSizeBooking', {
          cart_id: response.add_cart_data.id,
          product_id: item1.id,
          type: type,
          item: item1,
        });
      }
      settimeshowarray([]);
      apiCall_View_Cart(prlist, '2');
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
            console.log('==>', elementpr1.price_per_quantity);
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

    settotalqty(prlist.length);
    settotalpoints(totalpn);
    settotalvalue(totalval);
  };

  const apiCall_View_Cart = async (productlist, flag) => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('type', type + '');
    formdata.append('user_id', id + '');
    formdata.append('business_id', user_id + '');
    console.log(formdata);
    var response = await Helper.POST(Urls.booking_view_cart, formdata);
    console.log('booking_view_cart====>', response);
    if (response.status == 200) {
      console.log(response);
      setcartlist(response.booking_view_cart);

      if (validationempty(response.booking_view_cart)) {
        var votes = [];

        for (let index = 0; index < productlist.length; index++) {
          let qty = 0;
          let cart_id = 0;
          const elementpr = productlist[index];

          let aa;
          if (flag == '1') {
            aa = validationempty(productlist[index].extra_details) ? 1 : 0;
          } else {
            aa = elementpr.isextra;
          }
          console.log('1==>', aa);

          for (
            let index = 0;
            index < response.booking_view_cart.length;
            index++
          ) {
            const element = response.booking_view_cart[index];
            if (element.id == elementpr.id) {
              qty = qty + 1;
              cart_id = element.a_cart_id;
            }
          }
          votes.push({
            cart_id: cart_id,
            id: elementpr.id,
            name: elementpr.name,
            catName: elementpr.catName,
            product_img: elementpr.product_img,
            price_per_slot: elementpr.price_per_slot,
            point_per_slot: elementpr.point_per_slot,
            currency_code: elementpr.currency_code,
            qty: qty,
            isextra: aa,
          });
        }

        setprlist(votes);
        Cal_Total(cartlist);
      } else {
        var votes = [];
        let qty = 0;
        for (let index = 0; index < productlist.length; index++) {
          const elementpr = productlist[index];

          let aa;
          if (flag == '1') {
            aa = validationempty(productlist[index].extra_details) ? 1 : 0;
          } else {
            aa = elementpr.isextra;
          }
          console.log('2==>', aa);

          votes.push({
            cart_id: 0,
            id: elementpr.id,
            name: elementpr.name,
            catName: elementpr.catName,
            product_img: elementpr.product_img,
            price_per_slot: elementpr.price_per_slot,
            point_per_slot: elementpr.point_per_slot,
            currency_code: elementpr.currency_code,
            qty: qty,
            isextra: aa,
          });
        }
        setprlist(votes);
        Cal_Total(cartlist);
      }
      Cal_Total(response.booking_view_cart);
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const view_cart_product_wise = async (item) => {
    var id = await AsyncStorage.getItem('id');
    setprlist1([]);
    setLoding(true);
    var formdata = new FormData();
    formdata.append('user_id', id + '');
    formdata.append('type', type + '');
    formdata.append('business_id', user_id + '');
    formdata.append('product_id', item.id + '');
    console.log(formdata);
    var response = await Helper.POST(
      Urls.bookig_view_cart_product_wise,
      formdata,
    );
    console.log(response);
    if (response.status == 200) {
      setLoding(false);
      setprlist1(response.view_cart);
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
        renderItem={({ item, index }) => (
          <View>
            <Text style={[Style.text10, { color: Colors.blue }]}>
              {item.name}
              <Text style={[Style.text10, { color: Colors.blue }]}>
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
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'column',
            }}>
            {index == 0 ? (
              <Text style={[Style.text10, { color: Colors.gray }]}>
                {item.date}
              </Text>
            ) : null}
            <Text style={[Style.text10, { color: Colors.blue }]}>
              {item.time}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const apiCall_Delete_Cart = async (item) => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('cart_id', item.cart_id + '');
    console.log('add_cart', formdata);
    var response = await Helper.POST(Urls.booking_cart_delete, formdata);
    if (response.status == 200) {
      console.log('response', response);
      showToast(response.Message, 'success');
      apiCall_View_Cart(prlist, '2');
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const getDaysInMonth = (month, year, days) => {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('month');

    let dates = {};
    const disabled = { disabled: true, disableTouchEvent: true };
    while (pivot.isBefore(end)) {
      days.forEach((day) => {
        dates[pivot.day(day).format('YYYY-MM-DD')] = disabled;
      });
      pivot.add(7, 'days');
    }

    return dates;
  };

  const Slot_Part = (slot_master) => {
    // //Format the time
    // let startTime = moment(sttime, 'HH:mm');
    // let endTime = moment(ettime, 'HH:mm');

    // //Times
    // let allTimes = [];

    // //Loop over the times - only pushes time with 30 minutes interval
    // while (startTime <= endTime) {
    //   //Push times
    //   allTimes.push(startTime.format('HH:mm'));
    //   //Add interval of 60 minutes
    //   startTime.add(60, 'minutes');
    // }

    // console.log(allTimes);
    // let allTimes1 = [];
    // for (let index = 0; index < allTimes.length - 1; index++) {
    //   allTimes1.push({
    //     id: allTimes[index] + ' - ' + allTimes[index + 1],
    //     name: allTimes[index] + ' - ' + allTimes[index + 1],
    //   });
    // }

    // if (allTimes1.length > 0) {
    //   setselectedtime(allTimes1[0].name);
    // }

    // settimeslotarray(allTimes1);

    let allTimes1 = [];
    for (let index = 0; index < slot_master.length - 1; index++) {
      allTimes1.push({
        id: slot_master[index].id,
        name: slot_master[index].slot_time,
      });
    }
    if (allTimes1.length > 0) {
      setselectedtime(allTimes1[0].name);
    }

    settimeslotarray(allTimes1);
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <TopBar
          left={Images.ic_close}
          // style={{marginTop: 8}}
          iconstyle={{ height: 30, width: 30 }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <Loader loading={loding} />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ height: '100%' }}>
            <Image
              source={{
                uri: Urls.imageUrl + Mainarray[0]?.logo,
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
              <View>
                <Card containerStyle={styles.card_style}>
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'flex-start',
                        marginHorizontal: 6,
                        marginTop: 6,
                      }}>
                      <Icon
                        name="map-marker-alt"
                        size={20}
                        type={'font-awesome-5'}
                        color={Colors.TheamColor2}
                        onPress={() => {
                          const url = Platform.select({
                            ios: 'maps:' + Mainarray[0]?.map_link,
                            android: 'geo:' + Mainarray[0]?.map_link,
                          });

                          Linking.canOpenURL(url).then((supported) => {
                            if (supported) {
                              return Linking.openURL(url);
                            } else {
                              const browser_url =
                                'https://www.google.de/maps/@' +
                                Mainarray[0]?.map_link;
                              return Linking.openURL(browser_url);
                            }
                          });
                        }}
                      />
                    </View>

                    <View style={{ marginLeft: 6 }}>
                      <Text
                        style={[
                          Style.text18,
                          {
                            marginTop: 0,
                            color: Colors.blue,
                            textAlign: 'left',
                          },
                        ]}>
                        {brands[0]?.name}
                      </Text>
                      <Text style={[Style.text12]}>
                        Distance :{' '}{((brands[0]?.distance).toFixed(2))}{"Km"}

                        {/* Distance :{' '}
                        {(brands[0]?.distance / 1000).toFixed(3) < 1
                          ? ((brands[0]?.distance / 1000) * 1000).toFixed(2) +
                            ' meter'
                          : (brands[0]?.distance / 1000).toFixed(2) + ' Km'} */}
                      </Text>
                      <Text
                        style={[
                          Style.text12,
                          {
                            color: Colors.TheamColor2,
                            fontFamily: CustomeFonts.ComfortaaBold,
                          },
                        ]}>
                        Your Points : {Mainarray[0]?.user_available_points}
                      </Text>
                    </View>
                  </View>
                </Card>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={catlist}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setcatid(item.id);
                          apiCall_product(item.id);
                        }}>
                        <Text
                          style={[
                            Style.text12,
                            {
                              color:
                                catid === item.id
                                  ? Colors.TheamColor2
                                  : Colors.blue,
                              marginRight: 10,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>

                <View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={prlist}
                    renderItem={({ item, index }) => (
                      <View>
                        <Card
                          containerStyle={[
                            styles.card_style,
                            {
                              paddingHorizontal: 8,
                              marginTop: 10,
                              paddingVertical: 8,
                            },
                          ]}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                              {/* <Mybutton
                                text={item.catName}
                                onPress={() => {}}
                                textstyle={{fontSize: 12}}
                                style={{
                                  width: '50%',
                                  justifyContent: 'flex-start',
                                  alignSelf: 'flex-start',
                                  paddingHorizontal: 0,
                                  backgroundColor: Colors.blue,
                                }}
                              /> */}

                              <Text
                                style={[
                                  Style.text16,
                                  {
                                    marginTop: Platform.OS == 'ios' ? 8 : 0,
                                    fontFamily: CustomeFonts.ComfortaaBold,
                                    color: Colors.TheamColor2,
                                    textAlign: 'left',
                                  },
                                ]}>
                                {item.catName}
                              </Text>

                              <Text
                                style={[
                                  Style.text16,
                                  {
                                    marginTop: Platform.OS == 'ios' ? 8 : 0,
                                    fontFamily: CustomeFonts.ComfortaaBold,
                                    color: Colors.black,
                                    textAlign: 'left',
                                  },
                                ]}>
                                {item.name}
                              </Text>

                              <View>
                                <View
                                  style={{
                                    marginTop: 10,
                                    flexWrap: 'wrap',
                                  }}>
                                  <Text
                                    style={[
                                      Style.text12,
                                      {
                                        flexWrap: 'wrap',
                                        flex: 1,
                                        borderColor: Colors.blue,
                                        borderWidth: 1,
                                        borderRadius:
                                          Platform.OS == 'ios' ? 8 : 18,
                                        paddingHorizontal: 10,
                                      },
                                    ]}>
                                    {item.point_per_slot + ''} points or{' '}
                                    {item.price_per_slot + ''}{' '}
                                    {item.currency_code}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View
                              style={{
                                width: 85,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Image
                                source={{
                                  uri: Urls.imageUrl + item.product_img,
                                }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: 8,
                                }}
                                resizeMode={'contain'}
                              />

                              {item.qty > 0 ? (
                                <Mybutton
                                  text="REMOVE"
                                  onPress={() => {
                                    apiCall_Delete_Cart(item);
                                    // setitem(item);
                                    // view_cart_product_wise(item);
                                    // setaddphotovisible(true);
                                  }}
                                  textstyle={{ fontSize: 12 }}
                                  style={{
                                    paddingHorizontal: 6,
                                    width: '100%',
                                    marginTop: 10,
                                  }}
                                />
                              ) : (
                                <Mybutton
                                  text="ADD"
                                  onPress={() => {
                                    setitem(item);
                                    setselecteditem([]);
                                    setselectedtime(timeslotarray[0].name);
                                    setmodaladdcart(true);
                                  }}
                                  textstyle={{ fontSize: 12 }}
                                  style={{
                                    paddingHorizontal: 6,
                                    width: '100%',
                                    marginTop: 10,
                                  }}
                                />
                              )}
                            </View>
                          </View>
                        </Card>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />

                  <Card
                    containerStyle={{
                      borderRadius: 8,
                      borderWidth: 0.6,
                      padding: 4,
                      margin: 0,
                      marginTop: 10,
                    }}>
                    <View style={{ flexDirection: 'column' }}>
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
                          { marginHorizontal: 4, fontSize: 12 },
                        ]}
                        placeholderTextColor={Colors.divider}
                        selectionColor={Colors.TheamColor2}
                      />
                    </View>
                  </Card>

                  <View
                    style={{
                      marginTop: 15,
                      marginBottom: 10,
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
                          borderRadius: 18,
                          paddingHorizontal: 10,
                          paddingVertical: 1,
                        },
                      ]}>
                      Appointment Deatils
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                  }}>
                  <Text style={[Style.text11, { flex: 1, marginHorizontal: 1 }]}>
                    Sr.
                  </Text>
                  <Text style={[Style.text11, { flex: 6, marginHorizontal: 1 }]}>
                    Service Name.
                  </Text>
                  <Text style={[Style.text11, { flex: 4, marginHorizontal: 2 }]}>
                    Time.
                  </Text>
                  <Text style={[Style.text11, { flex: 4, marginHorizontal: 1 }]}>
                    Points.
                  </Text>
                  <Text style={[Style.text11, { flex: 4, marginHorizontal: 1 }]}>
                    Value.
                  </Text>
                </View>
                <View style={[Style.divider, { marginRight: '2%' }]}></View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ marginBottom: 10 }}
                  data={cartlist}
                  renderItem={({ item, index }) => (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginLeft: 5,
                          marginTop: 5,
                        }}>
                        <Text
                          style={[
                            Style.text11,
                            { flex: 1, marginHorizontal: 1 },
                          ]}>
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

                        <View style={{ flex: 5 }}>
                          {validationempty(item.booking_add_cart_time)
                            ? list2(item.booking_add_cart_time)
                            : null}
                        </View>

                        <Text
                          style={[
                            Style.text11,
                            { flex: 2, marginHorizontal: 1 },
                          ]}>
                          {item.point_per_slot}
                        </Text>
                        <Text
                          style={[
                            Style.text11,
                            { flex: 4, marginHorizontal: 1 },
                          ]}>
                          {item.price_per_slot}({item.currency_code}).
                        </Text>
                      </View>
                      <View style={[Style.divider, { marginRight: '2%' }]}></View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />

                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text10,
                        { textAlign: 'left', color: Colors.blue },
                      ]}>
                      Total Point :{' '}
                      <Text style={[Style.text10]}>{totalpoints}</Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '48%',
                    }}>
                    <Text
                      style={[
                        Style.text10,
                        { textAlign: 'center', color: Colors.blue },
                      ]}>
                      Total Value :{' '}
                      <Text style={[Style.text10]}>{totalvalue}</Text>
                    </Text>
                  </View>
                </View>

                {validationempty(cartlist) ? (
                  <Mybutton
                    text="CONFIRM"
                    onPress={() => {
                      navigation.navigate('BookingCheckout', {
                        type: type,
                        user_id: user_id,
                        logo: logo,
                        user_available_points:
                          Mainarray[0]?.user_available_points,
                        comments1: comments,
                      });
                    }}
                    textstyle={{ fontSize: 14 }}
                    style={{
                      paddingHorizontal: 6,
                      width: '50%',
                      marginTop: 15,
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>

          <Modal
            // animated
            animationType="slide"
            swipeDirection={['down']}
            visible={modaladdcart}
            onRequestClose={() => {
              setmodaladdcart(!modaladdcart);
            }}
            onBackdropPress={() => {
              setmodaladdcart(!modaladdcart);
            }}
            transparent>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: Colors.white,
              }}>
              <ImageBackground
                source={Images.back_auth}
                style={[
                  Style.auth_img_back_style,
                  { alignSelf: 'center', justifyContent: 'center' },
                ]}>
                <View
                  style={{
                    marginTop: '8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                    backgroundColor: 'transparent',
                  }}>
                  <Card
                    containerStyle={[
                      styles.card_style1,
                      { flexDirection: 'column' },
                    ]}>
                    <TopBar
                      left={Images.ic_close}
                      style={{ left: -30, top: -10, height: 20 }}
                      iconstyle={{ height: 30, width: 30 }}
                      onPressLeft={() => {
                        setmodaladdcart(false);
                      }}
                    />

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{ marginHorizontal: 20 }}>
                        <Text
                          style={[
                            Style.text14_bold,
                            {
                              marginTop: 0,
                              marginBottom: 20,
                              fontSize: 18,
                              textAlign: 'center',
                            },
                          ]}>
                          Appointment Details
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setShow(true);
                          }}
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={[
                              Style.text12,
                              { flex: 2, marginRight: 4, fontSize: 10 },
                            ]}>
                            DATE
                          </Text>

                          <View
                            style={[
                              styles.card_back,
                              { flexDirection: 'row', flex: 3 },
                            ]}>
                            <Text
                              style={[
                                Style.text12,
                                { flex: 1, marginLeft: 4, textAlign: 'center' },
                              ]}>
                              {fromdate}
                            </Text>
                            <Icon
                              type="ionicon"
                              size={18}
                              style={{ marginRight: 10 }}
                              color={Colors.blue}
                              name="calendar-outline"
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setShowtime(true);
                          }}
                          style={{
                            flexDirection: 'row',
                            marginTop: 10,
                          }}>
                          <Text
                            style={[
                              Style.text12,
                              { flex: 2, marginRight: 4, fontSize: 10 },
                            ]}>
                            TIME
                          </Text>

                          <View
                            style={[
                              styles.card_back,
                              { flexDirection: 'row', flex: 3 },
                            ]}>
                            <View style={{ flex: 1 }}>
                              {
                                <FlatList
                                  data={timeshowarray}
                                  renderItem={({ item, index }) => (
                                    <Text
                                      style={[
                                        Style.text12,
                                        { textAlign: 'center' },
                                      ]}>
                                      {item.name}
                                    </Text>
                                  )}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                />
                              }
                            </View>
                            {/* <Text
                              style={[
                                Style.text12,
                                {flex: 1, marginLeft: 4, textAlign: 'center'},
                              ]}>
                              {selectedtime.toString()}
                            </Text> */}
                            <Icon
                              type="ionicon"
                              size={18}
                              style={{ marginRight: 10 }}
                              color={Colors.blue}
                              name="time-sharp"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>

                    <Mybutton
                      text="Continue"
                      onPress={() => {
                        if (selectedItems.length > 0) {
                          setmodaladdcart(false);
                          apiCall_Add_Cart();
                        } else {
                          Alert.alert('Select Time slot');
                        }
                      }}
                      style={{ marginTop: 20, width: '50%' }}
                    />
                  </Card>
                </View>
              </ImageBackground>
            </SafeAreaView>
          </Modal>

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
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: Colors.white,
              }}>
              <ImageBackground
                source={Images.back_auth}
                style={[
                  Style.auth_img_back_style,
                  { alignSelf: 'center', justifyContent: 'center' },
                ]}>
                <Loader loading={loding} />
                <View
                  style={{
                    marginTop: '8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    backgroundColor: 'transparent',
                  }}>
                  <Card containerStyle={[styles.card_style1]}>
                    <TopBar
                      left={Images.ic_close}
                      style={{ left: -30, top: -10, height: 20 }}
                      iconstyle={{ height: 30, width: 30 }}
                      onPressLeft={() => {
                        navigation.goBack();
                      }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View>
                        <View style={{ flexGrow: 1 }}>
                          <View style={{ marginBottom: 15 }}>
                            <Image
                              source={{
                                uri: Urls.imageUrl + item1.product_img,
                              }}
                              style={[
                                styles.img_banner1,
                                { marginTop: 0, borderRadius: 8 },
                              ]}
                              resizeMode="stretch"
                            />
                            <View style={{ paddingHorizontal: 15 }}>
                              <Text
                                style={[
                                  Style.text16,
                                  {
                                    marginTop: Platform.OS == 'ios' ? 8 : 0,
                                    fontFamily: CustomeFonts.ComfortaaBold,
                                    color: Colors.blue,
                                    textAlign: 'left',
                                  },
                                ]}>
                                {item1.name}
                              </Text>

                              <FlatList
                                showsVerticalScrollIndicator={false}
                                data={prlist1}
                                style={{ marginTop: 6 }}
                                renderItem={({ item, index }) => (
                                  <View>
                                    <View
                                      style={{ flexDirection: 'row', flex: 1 }}>
                                      <View>
                                        <Text
                                          style={[
                                            Style.text14,
                                            {
                                              marginTop:
                                                Platform.OS == 'ios' ? 8 : 0,
                                              fontFamily:
                                                CustomeFonts.ComfortaaBold,
                                              color: Colors.lightblack,
                                              textAlign: 'left',
                                            },
                                          ]}>
                                          {item.name}
                                        </Text>

                                        {validationempty(item.extra_details)
                                          ? list1(item.extra_details)
                                          : null}
                                      </View>

                                      <TouchableOpacity
                                        onPress={() => {
                                          apiCall_Delete_Cart(item);
                                          setaddphotovisible(false);
                                        }}
                                        style={{
                                          flex: 1,
                                          justifyContent: 'center',
                                        }}>
                                        <Icon
                                          name={'md-trash-bin-outline'}
                                          type={'ionicon'}
                                          size={20}
                                          color={Colors.blue}
                                          style={{
                                            justifyContent: 'flex-end',
                                            alignSelf: 'flex-end',
                                          }}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                    <View
                                      style={[
                                        Style.divider,
                                        { marginVertical: 4 },
                                      ]}></View>
                                  </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </Card>
                </View>
              </ImageBackground>
            </SafeAreaView>
          </Modal>

          <Modal
            // animated
            animationType="slide"
            swipeDirection={['down']}
            visible={show}
            onRequestClose={() => {
              setShow(!show);
            }}
            onBackdropPress={() => {
              setShow(!show);
            }}
            transparent>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: Colors.white,
              }}>
              <ImageBackground
                source={Images.back_auth}
                style={[
                  Style.auth_img_back_style,
                  { alignSelf: 'center', justifyContent: 'center' },
                ]}>
                <View
                  style={{
                    marginTop: '8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    backgroundColor: 'transparent',
                  }}>
                  <Card containerStyle={[styles.card_style1]}>
                    <TopBar
                      left={Images.ic_close}
                      style={{ left: -30, top: -10, height: 20 }}
                      iconstyle={{ height: 30, width: 30 }}
                      onPressLeft={() => {
                        setShow(false);
                      }}
                    />
                    <Calendar
                      markedDates={markedDates}
                      hideExtraDays={true}
                      date={fromdate}
                      enableSwipeMonths={true}
                      onMonthChange={(date) => {
                        let week_dis = getDaysInMonth(
                          date.month - 1,
                          date.year,
                          DISABLED_DAYS,
                        );

                        let employee = {
                          ...week_dis,
                          ...holiday_dis,
                        };

                        setmarkedDates(employee);
                      }}
                      onDayPress={(day) => {
                        setFromdate(
                          moment(day.dateString).format('YYYY-MM-DD'),
                        );
                        setShow(false);
                      }}
                    />
                  </Card>
                </View>
              </ImageBackground>
            </SafeAreaView>
          </Modal>

          <Modal
            // animated
            animationType="slide"
            swipeDirection={['down']}
            visible={showtime}
            onRequestClose={() => {
              setShowtime(!showtime);
            }}
            onBackdropPress={() => {
              setShowtime(!showtime);
            }}
            transparent>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: Colors.white,
              }}>
              <ImageBackground
                source={Images.back_auth}
                style={[
                  Style.auth_img_back_style,
                  { alignSelf: 'center', justifyContent: 'center' },
                ]}>
                <View
                  style={{
                    marginTop: '8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    backgroundColor: 'transparent',
                  }}>
                  <Card containerStyle={[styles.card_style1]}>
                    <View style={styles.v_sty_close}>
                      <TouchableOpacity
                        onPressIn={() => {
                          setShowtime(!showtime);
                        }}>
                        <Image
                          source={Images.ic_close}
                          style={styles.img_back_style}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                      }}>
                      <MultiSelect
                        // fixedHeight={true}
                        fontFamily={CustomeFonts.ComfortaaRegular}
                        itemFontFamily={CustomeFonts.ComfortaaRegular}
                        hideTags
                        hideSubmitButton={true}
                        single={false}
                        items={timeslotarray}
                        uniqueKey="id"
                        ref={(component) => {
                          multiSelect.current = component;
                        }}
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems}
                        selectText="Select Time Slot"
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={(text) => console.log(text)}
                        styleRowList={{
                          lineHeight: 20,
                          marginVertical: 3,
                        }}
                        itemFontSize={12}
                        fontSize={12}
                        styleInputGroup={{ borderRadius: 18 }}
                        styleDropdownMenuSubsection={{
                          borderBottomWidth: 0,
                          paddingLeft: 10,
                          borderRadius: 8,
                          alignItems: 'center',
                          borderBottomColor: 'transparent',
                          // backgroundColor: 'transparent',
                          // borderColor: Colors.blue,
                          // borderWidth: 1,
                        }}
                        styleTextTag={{ fontSize: 12, lineHeight: 18 }}
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
                        submitButtonColor={Colors.black}
                        submitButtonText="Submit"
                      />

                      <Mybutton
                        text="Done"
                        onPress={() => {
                          setShowtime(false);
                        }}
                        style={{ marginTop: 10, width: '50%', marginBottom: 20 }}
                      />
                    </ScrollView>
                  </Card>
                </View>
              </ImageBackground>
            </SafeAreaView>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img_back_style: {
    height: 30,
    width: 30,
  },
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -12,
    top: -15,
  },
  img_banner1: {
    height: HEIGHT / 5,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 18,
  },
  img_banner: {
    height: 60,
    width: '100%',
    marginTop: 10,
    borderRadius: 18,
  },
  img_list: {
    height: HEIGHT / 7,
    width: WIDTH / 6,
    marginTop: 10,
    borderRadius: 18,
  },
  img_gallery_list: {
    height: WIDTH / 5,
    width: WIDTH / 5,
    marginTop: 5,
    marginRight: 6,
    borderRadius: 18,
  },
  card_style: {
    marginVertical: 4,
    paddingVertical: 4,
    borderRadius: 18,
    marginHorizontal: 2,
    borderWidth: 0.5,
  },
  card_back: {
    // height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
    paddingVertical: 2,
  },

  card_style1: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    margin: 0,
    marginBottom: 30,
    paddingBottom: 15,
    padding: 0,
  },
});

export default App;
