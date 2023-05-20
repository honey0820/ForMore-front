import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
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
  const {flag} = route.params;
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
    apiCallLanguage_Info();
    apiCallBrandlist();
  }, []);

  const apiCallLanguage_Info = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Choose Brand');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    setLoding(false);
    if (response.status == 200) {
      setinfo(response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCallBrandlist = async () => {
    setLoding(true);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('type', flag == 'lottery' ? 'lottery' : '');
    var response = await Helper.POST(Urls.brand_vocher_wise, formdata);
    console.log(formdata);
    setbrandlist([]);
    if (response.status == 200) {
      setLoding(false);
      setbrandlist(response.brand);
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
              <View
                style={{
                  flexGrow: 1,
                }}>
                <Image
                  source={Images.logo}
                  style={[
                    Style.auth_img_style,
                    {height: HEIGHT / 8, marginTop: 5},
                  ]}
                  resizeMode="contain"
                />

                {flag == 'lottery' ? (
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
                    Lottery Participations
                  </LText>
                ) : null}
                {flag == 'lottery' ? null : (
                  <LText
                    style={[
                      Style.text14_bold,
                      {
                        marginTop: 10,
                        color:
                          flag == 'lottery' ? Colors.blue : Colors.TheamColor2,
                        fontSize: 20,
                        textAlign: 'center',
                      },
                    ]}>
                    Choose Brand
                  </LText>
                )}
                {validationempty(info) ? (
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
                ) : null}

                <FlatList
                  data={brandlist}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.con_brand,
                        {
                          width: '31%',
                          margin: 4,
                          flex: 0,
                        },
                      ]}
                      onPress={() => {
                        navigation.navigate('ChooseCampaign', {
                          business_id: item.brand_id,
                          bussLogo: item.bussLogo,
                          flag: flag,
                        });
                      }}>
                      <Image
                        style={[styles.imageThumbnail]}
                        source={
                          validationempty(item.bussLogo)
                            ? {uri: Urls.imageUrl + item.bussLogo}
                            : Images.ic_placeholder
                        }
                        resizeMode={'center'}
                      />
                      <View style={styles.bottom_line}></View>
                    </TouchableOpacity>
                  )}
                  numColumns={3}
                  key={3}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<NoData />}
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
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 4,
  },
  buttonStyle1: {
    flex: 1,
    margin: 0,
    marginRight: 10,
    backgroundColor: Colors.TheamColor2,
    // borderColor: Colors.blue,
    // borderWidth: 1,
  },
  buttonStyle2: {
    flex: 1,
    margin: 0,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lg_gray,
  },
  bottom_line: {
    height: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderColor: Colors.lightblack,
    borderWidth: 1.8,
    borderRadius: 35,
  },
  cno_left: {
    width: WIDTH / 4.5,
    height: 102,
    borderRadius: 8,
    borderWidth: 0.5,
    justifyContent: 'center',
    marginVertical: 0,
    marginHorizontal: 0,
  },
  cno_right: {
    flex: 1,
    borderWidth: 0.5,
    paddingLeft: 8,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginHorizontal: 0,
  },
});

export default DealList;
