import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  ImageBackground,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Mybutton from '../Compoment/mybutton';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {RFValue} from 'react-native-responsive-fontsize';
import Header from '../Compoment/Header';
import {showToast} from '../Common/CommonMethods';
import {SafeAreaView} from 'react-native-safe-area-context';
import Loader from '../Compoment/Loader';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validationempty} from '../Common/Validations';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import LText from '../Compoment/LText';
import moment from 'moment';
import TopBar from '../Compoment/myTopBar';

const App = ({navigation, route}) => {
  const {order_id} = route.params;
  const [loding, setLoding] = useState(false);
  const [TRLIST, setTRLIST] = useState({});

  useEffect(() => {
    apiCalltransclist();
  }, []);

  const apiCalltransclist = async () => {
    setLoding(true);
    setTRLIST({});
    var formdata = new FormData();
    formdata.append('order_id', order_id);
    console.log('=====>', order_id);
    var response = await Helper.POST(Urls.orders_details_view, formdata);
    if (response.status == 200) {
      console.log('=====>', response);
      setLoding(false);
      if (validationempty(response.orders_details_view)) {
        setTRLIST(response.orders_details_view[0]);
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const list2 = (services) => {
    return (
      <FlatList
        // horizontal
        showsHorizontalScrollIndicator={true}
        data={services}
        renderItem={({item, index}) => (
          <View style={{flexDirection: 'column'}}>
            <Text style={[Style.text12, {textAlign: 'center'}]}>
              {item.product_name}
            </Text>

            {validationempty(item.product_name_extra) ? (
              <Text
                style={[
                  Style.text10,
                  {color: Colors.blue, textAlign: 'center'},
                ]}>
                {item.product_name_extra}
              </Text>
            ) : null}
            <View
              style={{
                width: '80%',
                marginVertical: 2,
                textAlign: 'center',
                backgroundColor: Colors.lg_gray,
                height: 0.5,
              }}></View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <View
          style={{
            marginTop: Platform.OS == 'ios'?'15%':0,

            backgroundColor: Colors.white,
            margin: '5%',
            flex: 1,
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            paddingHorizontal: 10,
            paddingBottom: 10,
          }}>
          <TopBar
            left={Images.ic_close}
            style={{left: -39, top: -8, height: 20}}
            iconstyle={{height: 30, width: 30}}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <Loader loading={loding} />
          {validationempty(TRLIST) ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                width: '100%',
              }}>
              <View>
                <Image
                  source={Images.logo}
                  style={[Style.auth_img_style, {height: HEIGHT / 8.5}]}
                  resizeMode="contain"
                />

                <LText
                  style={[
                    Style.text14_bold,
                    {
                      fontSize: 20,
                      marginTop: 0,
                      textAlign: 'center',
                    },
                  ]}>
                  Orders Details
                </LText>

                <View style={{marginHorizontal: '5%', marginVertical: 10}}>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>Order ID</LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.order_id}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>Member Name</LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.member_name}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>Member ID</LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.member_id}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>
                      Order details & comment
                    </LText>

                    <View
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {validationempty(TRLIST.cart_extra_details)
                        ? list2(TRLIST.cart_extra_details)
                        : null}

                      <Text style={[Style.text10, {color: Colors.gray}]}>
                        {TRLIST?.member_comments}
                      </Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>Total Value</LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.finalcash}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>
                      Total Points
                    </LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.finalpoints}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>
                      Address details & comments
                    </LText>
                    {TRLIST?.storepick == 'true' ? (
                      <Text
                        style={[
                          Style.text12,
                          styles.con_brand,
                          styles.textstyle,
                        ]}>
                        Store pickup
                      </Text>
                    ) : (
                      <Text
                        style={[
                          Style.text12,
                          styles.con_brand,
                          styles.textstyle,
                        ]}>
                        {TRLIST?.delivery_address}
                        {'\n'}
                        {'\n'}
                        {TRLIST?.order_details}
                      </Text>
                    )}
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>
                      Payment Method
                    </LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.advance_payment == 'no' ? 'cash' : 'points'}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <LText style={[Style.text12, {flex: 2}]}>
                      Status Update
                    </LText>

                    <Text
                      style={[
                        Style.text12,
                        styles.con_brand,
                        styles.textstyle,
                      ]}>
                      {TRLIST?.status}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: RFValue(30),
    height: RFValue(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageThumbnail: {
    width: '100%',
    height: 100,
  },
  btn_style: {
    width: '100%',
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    marginTop: 10,
    paddingVertical: 6,
    borderColor: Colors.lg_gray,
    backgroundColor: Colors.white,
  },
  textstyle: {
    flex: 2.5,
    textAlignVertical: 'center',
    paddingHorizontal: 5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: WIDTH / 12, // as same as height
      },
      android: {},
    }),
  },
  img_main: {
    flex: 1,
    height: 32,
  },
  con_brand: {
    margin: 2,
    paddingVertical: 3,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
});

export default App;
