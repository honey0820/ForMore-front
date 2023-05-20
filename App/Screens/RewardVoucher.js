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
import {SafeAreaView} from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';

const DealList = ({navigation, route}) => {
  const {business_id, bussLogo, flag, type} = route.params;
  const [selected, setselected] = useState(true);
  const {width} = useWindowDimensions();
  const [latitude, setlatitude] = useState('0');
  const [longitude, setlongitude] = useState('0');
  const [info, setinfo] = useState('');
  const [catid, setcatid] = useState('');
  const [catlist, setcatlist] = useState([]);
  const [businesslist, setbusinesslist] = useState([]);
  const [brandlist, setbrandlist] = useState([]);
  const [loding, setLoding] = useState(false);

  useEffect(() => {
    // setLoding(true);
    // apiCallLanguage_Info();
    apiCalllist();
  }, []);

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Voucher info');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log(response);
    if (response.status == 200) {
      setinfo(response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCalllist = async () => {
    setLoding(true);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('business_id', business_id);
    if (flag == 'stamp') {
    } else {
      formdata.append('levels_based_on_scenarios', flag);
    }

    var response = await Helper.POST(Urls.super_deal_vocher, formdata);
    console.log(formdata);
    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.vouchers);
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
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
          <TopBar
            left={Images.ic_close}
            style={{left: -40, top: -5, height: 20}}
            iconstyle={{height: 30, width: 30}}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View>
              <View style={{flexGrow: 1}}>
                <TouchableOpacity
                  style={[styles.con_brand, {width: 100, marginBottom: 10}]}>
                  <Image
                    style={[styles.imageThumbnail, {marginVertical: 10}]}
                    source={
                      validationempty(bussLogo)
                        ? {uri: Urls.imageUrl + bussLogo}
                        : Images.ic_placeholder
                    }
                    resizeMode={'contain'}
                  />
                  <View style={styles.bottom_line}></View>
                </TouchableOpacity>

                <LText
                  style={[
                    Style.text14_bold,
                    {
                      marginTop: 0,
                      color: Colors.TheamColor2,
                      fontSize: 20,
                      textAlign: 'center',
                    },
                  ]}>
                  Vouchers
                </LText>
                {/* {validationempty(info) ? (
                  <AutoHeightWebView
                    style={{
                      width: '100%',
                      margin: 8,
                    }}
                    source={{
                      html: info,
                    }}
                    viewportContent={'width=device-width, user-scalable=no'}
                  />
                ) : null} */}

                <FlatList
                  style={{marginHorizontal: 10}}
                  data={brandlist}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('RewardCampaignPopup', {
                          business_id: business_id,
                          voucher_id: item.id,
                          itemdata: item,
                          flag: flag,
                          type: type,
                        });
                      }}>
                      <Image
                        source={
                          validationempty(item.banner_image)
                            ? {uri: Urls.imageUrl + item.banner_image}
                            : Images.logo
                        }
                        style={
                          validationempty(item.banner_image)
                            ? styles.img_banner
                            : [styles.img_banner, {}]
                        }
                        resizeMode={
                          validationempty(item.banner_image)
                            ? 'stretch'
                            : 'center'
                        }
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={
                    <NoData itemtext={'No Voucher Available For Now'} />
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
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
  img_banner: {
    height: HEIGHT / 6,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    // borderColor: Colors.lg_gray,
    // borderWidth: 0.2,
  },
});

export default DealList;
