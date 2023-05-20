import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {showToast} from '../Common/CommonMethods';
import TopBar from '../Compoment/myTopBar';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import LanguageModal from '../Compoment/LanguageModal';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validationempty} from '../Common/Validations';

const UserInfo = ({navigation}) => {
  const [loading, setLoding] = useState(false);
  const [brandlist, setbrandlist] = useState([]);
  const [pointlist, setpointlist] = useState([]);

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    setbrandlist([]);
    setpointlist([]);
    setLoding(true);
    var user_id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', user_id + '');

    var response = await Helper.POST(Urls.my_rewards, formdata);
    if (response.status == 200) {
      console.log('response.formdata', formdata);
      console.log('response.my_rewards', response);
      setLoding(false);
      setbrandlist(response.my_rewards);
      setpointlist(response.my_rewards_point);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const setData = async (level, item) => {
    Alert.alert('Formore', 'My Alert Msg', [
      {
        text: 'continue to next level',
        onPress: () => console.log('continue to next level'),
        style: 'cancel',
      },
      {
        text: 'Take the voucher',
        onPress: () => {
          navigation.navigate('RewardVoucher', {
            business_id: item.business_id,
            bussLogo: item.brand_icon,
            flag: level,
            type: '1',
          });
        },
      },
    ]);

    console.log('flag==>', flag);
  };

  const list = () => {
    return pointlist.map((item) => {
      let pointfornextlevel = '0';
      let schema = item.schema;
      let point = item.point;
      if (schema == '1') {
        if (parseFloat(point) >= parseFloat(item.win_direct_point)) {
          pointfornextlevel = '0';
        } else {
          pointfornextlevel =
            parseFloat(item.win_direct_point) - parseFloat(point);
        }
      }
      if (schema == '2') {
        if (parseFloat(point) >= parseFloat(item.levels_based_amount_4)) {
          pointfornextlevel = '0';
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_3)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_4) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_2)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_3) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_1)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_2) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_0)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_1) - parseFloat(point);
        } else {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_0) - parseFloat(point);
        }
      }
      if (schema == '3') {
        if (parseFloat(point) >= parseFloat(item.levels_based_amount_4)) {
          pointfornextlevel = '0';
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_3)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_4) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_2)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_3) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_1)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_2) - parseFloat(point);
        } else if (
          parseFloat(point) >= parseFloat(item.levels_based_amount_0)
        ) {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_1) - parseFloat(point);
        } else {
          pointfornextlevel =
            parseFloat(item.levels_based_amount_0) - parseFloat(point);
        }
      }

      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            let level;
            let schema = item.schema;
            let point = item.point;
            if (schema == '1') {
              if (parseFloat(point) >= parseFloat(item.win_direct_point)) {
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: 'stamp',
                  type: '1',
                });
              } else {
                navigation.navigate('LoyaltyPoints', {
                  itemdata: item,
                  totalpoint: item.win_direct_point,
                });
              }
            }

            if (schema == '2') {
              if (parseFloat(point) >= parseFloat(item.levels_based_amount_4)) {
                level = '4';
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: '4',
                  type: '1',
                });
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_3)
              ) {
                level = '3';
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: '3',
                  type: '1',
                });
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_2)
              ) {
                level = '2';
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: '2',
                  type: '1',
                });
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_1)
              ) {
                level = '1';
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: '1',
                  type: '1',
                });
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_0)
              ) {
                level = '0';
                navigation.navigate('RewardVoucher', {
                  business_id: item.business_id,
                  bussLogo: item.brand_icon,
                  flag: '0',
                  type: '1',
                });
              } else {
                let tl;
                if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_4)
                ) {
                  tl = '0';
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_3)
                ) {
                  tl = item.levels_based_amount_4;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_2)
                ) {
                  tl = item.levels_based_amount_3;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_1)
                ) {
                  tl = item.levels_based_amount_2;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_0)
                ) {
                  tl = item.levels_based_amount_1;
                } else {
                  tl = item.levels_based_amount_0;
                }
                console.log('======>', tl);
                navigation.navigate('LoyaltyPoints', {
                  itemdata: item,
                  totalpoint: tl + '',
                });
              }
            }

            if (schema == '3') {
              if (parseFloat(point) >= parseFloat(item.levels_based_amount_4)) {
                level = '4';
                setData(level, item);
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_3)
              ) {
                level = '3';
                setData(level, item);
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_2)
              ) {
                level = '2';
                setData(level, item);
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_1)
              ) {
                level = '1';
                setData(level, item);
              } else if (
                parseFloat(point) >= parseFloat(item.levels_based_amount_0)
              ) {
                level = '0';
                setData(level, item);
              } else {
                let tl;
                if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_4)
                ) {
                  tl = '0';
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_3)
                ) {
                  tl = item.levels_based_amount_4;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_2)
                ) {
                  tl = item.levels_based_amount_3;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_1)
                ) {
                  tl = item.levels_based_amount_2;
                } else if (
                  parseFloat(point) >= parseFloat(item.levels_based_amount_0)
                ) {
                  tl = item.levels_based_amount_1;
                } else {
                  tl = item.levels_based_amount_0;
                }
                console.log('======>', tl);
                navigation.navigate('LoyaltyPoints', {
                  itemdata: item,
                  totalpoint: tl,
                });
              }
            }
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={styles.con_brand}>
            <Image
              style={[
                {
                  height: WIDTH / 12,
                  width: '100%',
                  marginBottom: 2,
                },
              ]}
              source={{uri: Urls.imageUrl + item.brand_icon}}
              resizeMode={'contain'}
            />
          </View>

          <Text
            style={[
              Style.text12,
              styles.con_brand,
              {
                flex: 1,
                textAlign: 'center',
                ...Platform.select({
                  ios: {
                    lineHeight: WIDTH / 12, // as same as height
                  },
                  android: {},
                }),
              },
            ]}>
            {validationempty(item.stamps)
              ? item.stamps + '/' + item.setup_level
              : 'N/A'}
          </Text>

          <Text
            style={[
              Style.text12,
              styles.con_brand,
              {
                flex: 1,
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
            {validationempty(item.point) ? item.point : item.point_per_stamp}
          </Text>

          <Text
            style={[
              Style.text12,
              styles.con_brand,
              {
                flex: 1,
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
            {pointfornextlevel}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            padding: 10,
          }}>
          <View style={styles.v_sty_close}>
            <TouchableOpacity
              onPressIn={() => {
                navigation.goBack();
              }}>
              <Image
                source={Images.ic_close}
                style={styles.img_back_style}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Loader loading={loading} />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <LText
              style={[
                Style.text14_bold,
                {
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                },
              ]}>
              My Rewards
            </LText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Image
              style={styles.img_main}
              source={Images.ic_r1}
              resizeMode="contain"
            />

            <Image
              style={styles.img_main}
              source={Images.ic_r2}
              resizeMode={'contain'}
            />

            <Image
              style={styles.img_main}
              source={Images.ic_r3}
              resizeMode={'contain'}
            />

            <Image
              style={styles.img_main}
              source={Images.ic_r4}
              resizeMode={'contain'}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={brandlist}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    //stamp
                    if (validationempty(item.stamps)) {
                      if (item.stamps == item.setup_level) {
                        navigation.navigate('RewardVoucher', {
                          business_id: item.buss_id,
                          bussLogo: item.brand_icon,
                          flag: 'stamp',
                          type: '2',
                        });
                      } else {
                        navigation.navigate('LoyaltyPoints', {
                          itemdata: item,
                        });
                      }
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <View style={styles.con_brand}>
                    <Image
                      style={[
                        {
                          height: WIDTH / 12,
                          width: '100%',
                          marginBottom: 2,
                        },
                      ]}
                      source={{uri: Urls.imageUrl + item.brand_icon}}
                      resizeMode={'contain'}
                    />
                  </View>

                  <Text
                    style={[
                      Style.text12,
                      styles.con_brand,
                      {
                        flex: 1,
                        textAlign: 'center',
                        ...Platform.select({
                          ios: {
                            lineHeight: WIDTH / 12, // as same as height
                          },
                          android: {},
                        }),
                      },
                    ]}>
                    {validationempty(item.ustamp)
                      ? item.ustamp + '/' + item.setup_level
                      : 'N/A'}
                  </Text>

                  <Text
                    style={[
                      Style.text12,
                      styles.con_brand,
                      {
                        flex: 1,
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
                    {validationempty(item.point) ? item.point : ''}
                  </Text>

                  <Text
                    style={[
                      Style.text12,
                      styles.con_brand,
                      {
                        flex: 1,
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
                    {'N/A'}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {validationempty(pointlist) ? (
              <View style={{width: '100%', flexGrow: 1}}>{list()}</View>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -10,
    top: -10,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
  text16_bold: {
    fontSize: 16,
    color: Colors.TheamColor2,
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text14_bold: {
    fontSize: 14,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text12_bold: {
    fontSize: 12,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaRegular,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    borderWidth: 0.8,
  },
  img_main: {
    flex: 1,
    height: 50,
  },
  con_brand: {
    margin: 5,
    paddingHorizontal: 6,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default UserInfo;
