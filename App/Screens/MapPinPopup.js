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

const DealList = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);

  useEffect(() => {}, []);

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
                      source={Images.ic_placeholder}
                      resizeMode={'contain'}
                    />
                    <View style={styles.bottom_line}></View>
                  </TouchableOpacity>

                  <Image
                    source={Images.placeholder4}
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
                    <Text style={[Style.text12, {}]}>
                      Reference site about Lorem Ipsum, giving information on
                      its origins, as well as a random Lipsum generator.Lorem
                      ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Text>
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
