import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
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
import Clipboard from '@react-native-clipboard/clipboard';
import {showToast, NoData} from '../Common/CommonMethods';
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
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const UserInfo = ({navigation, route}) => {
  const {buss_id, brand_icon} = route.params;
  const [loading, setLoding] = useState(false);
  const [TRLIST, setTRLIST] = useState([]);

  useEffect(() => {
    apiCalltransclist();
  }, []);

  const apiCalltransclist = async () => {
    setLoding(true);
    setTRLIST([]);
    var id = await AsyncStorage.getItem('id');
    var formdata = new FormData();
    formdata.append('user_id', id);
    formdata.append('buss_id', buss_id);
    console.log('formdata', formdata);
    var response = await Helper.POST(Urls.orders_user_buss_wise_view, formdata);
    console.log('===orders_user_buss_wise_view', response);
    if (response.status == 200) {
      setLoding(false);
      setTRLIST(response.orders_user_buss_wise_view);
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
        <Loader loading={loading} />

        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            paddingVertical: 10,
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

          <Image
            source={Images.logo}
            style={[Style.auth_img_style, {height: HEIGHT / 8.5}]}
            resizeMode="contain"
          />

          <Image
            source={
              validationempty(brand_icon)
                ? {uri: Urls.imageUrl + brand_icon}
                : Images.ic_placeholder
            }
            style={[Style.auth_img_style, {height: HEIGHT / 8.5}]}
            resizeMode="contain"
          />

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingHorizontal: 10,
            }}>
            <Image
              style={styles.img_main}
              source={Images.or_6}
              resizeMode="contain"
            />

            <Image
              style={styles.img_main}
              source={Images.or_4}
              resizeMode={'contain'}
            />

            <Image
              style={styles.img_main}
              source={Images.or_5}
              resizeMode={'contain'}
            />
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={TRLIST}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('OrderDetails', {
                    order_id: item.id,
                  });
                }}
                style={{
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>

<View style={[styles.con_brand]}>
                <Text
                  style={[
                    Style.text12, 
                    {alignItems:'center',textAlign:'center'
                    },
                  ]}>
                  {moment(item.created_at).format('DD/MM/YY')}
                </Text>
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
                      validationempty(item.brand_icon)
                        ? {uri: Urls.imageUrl + item.brand_icon}
                        : Images.ic_placeholder
                    }
                    resizeMode={'contain'}
                  />
                </View>

                <View style={[styles.con_brand]}>
                <Text
                  style={[
                    Style.text12, 
                    {alignItems:'center',textAlign:'center' },
                  ]}>
                 {item.status}
                </Text>
                </View>

               
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<NoData />}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageThumbnail: {
    width: '100%',
    height: WIDTH / 4,
  },
  bottom_line: {
    height: 4,
    marginHorizontal: 10,
    backgroundColor: Colors.TheamColor2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  iconStyle: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
  },
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
    height: 40,
  },
  con_brand: {
    justifyContent:'center',
    margin: 5,
    paddingHorizontal: 6,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  con_brand_m: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lg_gray,
  },
});

export default UserInfo;
