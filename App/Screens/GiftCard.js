import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../Compoment/Loader';
import Mybutton from '../Compoment/mybutton';
import {LocalData, Urls} from '../Common/Urls';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validationempty} from '../Common/Validations';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {showToast} from '../Common/CommonMethods';

const Giftcard = ({navigation, route}) => {
  const {voucher_id, bussLogo, end_date, image, days} = route.params;
  const [loding, setLoding] = useState(false);

  useEffect(() => {}, []);

  const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        <View
          style={{
            marginVertical: '8%',
            marginTop: '20%',
            marginHorizontal: 10,
            backgroundColor: 'transparent',
          }}>
          <Card containerStyle={[styles.card_style]}>
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

            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  style={[
                    Style.text12,
                    {textAlign: 'right', marginBottom: 10},
                  ]}>
                  Expiry Date : {moment(end_date).format('YYYY-MM-DD')}
                </Text>

                <TouchableOpacity
                  style={[styles.con_brand, {width: 120, marginBottom: '10%'}]}>
                  <Image
                    style={[styles.imageThumbnail, {marginTop: 10}]}
                    source={{uri: Urls.imageUrl + bussLogo}}
                    resizeMode={'contain'}
                  />

                  <Text
                    style={[
                      Style.text14_bold,
                      {
                        fontSize: 12,
                        color: Colors.black,
                        textAlign: 'center',
                        marginVertical: 10,
                      },
                    ]}>
                    BUSINESS{'\n'}LOGO
                  </Text>

                  <View style={styles.bottom_line}></View>
                </TouchableOpacity>

                <Card
                  containerStyle={[
                    Style.card,
                    {marginVertical: 0, padding: 10},
                  ]}>
                  <FastImage
                    style={[
                      styles.imageThumbnail,
                      {resizeMode: 'contain', height: 100},
                    ]}
                    source={
                      validationempty(image)
                        ? {uri: Urls.imageUrl + image}
                        : Images.ic_placeholder
                    }
                  />
                </Card>

                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={Images.logo}
                    style={[
                      Style.auth_img_style,
                      {flex: 2.5, height: 60, marginRight: 4},
                    ]}
                    resizeMode="contain"
                  />

                  <Mybutton
                    text="Send as a Gift"
                    iconname={Images.ic_send_gift}
                    onPress={() => {
                      const date1 = new Date(
                        moment(new Date()).format('YYYY-MM-DD'),
                      );

                      const date2 = new Date(
                        moment(end_date).format('YYYY-MM-DD'),
                      );

                      if (
                        getDifferenceInDays(date1, date2) >
                        (validationempty(days) ? days : 0)
                      ) {
                        navigation.goBack();
                        navigation.navigate('SendGiftCard', {
                          voucher_id: voucher_id,
                        });
                      } else {
                        showToast('This gift card can not be shared.', 'info');
                      }
                    }}
                    textstyle={{letterSpacing: 0}}
                    style={{
                      flex: 7,
                      paddingHorizontal: 0,
                      marginHorizontal: 10,
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
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -28,
    top: -28,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '4%',
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
});

export default Giftcard;
