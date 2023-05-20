import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import { ScrollView } from 'react-native-gesture-handler';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Header from '../Compoment/Header';
import Home_header from '../Compoment/Home_header';
import Mybutton from '../Compoment/mybutton';
import TopBar from '../Compoment/myTopBar';
import { validationempty } from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import messaging from '@react-native-firebase/messaging';
import { showToast } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../Compoment/i18n';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-elements';
import { color } from 'react-native-reanimated';
import SugnUpModal from '../Compoment/SugnUpModal';

const Home = ({ navigation }) => {
  const [loding, setLoding] = useState(false);
  const [isvisible, setisvisible] = useState(false);
  const [popupvisible, setpopupvisible] = useState(false);
  const [remainsec, setremainsec] = useState(1);
  const [promoimglist, setpromoimglist] = useState([]);
  const { t, i18n } = useTranslation();
  const [active, setactive] = useState(1);
  const slider = useRef();
  const [signupickerVisible, setsignupickerVisible] = useState(false);


  const ApitPromoImage = async (token) => {
    setLoding(true);


    var residence_country_id = await AsyncStorage.getItem('residence_country_id');
    var response = await Helper.GET(Urls.promotional_image_masters_by_country + "?country_id=" + residence_country_id);

    setpromoimglist([]);
    if (response.status == 200) {
      setLoding(false);
      let ar = response.promotionalImageMasters;
      var votes = [];
      if (validationempty(ar)) {
        if (validationempty(ar[0].image_1)) {
          votes.push({
            image: ar[0].image_1,
            counter: ar[0].counter_1,
            popup_img: ar[0].popup_img,
          });
        }
        if (validationempty(ar[0].image_2)) {
          votes.push({
            image: ar[0].image_2,
            counter: ar[0].counter_2,
            popup_img: ar[0].popup_img,
          });
        }
        if (validationempty(ar[0].image_3)) {
          votes.push({
            image: ar[0].image_3,
            counter: ar[0].counter_3,
            popup_img: ar[0].popup_img,
          });
        }
        if (validationempty(ar[0].image_4)) {
          votes.push({
            image: ar[0].image_4,
            counter: ar[0].counter_4,
            popup_img: ar[0].popup_img,
          });
        }
        if (validationempty(ar[0].image_5)) {
          votes.push({
            image: ar[0].image_5,
            counter: ar[0].counter_5,
            popup_img: ar[0].popup_img,
          });
        }
      }
      setpromoimglist(votes);
      if (validationempty(votes)) {
        setisvisible(true);
        // Starttimer(votes[0].counter, votes, 1);
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const Starttimer = (counter, votes, active) => {
    var id = null;
    setremainsec(counter);
    id = setInterval(() => setremainsec((oldCount) => oldCount - 1), 1000);

    setTimeout(() => {
      console.log('==', active);
      console.log('===', votes.length);
      if (active == votes.length) {
        setisvisible(false);
        setpopupvisible(true);
      } else {
        clearInterval(id);
        slider.current.goToSlide(active, true);
        Starttimer(votes[active - 1].counter, votes, active + 1);
      }
    }, counter * 1000);
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={[
          Style.cointainer,
          {
            backgroundColor: Colors.white,
          },
        ]}>
        <FastImage
          source={{ uri: Urls.imageUrl + item.image }}
          resizeMode={'center'}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </View>
    );
  };

  const SetLang = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var lang_name = await AsyncStorage.getItem('lang_name');
    if (validationempty(lang_id)) {
      i18n
        .changeLanguage(lang_name)
        .then(() => {
          console.log(i18n.language);
        })
        .catch((err) => console.log(err));
    }
  };

  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      // showToast(fcmToken, 'info');
      Apitokensend(fcmToken);
    }
  };

  const Apitokensend = async (token) => {
    console.log('token==>', token);
    var formdata = new FormData();
    formdata.append('device_token', token + '');
    formdata.append('user_id', LocalData.Id + '');
    var response = await Helper.POST(Urls.RegisterToken, formdata);
  };

  const _renderNextButton = () => {
    return <Text style={[Style.text14, { paddingBottom: 20 }]}>{'Next'}</Text>;
  };

  const _renderSkipButton = () => {
    return (
      <Text
        style={[
          Style.text12,
          {
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginBottom: 40,
            backgroundColor: Colors.lightblack,
            borderRadius: 18,
            color: Colors.white,
          },
        ]}
        onPress={() => {
          slider.current.goToSlide(active, true);
          setactive(active + 1);
        }}>
        {'Skip'}
      </Text>
    );
  };

  const _renderDoneButton = () => {
    return (
      <Text
        style={[
          Style.text12,
          {
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginBottom: 40,
            backgroundColor: Colors.lightblack,
            borderRadius: 18,
            color: Colors.white,
          },
        ]}>
        {'Done'}
      </Text>
    );
  };

  const _onDone = () => {
    setisvisible(false);
    setpopupvisible(true);
  };

  useEffect(() => {
    if (LocalData.isfirsttime) {
      ApitPromoImage();
      LocalData.isfirsttime = false;
    }
    getToken();
    SetLang();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar></CustomStatusBar>
      <ImageBackground
        source={Images.back_auth}
        style={[Style.auth_img_back_style, { paddingBottom: 0 }]}>
        <TopBar
          left={Images.ic_settings}
          right={Images.ic_map}
          onPressLeft={() => {
            navigation.navigate('AccountSettings');
          }}
          onPressRight={() => {
            navigation.navigate('MapMarkers');
          }}
        />

        <Loader loading={loding} />

        <SugnUpModal
          isVisible={signupickerVisible}
          setIsVisible={setsignupickerVisible}
          navigation={navigation}

        />

        <View style={{ flexGrow: 1, paddingBottom: '6%' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={Style.container1}>
            <View>
              <Image
                source={Images.logo}
                style={[Style.auth_img_style, { height: HEIGHT / 7 }]}
                resizeMode="contain"
              />

              <Mybutton
                text="User ID"
                iconname={Images.ic_user_white}

                onPress={async () => {
                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('Userinfo');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}


                style={{ width: '70%', marginBottom: 40, marginTop: 10 }}
              />

              <Home_header
                left={Images.ic_reward}
                text={'My Rewards'}
                right={Images.ic_ar_right}
                onPress={async () => {

                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('MyRewardMain');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}

              />

              <Home_header
                left={Images.ic_user}
                text={'My Wallet'}
                right={Images.ic_ar_right}
                onPress={async () => {

                  var id = await AsyncStorage.getItem('id');
                  if (validationempty(id)) {
                    navigation.navigate('MyWallet');
                  }
                  else {
                    setsignupickerVisible(true);
                  }
                }}

              />

              <Home_header
                left={Images.ic_deals}
                text={'Deals'}
                right={Images.ic_ar_right}
                onPress={() => {
                  navigation.navigate('DealsList');
                }}
                onPressRight={() => {
                  navigation.navigate('DealsList');
                }}
              />

              <Home_header
                left={Images.ic_marketplace}
                text={'Marketplace'}
                right={Images.ic_ar_right}
                onPress={() => {
                  navigation.navigate('Marketplace');
                }}
                onPressRight={() => {
                  navigation.navigate('Marketplace');
                }}
              />
            </View>
          </ScrollView>

          <Mybutton
            text="Super Code"
            iconname={Images.ic_star}
            onPress={async () => {

              var id = await AsyncStorage.getItem('id');
              if (validationempty(id)) {
                navigation.navigate('SuperCode');
              }
              else {
                setsignupickerVisible(true);
              }
            }}


            style={{ width: '50%', marginVertical: 20 }}
          />
        </View>
        {isvisible ? (
          <SafeAreaView style={{
            backgroundColor: Colors.white,
            paddingBottom: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignSelf: 'center',
          }}>
            <View
              style={{
                backgroundColor: Colors.white,
                paddingBottom: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              {validationempty(promoimglist) ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                  }}>
                  <AppIntroSlider
                    scrollEnabled={false}
                    showSkipButton={false}
                    showNextButton={false}
                    showDoneButton={false}
                    dotStyle={{ backgroundColor: Colors.white }}
                    activeDotStyle={{ backgroundColor: Colors.white }}
                    renderItem={_renderItem}
                    data={promoimglist}
                    onDone={_onDone}
                    renderDoneButton={_renderDoneButton}
                    renderNextButton={_renderNextButton}
                    renderSkipButton={_renderSkipButton}
                    ref={(ref) => (slider.current = ref)} // the ref
                  />

                  <Pressable
                    style={{
                      zIndex: 1,
                      top: 0,
                      right: 0,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginRight: '2%',
                      marginTop: '8%',
                      position: 'absolute',
                    }}
                    onPress={() => {
                      if (active == promoimglist.length) {
                        setisvisible(false);
                        setpopupvisible(true);
                      } else {
                        slider.current.goToSlide(active, true);
                        setactive(active + 1);
                      }
                    }}>
                    <Image
                      source={Images.ic_close}
                      style={{ tintColor: Colors.blue, height: 30, width: 30 }}
                      resizeMode="contain"
                    />
                  </Pressable>

                </View>
              ) : null}
            </View>
          </SafeAreaView>
        ) : null}
        {popupvisible ? (
          <SafeAreaView style={[
            Style.auth_img_back_style,
            { backgroundColor: Colors.white, paddingBottom: 0 },
          ]}>
            <View
              style={[
                Style.auth_img_back_style,
                { backgroundColor: Colors.white, paddingBottom: 0 },
              ]}>
              {validationempty(promoimglist) ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{ uri: Urls.imageUrl + promoimglist[0].popup_img }}
                    style={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'center',
                    }}
                    resizeMode="contain"
                  />

                  <Pressable
                    onPress={() => {
                      setpopupvisible(false);
                    }}
                    style={{
                      zIndex: 1,
                      top: 0,
                      right: 0,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginRight: '2%',
                      marginTop: '8%',
                      position: 'absolute',
                    }}>
                    <Image
                      source={Images.ic_close}
                      style={{ tintColor: Colors.blue, height: 30, width: 30 }}
                      resizeMode="contain"
                    />
                  </Pressable>

                </View>
              ) : null}
            </View>
          </SafeAreaView>
        ) : null}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    width: '100%',
    color: Colors.gray,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
});

export default Home;
