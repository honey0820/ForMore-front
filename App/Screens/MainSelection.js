import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, Modal, Linking, View, Image, Text, ImageBackground } from 'react-native';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView, TouchableOpacity } from 'react-native';
import Button from '../Compoment/Button';
import { validatePassword, validationBlank } from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Helper } from '../Common/Helper';
import { showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LText from '../Compoment/LText';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../Compoment/i18n';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import Loader from '../Compoment/Loader';
import { validationempty } from '../Common/Validations';
import LanguageModal from '../Compoment/LanguageModal';
import { Icon } from 'react-native-elements';
import Row from '../Compoment/Row';
import CountryListView from '../Compoment/CountryListView';
import { CheckBox } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

const MainSelection = ({ navigation }) => {
  const [selectedlangimg, setselectedlangimg] = useState('');
  const [selectedlang, setselectedlang] = useState('');
  const [selectedlangid, setselectedlangid] = useState('');
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const [languagearray, setlanguagearray] = useState([]);

  const [visibleModalCountry, setVisibleModalCountry] = useState(false);
  const [country, setcountry] = useState('');
  const [countryname, setcountryname] = useState('');
  const [countryicon, setcountryicon] = useState('');
  const [countryarray, setcountryarray] = useState([]);

  const [loding, setLoding] = useState(false);
  const [isvisible, setisvisible] = useState(false);
  const [popupvisible, setpopupvisible] = useState(false);
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [remainsec, setremainsec] = useState(1);
  const [promoimglist, setpromoimglist] = useState([]);
  const slider = useRef();
  const [active, setactive] = useState(1);

  const ApitPromoImage = async (token) => {
    setLoding(true);
    var formdata = new FormData();
    var response = await Helper.GET(Urls.promotional_image_masters, formdata);

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


  const { t, i18n } = useTranslation();
  const [check, setcheck] = useState(selectedlangid);

  const changeLanguage = async (value) => {
    i18n
      .changeLanguage(value)
      .then(() => {
        console.log(i18n.language);
      })
      .catch((err) => console.log(err));
    await AsyncStorage.setItem('lang_id', selectedlangid + '');
    await AsyncStorage.setItem('lang_name', value + '');
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

  const apiCall = async () => {
    setLoding(true);
    var response = await Helper.GET(Urls.languages);
    console.log("", response)
    setLoding(false);
    if (response.status == 200) {
      let array = response.languages;
      setlanguagearray(array);
    }

    apiCallCountry();
  };

  const apiCallCountry = async (flag) => {
    setLoding(true);
    var response = await Helper.GET(Urls.countries);
    console.log('countriesaa==>', response.countries);
    setLoding(false);
    var dataaraay = response.countries;
    if (validationempty(dataaraay)) {
      setcountryarray(dataaraay);
    }
  };

  const GuestCheck = async () => {
    // var lang_id = await AsyncStorage.getItem('lang_id');
    if (validationempty(selectedlangid)) {
      if (validationempty(country)) {
        AsyncStorage.setItem('lang_id', selectedlangid + "");
        AsyncStorage.setItem('residence_country_id', country + "");

        Alert.alert('Formore', 'By continuing as a guest, you will not have full access to for_more benefits. Please Sign Up to gain full access.        ', [
          {
            text: 'Skip',
            onPress: async () => {
              setaddphotovisible(false);
              await AsyncStorage.setItem('is_guest', "1");
              navigation.replace('Splash')
            },
          },
          {
            text: 'Next', onPress: () => {
              setaddphotovisible(false);
              navigation.navigate('Register')
            }
          },
        ]);
      }
      else {
        showToast("select Country", 'error');
      }
    }
    else {
      showToast("select Language", 'error');
    }

  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        <View style={Style.cointainer}>
          <View
            style={[
              {
                height: '50%',
                justifyContent: 'flex-end',
                alignItems: 'center',
              },
            ]}>
            <Image
              source={Images.logo}
              style={Style.auth_img_style}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              width: '70%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Button
              title="Log In"
              onPress={() => {
                navigation.push('Login');
              }}
              style={{ width: '75%' }}
              textstyle={{ fontSize: 20 }}
            />

            <Button
              title="Sign Up"
              onPress={() => {
                navigation.push('Register');
              }}
              style={{ width: '75%', marginTop: 10 }}
              textstyle={{ fontSize: 20 }}
            />
          </View>

          <View style={{
            position: 'absolute', justifyContent: 'center',
            alignSelf: 'center',
            bottom: 35, width: '100%'
          }}>
            <Button
              title="Visit as guest"
              onPress={() => {
                setaddphotovisible(true)
                apiCall();
              }}
              style={{
                width: 130
              }}
              textstyle={{ fontSize: 16, }}
            />
          </View>

          {/* <Text
            onPress={() => {
              setaddphotovisible(true)
              apiCall();
            }}
            style={[
              Style.text14_bold,
              {
                color: Colors.black,
                fontSize: 16,
                position: 'absolute',
                bottom: 35,
                fontFamily: CustomeFonts.ComfortaaBold,
                marginBottom: 10,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}>
            Visit as guest
          </Text> */}

          <Text
            onPress={() => {
              Linking.openURL('http://www.for-more.eu/');
            }}
            style={[
              Style.text14,
              {
                color: Colors.black,
                position: 'absolute',
                bottom: 0,
                fontFamily: CustomeFonts.ComfortaaBold,
                marginBottom: 10,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}>
            www.for-more.eu
          </Text>
        </View>

        {isvisible ? (
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
                <View
                  style={{
                    zIndex: 1,
                    top: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginRight: '2%',
                    marginTop: '2%',
                    position: 'absolute',
                  }}>
                  <TouchableOpacity
                    onPressIn={() => {
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
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
        {popupvisible ? (
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

                <View
                  style={{
                    zIndex: 1,
                    top: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginRight: '2%',
                    marginTop: '2%',
                    position: 'absolute',
                  }}>
                  <TouchableOpacity
                    onPressIn={() => {
                      setpopupvisible(false);
                    }}>
                    <Image
                      source={Images.ic_close}
                      style={{ tintColor: Colors.blue, height: 30, width: 30 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* <LanguageModal
          isVisible={isLanguagePickerVisible}
          setIsVisible={setIsLanguagePickerVisible}
          selectedlang={selectedlang}
          selectedlangid={selectedlangid}
          setselectedlangimg={setselectedlangimg}
          setselectedlang={setselectedlang}
          setselectedlangid={setselectedlangid}
          data={languagearray}
        /> */}

        <Modal
          // animated
          animationType="slide"
          swipeDirection={['down']}
          visible={addphotovisible}
          onRequestClose={() => {
            setaddphotovisible(!addphotovisible);
          }}
          onBackdropPress={() => {
            setaddphotovisible(!addphotovisible);
          }}
          transparent>
          <SafeAreaView style={styles.overlay}>
            <View
              style={[
                {
                  margin: 20,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  elevation: 2,
                  padding: 15, justifyContent: 'center'
                },
              ]}>
              <ScrollView contentContainerStyle={{ paddingTop: 10 }}>


                <LText style={[Style.text14_bold]}>Language</LText>
                <TouchableOpacity
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      height: 45,
                      borderBottomWidth: 1,
                      borderColor: Colors.lg_gray,
                    },
                  ]}
                  onPress={() => {
                    setaddphotovisible(false);
                    setIsLanguagePickerVisible(true);
                  }}>
                  <Text style={[Style.text14, { marginLeft: 1, flex: 1 }]}>
                    {selectedlang}
                  </Text>

                  <Image
                    style={{
                      marginLeft: 10,
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                    }}
                    source={{ uri: Urls.imageUrl + selectedlangimg }}
                  />
                </TouchableOpacity>

                <LText style={[Style.text14_bold, { marginTop: 20 }]}>Residence Country</LText>

                <TouchableOpacity
                  style={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: Colors.lg_gray,
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    setaddphotovisible(false);
                    setVisibleModalCountry(true);
                  }}>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={{ uri: Urls.imageUrl + countryicon }}
                  />

                  <TextInput
                    style={[
                      Style.textInput,
                      {
                        marginTop: 0,
                        flex: 1,
                        paddingLeft: 10,
                      },
                    ]}
                    underlineColor="transparent"
                    editable={false}
                    placeholderTextColor={Colors.gray}
                    value={countryname}
                    selectionColor={Colors.TheamColor2}
                  />

                  <Icon
                    name="md-caret-down-outline"
                    type={'ionicon'}
                    size={13}
                    style={{ marginRight: 6 }}
                    color={Colors.gray}
                  />
                </TouchableOpacity>

                <Button
                  title="Submit"
                  onPress={() => {
                    GuestCheck();
                  }}
                  textstyle={{ fontSize: 20 }}
                />




              </ScrollView>

              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginVertical: '8%',
                }}>
                <TouchableOpacity
                  onPressIn={() => {
                    setaddphotovisible(!addphotovisible);
                  }}>
                  <Image
                    source={Images.ic_close}
                    style={{
                      tintColor: Colors.blue,
                      height: 30,
                      width: 30,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        <Modal
          // animated
          animationType="slide"
          swipeDirection={['down']}
          visible={isLanguagePickerVisible}
          onRequestClose={() => {
            setIsLanguagePickerVisible(!isLanguagePickerVisible);
            setaddphotovisible(true);
          }}
          transparent>
          <SafeAreaView style={styles.overlay}>




            <View
              style={[
                {
                  height: '100%',
                  backgroundColor: 'white',
                  elevation: 2,
                  paddingTop: 10
                },
              ]}>

              <Row style={{ paddingRight: 10, flex: 0, marginVertical: 20, }}>
                <Text
                  style={[
                    Style.text14_bold,
                    { textAlign: 'center', flex: 1 },
                  ]}>
                  Choose Language
                </Text>

                <Icon
                  name="close-outline"
                  type={'ionicon'}
                  size={25}
                  color={'#AEB2BF'}
                  onPress={() => {
                    setIsLanguagePickerVisible(!isLanguagePickerVisible);
                    setaddphotovisible(true);
                  }}
                />
              </Row>

              {languagearray.map((item, index) => {
                return (
                  <TouchableOpacity key={index}>
                    <View style={styles.main_V_style}>
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: Urls.imageUrl + item.icon_img }}
                      />
                      <Text style={styles.TextStyle1}>{item.language_name}</Text>
                      <CheckBox
                        checked={selectedlangid == item.id ? true : false}
                        onPress={() => {
                          changeLanguage(item.language_name);
                          setcheck(item.id);
                          setselectedlang(item.language_name);
                          setselectedlangid(item.id);
                          setselectedlangimg(item.icon_img);
                        }}
                        iconType="font-awesome"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        containerStyle={{
                          paddingTop: 0,
                          paddingBottom: 0,
                          paddingLeft: 0,
                          paddingRight: 0,
                          marginRight: 0,
                          borderWidth: 0,
                          backgroundColor: 'transparent',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </Modal>


        <Modal
          animationType="slide"
          swipeDirection={['down']}
          visible={visibleModalCountry}
          onRequestClose={() => {
            setVisibleModalCountry(false);
            setaddphotovisible(true);
          }}
          onBackdropPress={() => {
            setVisibleModalCountry(false);
            setaddphotovisible(true);
          }}
          transparent>
          <SafeAreaView style={styles.overlay}>
            <View
              style={[
                {
                  height: '100%',
                  backgroundColor: 'white',
                  elevation: 2,
                },
              ]}>
              <Row style={{ paddingRight: 10, flex: 0, marginTop: 20, }}>
                <Text
                  style={[
                    Style.text14_bold,
                    { textAlign: 'center', flex: 1 },
                  ]}>
                  Select Country
                </Text>

                <Icon
                  name="close-outline"
                  type={'ionicon'}
                  size={25}
                  color={'#AEB2BF'}
                  onPress={() => {
                    setVisibleModalCountry(false);
                    setaddphotovisible(true);
                  }}
                />
              </Row>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={countryarray}
                style={{ paddingBottom: '5%' }}
                renderItem={({ item, index }) => (
                  <CountryListView
                    item={item}
                    index={index}
                    navigation={navigation}
                    onPress={() => {
                      setcountry(item.id + '');
                      setcountryname(item.country_name + '');
                      setcountryicon(item.country_icon);
                      setVisibleModalCountry(false);
                      setaddphotovisible(true);


                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </SafeAreaView>
        </Modal>

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  TextStyle1: {
    fontFamily: CustomeFonts.Poppins_Regular,
    fontSize: 14,
    lineHeight: 16,
    color: '#0E1339',
    alignSelf: 'center',
    left: 10,
    flex: 1,
  },
  main_V_style: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  overlay: {
    backgroundColor: 'rgba(22, 27, 70, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  img_banner: {
    height: HEIGHT / 6,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
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
    height: HEIGHT / 6,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    // borderColor: Colors.lg_gray,
    // borderWidth: 0.2,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '8%',
  },
  card_input_style: {
    borderRadius: 55, justifyContent: 'center', alignItems: 'center',
    height: 56,
    borderWidth: 0.8,
    padding: 0,
    margin: 1,
    marginTop: 10,
  }
});

export default MainSelection;
