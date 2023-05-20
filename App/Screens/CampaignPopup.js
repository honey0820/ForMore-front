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

var lang_id, terms;
const DealList = ({navigation, route}) => {
  const {voucher_id, business_id, itemdata} = route.params;
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);

  useEffect(() => {
    setData();
  }, []);

  const setData = async () => {
    setLoding(true);
    lang_id = await AsyncStorage.getItem('lang_id');
    if (lang_id == '1') {
      terms = itemdata.terms_eng;
    }
    if (lang_id == '2') {
      terms = itemdata.terms_albanian;
    }
    if (lang_id == '3') {
      terms = itemdata.terms_greek;
    }
    if (lang_id == '4') {
      terms = itemdata.terms_italian;
    }
    setLoding(false);
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
        {/* <View
          style={{
            marginTop: '8%',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity
            style={{
              marginVertical: 10,
              // justifyContent: 'flex-start',
              // alignSelf: 'flex-start',
            }}
            onPressIn={() => {
              navigation.goBack();
            }}>
            <Image style={{height: 30, width: 30}} source={Images.ic_close} />
          </TouchableOpacity>
          <Card containerStyle={[styles.card_style]}> */}

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
            contentContainerStyle={{
              margin: 10,
            }}>
            <View>
              <View style={{flexGrow: 1}}>
                <View
                  style={[styles.con_brand, {width: 100, marginBottom: 10}]}>
                  <Image
                    style={[styles.imageThumbnail, {marginVertical: 10}]}
                    source={
                      validationempty(itemdata.bussLogo)
                        ? {uri: Urls.imageUrl + itemdata.bussLogo}
                        : Images.ic_placeholder
                    }
                    resizeMode={'contain'}
                  />
                  <View style={styles.bottom_line}></View>
                </View>

                <Image
                  source={
                    validationempty(itemdata.banner_image)
                      ? {uri: Urls.imageUrl + itemdata.banner_image}
                      : Images.logo
                  }
                  style={styles.img_banner}
                  resizeMode="stretch"
                />

                <View style={{marginHorizontal: 10, marginVertical: 15}}>
                  <Text
                    style={[
                      Style.text14_bold,
                      {
                        color: Colors.TheamColor2,
                      },
                    ]}>
                    Terms:
                  </Text>
                  <Text style={[Style.text12, {}]}>{terms}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
    left: -8,
    top: -28,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    marginVertical: 0,
    borderWidth: 0.8,
    marginBottom: '10%',
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

export default DealList;
