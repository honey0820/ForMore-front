import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Header from '../Compoment/Header';
import Mybutton from '../Compoment/mybutton';
import Icon from 'react-native-vector-icons/Ionicons';
import LText from '../Compoment/LText';
import {logout} from '../Common/CommonMethods';
import {showToast} from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validationempty} from '../Common/Validations';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const MyWallet = ({navigation}) => {
  const [loding, setLoding] = useState(false);
  const [selected, setselected] = useState(true);
  const [businesslist, setbusinesslist] = useState([]);
  const [brandlist, setbrandlist] = useState([]);

  useEffect(() => {
    apiCallActivelist();
    apiCallusedlist();
  }, []);

  const apiCallActivelist = async (catid) => {
    setLoding(true);
    setbusinesslist([]);

    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);
    var response = await Helper.POST(Urls.get_vouchers, formdata);

    console.log('responselist', response);
    if (response.status == 200) {
      setLoding(false);
      setbusinesslist(response.vouchers);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallusedlist = async () => {
    setLoding(true);
    setbrandlist([]);

    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);

    var response = await Helper.POST(Urls.get_used_vouchers, formdata);
    console.log('get_used_vouchers', response);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.used);
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
        <Header navigation={navigation} />

        <Loader loading={loding} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Image
                  source={Images.logo}
                  style={[Style.auth_img_style, {height: HEIGHT / 7}]}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  navigation.navigate('ChooseBrand', {flag: 'lottery'});
                }}>
                <Image style={styles.iconStyle} source={Images.ic_wlt} />
              </TouchableOpacity>
            </View>

            <LText
              style={[
                Style.text14_bold,
                {
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 15,
                },
              ]}>
              My Wallet
            </LText>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 10,
                marginHorizontal: 20,
              }}>
              <Mybutton
                text="Active"
                onPress={() => {
                  setselected(true);
                  apiCallActivelist();
                }}
                style={selected ? styles.buttonStyle1 : styles.buttonStyle2}
                textstyle={selected ? {} : {color: Colors.TheamColor2}}
              />
              <Mybutton
                text="Expired/Used"
                onPress={() => {
                  setselected(false);
                  apiCallusedlist();
                }}
                style={!selected ? styles.buttonStyle1 : styles.buttonStyle2}
                textstyle={!selected ? {} : {color: Colors.TheamColor2}}
              />
            </View>

            <View style={{marginHorizontal: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.img_main}
                  source={Images.ic_w1}
                  resizeMode={'contain'}
                />

                <Image
                  style={styles.img_main}
                  source={Images.ic_w2}
                  resizeMode={'contain'}
                />

                <Image
                  style={styles.img_main}
                  source={Images.ic_w3}
                  resizeMode={'contain'}
                />

                <Image
                  style={styles.img_main}
                  source={Images.ic_w4}
                  resizeMode={'contain'}
                />
              </View>

              {selected ? (
                <View style={{width: '100%'}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={businesslist}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('GiftCard', {
                            bussLogo: item.bussLogo,
                            image: item.image,
                            end_date: item.end_date,
                            days: item.days,
                            voucher_id: item.id,
                          });
                        }}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={[
                            Style.text10,
                            styles.con_brand,
                            {
                              flex: 1,
                              color: Colors.black,
                              textAlignVertical: 'center',
                              textAlign: 'center',
                              ...Platform.select({
                                ios: {
                                  lineHeight: WIDTH / 12, // as same as height
                                },
                                android: {},
                              }),
                            },
                          ]}>
                          {moment(item.end_date).format('YYYY-MM-DD')}
                        </Text>

                        <View style={styles.con_brand}>
                          <FastImage
                            style={[
                              {
                                height: WIDTH / 12,
                                width: '100%',
                                marginBottom: 2,
                              },
                            ]}
                            source={{uri: Urls.imageUrl + item.bussLogo}}
                            resizeMode={'contain'}
                          />
                        </View>
                        <View style={styles.con_brand}>
                          <FastImage
                            style={[
                              {
                                height: WIDTH / 12,
                                width: '100%',
                                marginBottom: 2,
                              },
                            ]}
                            source={
                              validationempty(item.icon)
                                ? {uri: Urls.imageUrl + item.icon}
                                : Images.ic_placeholder
                            }
                            resizeMode={'contain'}
                          />
                        </View>
                        <Text
                          style={[
                            Style.text10,
                            styles.con_brand,
                            {
                              flex: 1,
                              color: Colors.black,
                              textAlignVertical: 'center',
                              textAlign: 'center',
                              ...Platform.select({
                                ios: {
                                  lineHeight: WIDTH / 12, // as same as height
                                },
                                android: {},
                              }),
                            },
                          ]}>
                          {item.voucherCategory}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={brandlist}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={[
                          Style.text10,
                          styles.con_brand,
                          {
                            flex: 1,
                            color: Colors.black,
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            ...Platform.select({
                              ios: {
                                lineHeight: WIDTH / 12, // as same as height
                              },
                              android: {},
                            }),
                          },
                        ]}>
                        {item.end_date}
                      </Text>

                      <View style={styles.con_brand}>
                        <FastImage
                          style={[
                            {
                              height: WIDTH / 12,
                              width: '100%',
                              marginBottom: 2,
                              borderRadius: 4,
                            },
                          ]}
                          source={{uri: Urls.imageUrl + item.bussLogo}}
                          resizeMode={'contain'}
                        />
                      </View>
                      <View style={styles.con_brand}>
                        <FastImage
                          style={[
                            {
                              height: WIDTH / 12,
                              width: '100%',
                              marginBottom: 2,
                            },
                          ]}
                          source={
                            validationempty(item.icon)
                              ? {uri: Urls.imageUrl + item.icon}
                              : Images.ic_placeholder
                          }
                          resizeMode={'contain'}
                        />
                      </View>
                      <Text
                        style={[
                          Style.text10,
                          styles.con_brand,
                          {
                            flex: 1,
                            color: Colors.black,
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            ...Platform.select({
                              ios: {
                                lineHeight: WIDTH / 12, // as same as height
                              },
                              android: {},
                            }),
                          },
                        ]}>
                        {item.voucherCategory}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 35,
    height: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  buttonStyle1: {
    margin: 0,
    marginRight: 10,
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: Colors.TheamColor2,
  },
  buttonStyle2: {
    margin: 0,
    marginRight: 8,
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingHorizontal: 0,
    borderColor: Colors.lg_gray,
  },
  con_brand: {
    margin: 5,
    paddingHorizontal: 6,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 6,
  },
  img_main: {
    flex: 1,
    height: WIDTH / 4.5,
  },
});

export default MyWallet;
