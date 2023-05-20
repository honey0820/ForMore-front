import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
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
import {Card} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Mybutton from '../Compoment/mybutton';
import {CheckBox} from 'react-native-elements';

var lang_id, terms;
const App = ({navigation, route}) => {
  const {cart_id, product_id, type, item} = route.params;
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [checked, setChecked] = useState([]);
  const [prlist, setprlist] = useState([]);

  useEffect(() => {
    apiCall_product();
  }, []);

  const apiCall_product = async () => {
    setprlist([]);
    setLoding(true);
    var formdata = new FormData();
    formdata.append('product_id', product_id + '');
    var response = await Helper.POST(Urls.order_extra_product_wise, formdata);
    if (response.status == 200) {
      console.log('formdata', formdata);
      console.log('response==>', response);
      setLoding(false);
      if (validationempty(response.order_products)) {
        var votes = [];
        let qty = 1;
        for (let index = 0; index < response.order_products.length; index++) {
          const elementpr = response.order_products[index];
          votes.push({
            id: elementpr.id,
            product_id: elementpr.product_id,
            name: elementpr.name,
            productName: elementpr.productName,
            available_quantities: elementpr.available_quantities,
            price_per_quantity: elementpr.price_per_quantity,
            points_per_quantity: elementpr.points_per_quantity,
            currency_code: elementpr.currency_code,
            qty: qty,
          });
        }
        setprlist(votes);
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCall_Add_Cart = async () => {
    if (checked.length > 0) {
      var quantity = [];
      var extra_id = [];
      for (var i = 0; i < checked.length; i++) {
        for (var j = 0; j < prlist.length; j++) {
          if (checked[i] == prlist[j].id) {
            quantity.push(prlist[j].qty);
            extra_id.push(prlist[j].id);
          }
        }
      }

      var id = await AsyncStorage.getItem('id');
      setLoding(true);
      var formdata = new FormData();
      for (var i = 0; i < quantity.length; i++) {
        formdata.append('quantity[]', quantity[i]);
      }
      for (var i = 0; i < extra_id.length; i++) {
        formdata.append('extra_id[]', extra_id[i]);
      }
      formdata.append('type', type);
      formdata.append('cart_id', cart_id + '');
      formdata.append('user_id', id + '');

      console.log('formdata==>>', formdata);
      var response = await Helper.POST(Urls.add_cart_extra_details, formdata);
      if (response.status == 200) {
        console.log('add_cart', response);
        // showToast(response.Message, 'success');
        setLoding(false);
        navigation.goBack();
      } else {
        setLoding(false);
        showToast(response.Message, 'error');
      }
    } else {
      showToast('Select Extras', 'error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={[
          Style.auth_img_back_style,
          {alignSelf: 'center', justifyContent: 'center'},
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
          <Card containerStyle={[styles.card_style]}>
            <TopBar
              left={Images.ic_close}
              style={{left: -30, top: -10, height: 20}}
              iconstyle={{height: 30, width: 30}}
              onPressLeft={() => {
                navigation.goBack();
              }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <View style={{flexGrow: 1}}>
                  <View style={{marginBottom: 15}}>
                    <Image
                      source={{
                        uri: Urls.imageUrl + item.product_img,
                      }}
                      style={[styles.img_banner1, {marginTop: 0}]}
                      resizeMode="stretch"
                    />
                    <View style={{paddingHorizontal: 15}}>
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
                        {item.productName}
                      </Text>

                      <Text
                        style={[
                          Style.text12,
                          {color: Colors.blue, marginTop: 5},
                        ]}>
                        Extras
                      </Text>

                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={prlist}
                        renderItem={({item, index}) => (
                          <View>
                            <View style={{flexDirection: 'row', marginTop: 6}}>
                              <CheckBox
                                checked={checked.includes(item.id)}
                                onPress={() => {
                                  const newIds = [...checked];
                                  const index = newIds.indexOf(item.id);
                                  if (index > -1) {
                                    newIds.splice(index, 1);
                                  } else {
                                    newIds.push(item.id);
                                  }
                                  setChecked(newIds);
                                }}
                                containerStyle={styles.chk_style1}
                              />

                              <Text
                                style={[
                                  Style.text12,
                                  {flex: 4, textAlignVertical: 'center'},
                                ]}>
                                {item.name}
                              </Text>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 4,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '100%',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (item.qty > 1) {
                                      let temp_state = [...prlist];
                                      let temp_element = {...temp_state[index]};
                                      temp_element.qty = temp_element.qty - 1;
                                      temp_state[index] = temp_element;
                                      setprlist(temp_state);
                                    }
                                  }}>
                                  <Image
                                    source={Images.ic_remove}
                                    style={{flex: 1, height: 20}}
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
                                    let temp_state = [...prlist];
                                    let temp_element = {...temp_state[index]};
                                    temp_element.qty = temp_element.qty + 1;
                                    temp_state[index] = temp_element;
                                    setprlist(temp_state);
                                  }}>
                                  <Image
                                    source={Images.ic_add}
                                    style={{flex: 1, height: 20}}
                                    resizeMode={'contain'}
                                  />
                                </TouchableOpacity>
                              </View>

                              <Text
                                style={[
                                  Style.text12,
                                  {
                                    flex: 3,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                  },
                                ]}>
                                {item.price_per_quantity}
                                {item.currency_code}
                              </Text>

                              <Text
                                style={[
                                  Style.text12,
                                  {
                                    flex: 3,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                  },
                                ]}>
                                {item.points_per_quantity}
                              </Text>
                            </View>
                          </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />

                      <Mybutton
                        text="CONFIRM"
                        onPress={() => {
                          apiCall_Add_Cart();
                        }}
                        textstyle={{fontSize: 14}}
                        style={{
                          paddingHorizontal: 6,
                          width: '50%',
                          marginTop: 15,
                        }}
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
  );
};

const styles = StyleSheet.create({
  chk_style1: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  img_banner1: {
    height: HEIGHT / 5,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    margin: 0,
    marginBottom: 30,
    paddingBottom: 15,
    padding: 0,
  },
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
  img_banner: {
    height: HEIGHT / 5,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default App;
