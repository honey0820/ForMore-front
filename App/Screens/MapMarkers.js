import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import {
  PermissionsAndroid,
  Text,
  Image,
  Modal,
  ScrollView,
  Linking,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { Marker } from 'react-native-maps';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Loader from '../Compoment/Loader';
import { validationempty } from '../Common/Validations';
import { LocalData, Urls } from '../Common/Urls';
import { Indicator, logout, NoData, showToast } from '../Common/CommonMethods';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Mybutton from '../Compoment/mybutton';
import LText from '../Compoment/LText';
import CustomeFonts from '../Theme/CustomeFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Row from '../Compoment/Row';
import { Icon } from 'react-native-elements';
import CountryListView from '../Compoment/CountryListView';
import TopBar from '../Compoment/myTopBar';

var latitude = '0';
var longitude = '0';
var currentcntry = '';
var logincntry = '';

const MapMarker = ({ params, navigation }) => {
  const [markers, setMarkers] = useState([]);
  const [loding, setLoding] = useState(false);
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [selectedpin, setselectedpin] = useState([]);
  const [catid, setcatid] = useState('');
  const [catlist, setcatlist] = useState([]);
  const [businesslist, setbusinesslist] = useState([]);
  const [country, setcountry] = useState();
  const [countryarray, setcountryarray] = useState([]);
  const [visibleModalCountry, setVisibleModalCountry] = useState(false);
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    // setLoding(true);

    if (Platform.OS == 'android') {
      Checkpermission();
    } else {
      GetLocation();
    }
  }, []);

  const Checkpermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message:
            'needs access to your current location so you can share or search for business',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the geolocation');
        GetLocation();
      } else {
        console.log('Geolocation permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const GetLocation = async () => {
    setLoding(true);

    Geolocation.getCurrentPosition(
      (position) => {
        console.log('===>', position.coords);
        latitude = position.coords.latitude + '';
        longitude = position.coords.longitude + '';
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        // GetLocationName(latitude, longitude);
        setLoding(false);
        apiCallcategories();
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        showToast(error.message, 'error');
        apiCallcategories();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 3600000 },
    );
  };

  const GetLocationName = async (latitude, longitude) => {
    logincntry = await AsyncStorage.getItem('country_name');
    Geocoder.init('AIzaSyB1yIYkNJYfBgaVQii6xPyRQPkxvvndMYc'); // use a valid API key

    Geocoder.from(latitude, longitude)
      .then((json) => {
        if (json.results[0]) {
          var add = json.results[0].formatted_address;
          var value = add.split(',');

          var count = value.length;
          currentcntry = value[count - 1];

          if (
            currentcntry.toLocaleLowerCase().trim() ===
            logincntry.toLocaleLowerCase().trim()
          ) {
          } else {
            ChangeCountry();
          }
        } else {
          console.log('address not found');
        }
      })
      .catch((error) => console.warn(error));
  };
  const ChangeCountry = async () => {
    Alert.alert('Formore', 'Do you want to change your current country?', [
      {
        text: 'No',
        onPress: () => {
          navigation.goBack();
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          apiCallCountry();
        },
      },
    ]);
  };
  const apiCallCountry = async () => {
    setLoding(true);
    var response = await Helper.GET(Urls.countries);
    console.log('countriesaa==>', response.countries);
    setLoding(false);
    // if (response.success == true) {
    var dataaraay = response.countries;
    if (validationempty(dataaraay)) {
      setcountryarray(dataaraay);

      if (validationempty(country)) {
        for (let index = 0; index < dataaraay.length; index++) {
          const element = dataaraay[index];
          if (element.id == country) {
            setcountry(element.id);
          }
        }
      }
      setVisibleModalCountry(true);
    }
    // }
  };

  const UpdateCountry = async (countryid, country_name) => {
    var logincn = await AsyncStorage.getItem('country_name');
    setLoding(true);
    var formdata = new FormData();
    formdata.append('user_id', LocalData.Id + '');
    formdata.append('residence_country_id', countryid);
    var response = await Helper.POST(Urls.profile_country_upadte, formdata);
    console.log('profile_country_upadte response', response);
    setLoding(false);
    if (response.status == 200) {
      await AsyncStorage.setItem('residence_country_id', countryid + '');
      await AsyncStorage.setItem('country_name', country_name + '');

      apiCallcategories();
    } else {
      showToast(response.Message, 'error');
    }
  };

  const apiCallcategories = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('lang_id', lang_id);
    var response = await Helper.POST(Urls.categories, formdata);

    if (response.status == 200) {
      // var ss = response.categories.splice(1);
      var ss = response.categories;
      setcatlist(ss);
      if (validationempty(ss)) {
        setcatid(ss[0].id + '');
        apiCallBusinesslist(ss[0].id + '');
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const apiCallBusinesslist = async (catid) => {
    var selcountry = await AsyncStorage.getItem('residence_country_id');
    setLoding(true);
    setbusinesslist([]);
    setMarkers([]);
    setselectedpin([]);

    var formdata = new FormData();
    formdata.append('cat_id', catid);
    formdata.append('country_id', selcountry);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    console.log('formdata===>', formdata);
    var response = await Helper.POST(Urls.business_map_wise, formdata);
    if (response.status == 200) {
      setLoding(false);
      setbusinesslist(response.brands);
      validationempty(response.brands);
      {
        var votes = [];
        for (let index = 0; index < response.brands.length; index++) {
          const element = response.brands[index];
          votes.push({
            latitude: validationempty(element.latitude)
              ? parseFloat(element.latitude)
              : 0,
            longitude: validationempty(element.longitude)
              ? parseFloat(element.longitude)
              : 0,
            title: element.name,
            position: index + '',
          });
        }
        setMarkers(votes);
        // showToast('Total Available Business : ' + votes.length, 'info');
      }
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const onMarkerPress = async (location) => {
    console.log('sel location : ', location.position);
    setselectedpin(businesslist[location.position]);
    console.log('sel location ==: ', businesslist[location.position]);
    setaddphotovisible(true);
  };

  return (
    <SafeAreaView style={Style.cointainer}>
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <View
          style={{
            // position: 'absolute',
            // top: 0,
            marginHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignSelf: 'center' }}
            onPress={() => {
              navigation.popToTop();
              navigation.replace('Home');
            }}>
            <Image
              style={{
                height: 20,
                width: 20,
              }}
              source={Images.ic_home}
            />
          </TouchableOpacity>

          <FlatList
            horizontal
            style={{ marginLeft: 15 }}
            showsHorizontalScrollIndicator={false}
            data={catlist}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setcatid(item.id);
                  apiCallBusinesslist(item.id + '');
                }}
                style={[
                  styles.image,
                  {
                    justifyContent: 'center',
                    marginHorizontal: 5,
                    borderWidth: 2,
                  },
                  catid == item.id
                    ? { borderColor: Colors.TheamColor2 }
                    : { borderColor: Colors.blue },
                ]}>
                <Image
                  source={
                    validationempty(item.icon)
                      ? { uri: Urls.imageUrl + item.icon }
                      : Images.applogo1
                  }
                  style={[
                    {
                      alignSelf: 'center',
                      width: 46,
                      height: 46,
                      borderRadius: 8,
                      // borderRadius: 46 / 2,
                    },
                  ]}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {loding ? (
          <Loader loading={loding} />
        ) : (
          <View style={Style.cointainer}>
            <Loader loading={loding} />

            <MapView
              showsMyLocationButton
              initialRegion={position}
              showsUserLocation={true}
              zoomControlEnabled={true}
              loadingEnabled //to show loading while map loading
              style={Style.cointainer}>
              {markers &&
                markers.map((marker, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    pinColor={Colors.TheamColor2}
                    onPress={() => {
                      onMarkerPress(marker);
                    }}
                  />
                ))}
            </MapView>

            <View
              style={{
                // position: 'absolute',
                // bottom: 0,
                padding: 10,
                flexDirection: 'row',
              }}>
              <Mybutton
                text="Business Catalog"
                onPress={() => {
                  navigation.navigate('MapListing', {
                    businesslist: [],
                    latitude: latitude,
                    longitude: longitude,
                    flag: '1',
                  });
                }}
                style={[
                  styles.buttonStyle1,
                  {
                    marginRight: 5,
                  },
                ]}
              />
              {/* <Mybutton
                // iconname={Images.list}
                text="By Category"
                onPress={() => {
                  navigation.navigate('MapListing', {
                    businesslist: [],
                    latitude: latitude,
                    longitude: longitude,
                    flag: '1',
                  });

                  // navigation.navigate('MenuListing', {
                  //   latitude: latitude,
                  //   longitude: longitude,
                  // });
                }}
                style={[
                  styles.buttonStyle1,
                  {
                    marginLeft: 5,
                  },
                ]}
              /> */}
            </View>

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
              <View style={{ marginTop: 100 }}>
                <View style={styles.v_sty_close}>
                  <TouchableOpacity
                    onPressIn={() => {
                      setaddphotovisible(!addphotovisible);
                    }}>
                    <Image
                      source={Images.ic_close}
                      style={styles.img_back_style}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    backgroundColor: Colors.white,
                    borderRadius: 18,
                    paddingTop: 15,
                    marginHorizontal: 20,
                  }}>
                  <View>
                    <View
                      style={{
                        marginHorizontal: 10,
                        marginBottom: 10,
                      }}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setaddphotovisible(!addphotovisible);
                            navigation.navigate('BusinessInfo', {
                              user_id: selectedpin.user_id,
                              latitude: latitude,
                              longitude: longitude,
                            });
                          }}>
                          <Image
                            source={
                              validationempty(selectedpin?.header_banner)
                                ? {
                                  uri:
                                    Urls.imageUrl +
                                    selectedpin?.header_banner,
                                }
                                : Images.logo
                            }
                            style={styles.img_banner}
                            resizeMode="stretch"
                          />
                        </TouchableOpacity>

                        <LText
                          style={[
                            Style.text12,
                            {
                              marginRight: 25,
                              marginBottom: 8,
                              paddingHorizontal: 4,
                              position: 'absolute',
                              right: 0,
                              bottom: 0,
                              backgroundColor: Colors.white,
                              borderRadius: 5,
                            },
                          ]}>
                          {validationempty(selectedpin) ?
                            ((selectedpin?.distance).toFixed(2))+" Km" : ""}
                         
                        </LText>

                        <View
                          style={[
                            styles.con_brand,
                            { marginLeft: '10%', position: 'absolute', left: 0 },
                          ]}>
                          <Image
                            style={styles.imageThumbnail}
                            source={
                              validationempty(selectedpin?.brand_icon)
                                ? {
                                  uri:
                                    Urls.imageUrl + selectedpin?.brand_icon,
                                }
                                : Images.ic_placeholder
                            }
                            resizeMode={'contain'}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 10,
                          marginTop: 10,
                        }}>
                        <LText
                          style={[
                            Style.text12,
                            {
                              color: Colors.blue,
                              flex: 1,
                              fontFamily: CustomeFonts.ComfortaaBold,
                            },
                          ]}>
                          {selectedpin?.name}
                        </LText>
                        <Mybutton
                          onPress={() => {


                            const latitude = selectedpin?.latitude;
                            const longitude = selectedpin?.longitude;
                            const daddr = `${latitude},${longitude}`;
                            const company = Platform.OS === "ios" ? "apple" : "google";
                            Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);

                            // const url = Platform.select({
                            //   ios: `comgooglemaps://?center=${latitude},${longitude}&q=${latitude},${longitude}&zoom=14&views=traffic"`,
                            //   android: `geo://?q=${latitude},${longitude}`,
                            // });

                            // Linking.canOpenURL(url)
                            //   .then((supported) => {
                            //     if (supported) {
                            //       return Linking.openURL(url);
                            //     } else {
                            //       const browser_url = `https://www.google.de/maps/@${latitude},${longitude}`;
                            //       return Linking.openURL(browser_url);
                            //     }
                            //   })
                            //   .catch(() => {
                            //     if (Platform.OS === 'ios') {
                            //       Linking.openURL(
                            //         `maps://?q=${latitude},${longitude}`,
                            //       );
                            //     }
                            //   });
                          }}
                          text="Directions"
                          style={{
                            backgroundColor: Colors.blue,
                            paddingHorizontal: 4,
                            paddingVertical: 4,
                          }}
                          textstyle={{ fontSize: 10 }}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              swipeDirection={['down']}
              visible={visibleModalCountry}
              onRequestClose={() => {
                setVisibleModalCountry(false);
                navigation.goBack();
              }}
              onBackdropPress={() => {
                setVisibleModalCountry(false);
                navigation.goBack();
              }}
              transparent>
              <View
                style={{
                  backgroundColor: 'rgba(22, 27, 70, 0.5)',
                  height: '100%',
                  padding: '5%',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    padding: '2%',
                    height: '100%',
                  }}>
                  <Row style={{ padding: 10, flex: 0 }}>
                    <Text
                      style={[
                        Style.text14_bold,
                        { marginTop: 0, textAlign: 'center', flex: 1 },
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
                        navigation.goBack();
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
                          if (
                            currentcntry.toLocaleLowerCase().trim() ===
                            item.country_name.toLocaleLowerCase().trim()
                          ) {
                            setVisibleModalCountry(false);
                            UpdateCountry(item.id, item.country_name);
                          } else {
                            Alert.alert(
                              'Formore',
                              'Your selected country does not match your current location',
                              [
                                {
                                  text: 'Select Country',
                                  onPress: () => { },
                                },
                              ],
                            );
                          }
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: 6,
    top: -12,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
  con_brand: {
    paddingHorizontal: 10,
    width: HEIGHT / 11.5,
    height: HEIGHT / 9,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  overlay: {
    backgroundColor: 'rgba(22, 27, 70, 0.5)',
    height: HEIGHT,
    justifyContent: 'flex-end',
  },
  img_banner: {
    height: HEIGHT / 4.6,
    width: '100%',
    marginTop: '6%',
    borderRadius: 10,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    // borderRadius: 50 / 2,
  },
  buttonStyle1: {
    flex: 1,
    margin: 0,
    backgroundColor: Colors.TheamColor2,
  },
  imageThumbnail: {
    width: HEIGHT / 11.5,
    height: HEIGHT / 9,
  },
});

export default MapMarker;
