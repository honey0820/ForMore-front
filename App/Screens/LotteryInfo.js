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
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {showToast} from '../Common/CommonMethods';
import Loader from '../Compoment/Loader';
import TopBar from '../Compoment/myTopBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import moment from 'moment';
import {validationempty} from '../Common/Validations';
import {NoData} from '../Common/CommonMethods';

const MyWallet = ({navigation, route}) => {
  const {voucher_id, business_id, bussLogo, itemdata} = route.params;

  const [loding, setLoding] = useState(false);
  const [selected, setselected] = useState(true);
  const [brandlist, setbrandlist] = useState([]);
  const [lottery_participants, setlottery_participants] = useState('');
  const [end_date, setend_date] = useState('');

  useEffect(() => {
    apiCalllist();
  }, []);

  const apiCalllist = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('voucher_id', voucher_id);
    var response = await Helper.POST(Urls.get_lottery, formdata);

    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.Lottery);

      if (validationempty(response.lottery_participants)) {
        setlottery_participants(
          response.lottery_participants?.lottery_participants,
        );
        setend_date(response.end_date?.end_date);
      }
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
        style={Style.auth_img_back_style1}>
        <Loader loading={loding} />
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            // paddingLeft: 10,
            paddingBottom: 10,
          }}>
          <TopBar
            left={Images.ic_close}
            style={{left: -30, top: -5, height: 20}}
            iconstyle={{height: 30, width: 30}}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View>
              <View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[styles.con_brand, {width: 100, marginBottom: 10}]}>
                    <View>
                      <Image
                        style={[styles.imageThumbnail, {marginVertical: 10}]}
                        source={
                          validationempty(bussLogo)
                            ? {uri: Urls.imageUrl + bussLogo}
                            : Images.ic_placeholder
                        }
                        resizeMode={'contain'}
                      />
                    </View>

                    <View style={styles.bottom_line}></View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 0,
                    }}
                    onPress={() => {
                      navigation.navigate('CampaignPopup', {
                        business_id: business_id,
                        voucher_id: voucher_id,
                        itemdata: itemdata,
                      });
                    }}>
                    <Image style={[styles.iconStyle]} source={Images.ic_info} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    Style.text14,
                    {
                      textAlign: 'center',
                      color: Colors.TheamColor2,
                    },
                  ]}>
                  Total Participation : {lottery_participants}
                </Text>
                <Text
                  style={[
                    Style.text14,
                    {
                      marginBottom: 8,
                      textAlign: 'center',
                      color: Colors.TheamColor2,
                    },
                  ]}>
                  Date to Draw :{' '}
                  {validationempty(end_date)
                    ? moment(end_date).format('YYYY-MM-DD')
                    : ''}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginHorizontal: '8%',
                }}>
                <View style={[styles.con_brand, {flex: 1, marginRight: 10}]}>
                  <View>
                    <Image
                      style={[
                        styles.imageThumbnail,
                        {height: 40, marginVertical: 15},
                      ]}
                      source={Images.ic_cal}
                      resizeMode={'contain'}
                    />
                  </View>

                  <View style={styles.bottom_line}></View>
                </View>

                <View style={[styles.con_brand, {flex: 1, marginLeft: 10}]}>
                  <View>
                    <Image
                      style={[
                        styles.imageThumbnail,
                        {height: 40, marginVertical: 15},
                      ]}
                      source={Images.ic_lottery}
                      resizeMode={'contain'}
                    />
                  </View>

                  <View style={styles.bottom_line}></View>
                </View>
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={brandlist}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: '8%',
                    }}>
                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        {
                          flex: 1,
                          marginRight: 10,
                          paddingVertical: 10,
                          textAlignVertical: 'center',
                          textAlign: 'center',
                        },
                      ]}>
                      {moment(item.created_at).format('YYYY-MM-DD')}
                    </Text>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        {
                          flex: 1,
                          marginLeft: 10,
                          paddingVertical: 10,
                          textAlignVertical: 'center',
                          textAlign: 'center',
                        },
                      ]}>
                      {item.lotery_code}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<NoData />}
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottom_line: {
    height: 4,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  iconStyle: {
    width: 30,
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
