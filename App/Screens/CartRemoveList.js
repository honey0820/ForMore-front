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
  CheckBox,
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
import {Card, Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Mybutton from '../Compoment/mybutton';
// import {CheckBox} from 'react-native-elements';

var lang_id, terms;
const App = ({navigation, route}) => {
  const {product_id, item, type, user_id} = route.params;
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [checked, setchecked] = useState([]);
  const [prlist, setprlist] = useState([]);

  useEffect(() => {
    apiCall_product();
  }, []);

  const apiCall_product = async () => {
    var id = await AsyncStorage.getItem('id');
    setprlist([]);
    setLoding(true);
    var formdata = new FormData();
    formdata.append('user_id', id + '');
    formdata.append('type', type + '');
    formdata.append('business_id', user_id + '');
    formdata.append('product_id', product_id + '');
    console.log('formdata', formdata);
    var response = await Helper.POST(Urls.view_cart_product_wise, formdata);
    if (response.status == 200) {
      console.log('response', response);
      setLoding(false);
      setprlist(response.view_cart);
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
            <Text style={[Style.text12, {color: Colors.gray}]}>
              {item.name}
              {', '}
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
      navigation.goBack();
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
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
                        {item.name}
                      </Text>
                      {/* <Text style={[Style.text12]}>
                        {item.ingredients_name}
                      </Text> */}

                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={prlist}
                        style={{marginTop: 6}}
                        renderItem={({item, index}) => (
                          <View>
                            <View style={{flexDirection: 'row', flex: 1}}>
                              <View>
                                <Text
                                  style={[
                                    Style.text14,
                                    {
                                      marginTop: Platform.OS == 'ios' ? 8 : 0,
                                      fontFamily: CustomeFonts.ComfortaaBold,
                                      color: Colors.lightblack,
                                      textAlign: 'left',
                                    },
                                  ]}>
                                  {item.name}
                                </Text>

                                {validationempty(item.extra_details)
                                  ? list1(item.extra_details)
                                  : null}

                                {/* <View>
                                <View
                                  style={{
                                    marginVertical: 5,
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
                                          Platform.OS == 'ios' ? 8 : 8,
                                        paddingHorizontal: 10,
                                      },
                                    ]}>
                                    {item.points_per_quantity} points or{' '}
                                    {item.price_per_quantity} all
                                  </Text>
                                </View>
                              </View> */}
                              </View>

                              <TouchableOpacity
                                onPress={() => {
                                  apiCall_Delete_Cart(item);
                                }}
                                style={{flex: 1, justifyContent: 'center'}}>
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
                                {marginVertical: 4},
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
  );
};

const styles = StyleSheet.create({
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
