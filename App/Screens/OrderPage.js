import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  Linking,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationempty } from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import { showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Compoment/Loader';

const App = ({ navigation, route }) => {
  const {
    offer_banner,
    web_link_banners,
    Mainarray,
    brands,
    user_id,
    type,
    logo,
  } = route.params;
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

  useEffect(() => {
    apiCall_cat();
  }, []);

  const apiCall_cat = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('business_id', user_id + '');
    var response = await Helper.POST(
      Urls.order_categories_business_wise,
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
      Urls.order_products_business_wise,
      formdata,
    );
    console.log('=======>', response);
    if (response.status == 200) {
      if (validationempty(response.order_products)) {
        apiCall_View_Cart(response.order_products, '1');
      }
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_Add_Cart = async (item) => {
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('type', type);
    formdata.append('business_id', user_id + '');
    formdata.append('cat_id', catid + '');
    formdata.append('user_id', id + '');
    formdata.append('product_id', item.id + '');
    console.log('add_cart', formdata);
    var response = await Helper.POST(Urls.add_cart, formdata);
    if (response.status == 200) {
      console.log('add_cartf==>', item.isextra);
      // showToast(response.Message, 'success');
      setLoding(false);
      if (item.isextra > 0) {
        navigation.navigate('CustomSize', {
          cart_id: response.add_cart_data.id,
          product_id: item.id,
          type: type,
          item: item,
        });
      }
      apiCall_View_Cart(prlist, '2');
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_View_Cart = async (prlist, flag) => {
    console.log('flag==>', flag);
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
        var votes = [];

        for (let index = 0; index < prlist.length; index++) {
          let qty = 0;
          const elementpr = prlist[index];
          for (let index = 0; index < response.view_cart.length; index++) {
            const element = response.view_cart[index];
            if (element.product_id == elementpr.id) {
              qty = qty + 1;
            }
          }

          let aa;
          if (flag == '1') {
            aa = validationempty(prlist[index].extra_details) ? 1 : 0;
          } else {
            aa = elementpr.isextra;
          }
          console.log('1==>', aa);
          votes.push({
            id: elementpr.id,
            name: elementpr.name,
            catName: elementpr.catName,
            product_img: elementpr.product_img,
            ingredients_name: elementpr.ingredients_name,
            available_quantities: elementpr.available_quantities,
            price_per_quantity: elementpr.price_per_quantity,
            points_per_quantity: elementpr.points_per_quantity,
            currency_code: elementpr.currency_code,
            qty: qty,
            isextra: aa,
          });
        }
        setprlist(votes);
        Cal_Total(response.view_cart);
      } else {
        var votes = [];
        let qty = 0;
        for (let index = 0; index < prlist.length; index++) {
          const elementpr = prlist[index];

          let aa;
          if (flag == '1') {
            aa = validationempty(prlist[index].extra_details) ? 1 : 0;
          } else {
            aa = elementpr.isextra;
          }
          console.log('21==>', aa);
          votes.push({
            id: elementpr.id,
            name: elementpr.name,
            catName: elementpr.catName,
            product_img: elementpr.product_img,
            ingredients_name: elementpr.ingredients_name,
            available_quantities: elementpr.available_quantities,
            price_per_quantity: elementpr.price_per_quantity,
            points_per_quantity: elementpr.points_per_quantity,
            currency_code: elementpr.currency_code,
            isextra: aa,
            qty: qty,
          });
        }
        setprlist(votes);
        Cal_Total([]);
      }

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
            console.log('===', elementpr.price_per_quantity);
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

    console.log('totalval', totalval);
    settotalqty(prlist.length);
    settotalpoints(totalpn);
    settotalvalue(totalval);
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
    var response = await Helper.POST(Urls.view_cart_product_wise, formdata);
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
            <Text style={[Style.text12, { color: Colors.gray }]}>
              {item.name}
              <Text style={[Style.text12, { color: Colors.gray }]}>
                {services.length - 1 == index ? null : ', '}
              </Text>
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
    formdata.append('cart_id', item.id + '');
    console.log('add_cart', formdata);
    var response = await Helper.POST(Urls.cart_delete, formdata);
    if (response.status == 200) {
      console.log('response', response);
      showToast(response.Message, 'success');
      setLoding(false);
      apiCall_View_Cart(prlist, '2');
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
                          { marginTop: 0, color: Colors.blue, textAlign: 'left' },
                        ]}>
                        {brands[0]?.name}
                      </Text>
                      <Text style={[Style.text12]}>
                        {validationempty(brands[0]?.distance) ? 'Distance : ' + ((brands[0]?.distance).toFixed(2)) + ' Km' : ''}
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
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={offer_banner}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => {
                          navigation.navigate('ImageSliderLoad', {
                            index: index,
                            gallery: offer_banner,
                            flag: '2',
                          });
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

                <View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={web_link_banners}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => {
                          navigation.navigate('WebLoad', {
                            WebLoad: item.link,
                          });
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
                              width: WIDTH / 2.6,
                              marginTop: 10,
                              borderRadius: 18,
                            },
                          ]}
                          resizeMode={'contain'}
                        />
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
                              <Text style={[Style.text12]}>
                                {item.ingredients_name}
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
                                    {item.points_per_quantity} points or{' '}
                                    {item.price_per_quantity}{' '}
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
                                resizeMode={'cover'}
                              />

                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  marginTop: 6,
                                  width: '100%',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (item.qty > 0) {
                                      setitem(item);
                                      view_cart_product_wise(item);
                                      setaddphotovisible(true);
                                      // navigation.navigate('CartRemoveList', {
                                      //   product_id: item.id,
                                      //   item: item,
                                      //   type: type,
                                      //   user_id: user_id,
                                      // });
                                    } else {
                                      showToast(
                                        'Add Product to cart first!!',
                                        'error',
                                      );
                                    }
                                  }}
                                  style={{ flex: 1 }}>
                                  <Image
                                    source={Images.ic_remove}
                                    style={{ flex: 1 }}
                                    resizeMode={'contain'}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                  }}>
                                  {item.qty}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    apiCall_Add_Cart(item);
                                  }}
                                  style={{ flex: 1 }}>
                                  <Image
                                    source={Images.ic_add}
                                    style={{ flex: 1 }}
                                    resizeMode={'contain'}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </Card>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />

                  <View style={{ flexDirection: 'column', marginTop: 10 }}>
                    <Text
                      style={[
                        Style.text14,
                        {
                          marginTop: Platform.OS == 'ios' ? 8 : 0,
                          fontFamily: CustomeFonts.ComfortaaBold,
                          color: Colors.TheamColor2,
                          textAlign: 'left',
                        },
                      ]}>
                      Check out :
                    </Text>
                    <View style={{ flexDirection: 'row', flex: 3 }}>
                      <View
                        style={{
                          width: '28%',
                        }}>
                        <Text style={[Style.text12, { textAlign: 'left' }]}>
                          Total Qty :
                          <Text
                            style={[Style.text12, { color: Colors.TheamColor2 }]}>
                            {totalqty}
                          </Text>
                        </Text>
                      </View>

                      <View
                        style={{
                          width: '37%',
                        }}>
                        <Text style={[Style.text12, { textAlign: 'left' }]}>
                          Total Points :
                          <Text
                            style={[Style.text12, { color: Colors.TheamColor2 }]}>
                            {totalpoints}
                          </Text>
                        </Text>
                      </View>

                      <View
                        style={{
                          width: '353%',
                        }}>
                        <Text style={[Style.text12, { textAlign: 'left' }]}>
                          Total Value :
                          <Text
                            style={[Style.text12, { color: Colors.TheamColor2 }]}>
                            {totalvalue}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {validationempty(cartlist) ? (
                      <Mybutton
                        text="CONTINUE"
                        onPress={() => {
                          navigation.navigate('SetMapLocation', {
                            type: type,
                            user_id: user_id,
                            logo: logo,
                            user_available_points:
                              Mainarray[0]?.user_available_points,
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
            </View>
          </View>
        </ScrollView>

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
                            <Text style={[Style.text12]}>
                              {item1.ingredients_name}
                            </Text>

                            <FlatList
                              showsVerticalScrollIndicator={false}
                              data={prlist1}
                              style={{ marginTop: 6 }}
                              renderItem={({ item, index }) => (
                                <View>
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 18,
  },
  card_style: {
    marginVertical: 4,
    paddingVertical: 4,
    borderRadius: 18,
    marginHorizontal: 2,
    borderWidth: 0.5,
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
