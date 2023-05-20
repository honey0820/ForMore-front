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
  const {itemdata, flag, type} = route.params;
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);

  useEffect(() => {
    console.log(flag);
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

  const ApicallSubmit = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var id = await AsyncStorage.getItem('id');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('user_id', id + '');
    formdata.append('code', itemdata.code + '');
    formdata.append('language_id', lang_id + '');
    formdata.append('type', type);

    console.log(formdata);
    var response = await Helper.POST(Urls.super_deal_scan, formdata);
    console.log(response);
    setLoding(false);
    if (response.status == 200) {
      navigation.popToTop();
      showToast(response.Message, 'success');
    } else {
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
              style={{left: -50, top: -20, height: 20}}
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
                  <TouchableOpacity
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
                  </TouchableOpacity>

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

                  <Mybutton
                    text="CREDIT"
                    onPress={() => {
                      ApicallSubmit();
                    }}
                    style={{
                      marginTop: 10,
                      width: '70%',
                    }}
                  />
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
  card_style: {
    borderRadius: 18,
    width: '90%',
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
