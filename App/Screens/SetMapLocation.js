import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  Dimensions,
  PermissionsAndroid,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Modal,
  Switch,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import Mybutton from '../Compoment/mybutton';
import LText from '../Compoment/LText';
import {showToast} from '../Common/CommonMethods';
import BarcodeScanner from 'react-native-scan-barcode';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {validationBlank, validationempty} from '../Common/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Icon} from 'react-native-elements';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

const App = ({navigation, route}) => {
  const {type, user_id, user_available_points, logo} = route.params;
  const [loding, setLoding] = useState(false);
  const [infotext, setinfotext] = useState('');
  const [address, setaddress] = useState('');
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const {width} = useWindowDimensions();
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [addphotovisible, setaddphotovisible] = useState(false);
  const [ish, setish] = useState(false);
  const toggleSwitchH = () => setish((previousState) => !previousState);

  useEffect(() => {
    setLoding(true);
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

        setlatitude(position.coords.latitude);
        setlongitude(position.coords.longitude);
        GetLocationName(position.coords.latitude, position.coords.longitude);

        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        setLoding(false);
      },
      (error) => {
        // See error code charts below.
        setLoding(false);
        console.log(error.code, error.message);
        showToast(error.message, 'error');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 6600000},
    );
  };

  const GetLocationName = async (latitude, longitude) => {
    Geocoder.init('AIzaSyB1yIYkNJYfBgaVQii6xPyRQPkxvvndMYc'); // use a valid API key

    Geocoder.from(latitude, longitude)
      .then((json) => {
        if (json.results[0]) {
          var add = json.results[0].formatted_address;
          setaddress(add);
          console.log('address found', add);
        } else {
          console.log('address not found');
        }
      })
      .catch((error) => console.warn(error));
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: Colors.TheamColor2,
            padding: 10,
          }}>
          <Icon
            name={'ios-arrow-back-outline'}
            type={'ionicon'}
            size={25}
            color={Colors.white}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <Text
            style={[
              styles.text14_bold,
              {
                fontSize: 18,
                color: Colors.white,
                flex: 1,
                marginTop: 0,
                textAlign: 'center',
              },
            ]}>
            Map
          </Text>
        </View>
        {loding ? (
          <Loader loading={loding} />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <View style={{flex: 1}}>
              <MapView
                showsMyLocationButton
                initialRegion={position}
                showsUserLocation={false}
                zoomControlEnabled={true}
                loadingEnabled
                onPress={(e) => {
                  console.log('--->', e.nativeEvent.coordinate);
                  setlatitude(e.nativeEvent.coordinate.latitude);
                  setlongitude(e.nativeEvent.coordinate.longitude);
                  GetLocationName(latitude, longitude);
                }}
                style={Style.cointainer}>
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  pinColor={Colors.TheamColor2}
                />
              </MapView>
            </View>
            <View>
              <ScrollView>
                <Mybutton
                  text="Find Location"
                  iconname={Images.ic_map_l}
                  onPress={() => {}}
                  textstyle={{
                    color: Colors.blue,
                    paddingLeft: 10,
                    fontSize: 14,
                  }}
                  tintColor={Colors.TheamColor2}
                  style={{
                    backgroundColor: Colors.white,
                    marginTop: 10,
                    borderWidth: 0.05,
                    width: '90%',
                  }}
                />
                <Mybutton
                  text="Enter Address"
                  iconname={Images.ic_address}
                  onPress={() => {
                    setaddphotovisible(true);
                  }}
                  iconstyle={{
                    width: 15,
                    height: 15,
                    marginRight: 10,
                  }}
                  textstyle={{
                    color: Colors.blue,
                    paddingLeft: 10,
                    fontSize: 14,
                  }}
                  tintColor={Colors.TheamColor2}
                  style={{
                    backgroundColor: Colors.white,
                    marginTop: 6,
                    borderWidth: 0.05,
                    width: '90%',
                  }}
                />

                <View style={styles.row_style}>
                  <View style={styles.rs_style}>
                    <LText
                      style={[
                        Style.text14_bold,
                        {
                          fontSize: 15,
                          flex: 1,
                          textAlign: 'left',
                          marginTop: 0,
                        },
                      ]}>
                      Store pickup
                    </LText>
                  </View>
                  <Switch
                    trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                    thumbColor={'white'}
                    onValueChange={toggleSwitchH}
                    value={ish}
                  />
                </View>

                <Text style={[Style.text14_bold, {paddingLeft: '6%'}]}>
                  More info
                </Text>

                <Card containerStyle={[styles.card_input_style]}>
                  <TextInput
                    value={infotext}
                    keyboardType="email-address"
                    placeholder="add text here"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => {
                      setinfotext(text);
                    }}
                    numberOfLines={3}
                    multiline={true}
                    underlineColor={'transparent'}
                    style={[Style.textInput, {marginHorizontal: 4}]}
                    placeholderTextColor={Colors.divider}
                    selectionColor={Colors.TheamColor2}
                  />
                </Card>

                <Mybutton
                  text="CHECK OUT"
                  onPress={() => {
                    if (ish) {
                      navigation.navigate('OrderCheckout', {
                        type: type,
                        user_id: user_id,
                        infotext: infotext,
                        address: address,
                        logo: logo,
                        storepick: ish,
                        user_available_points: user_available_points,
                      });
                    } else {
                      if (validationempty(address)) {
                        navigation.navigate('OrderCheckout', {
                          type: type,
                          user_id: user_id,
                          infotext: infotext,
                          address: address,
                          logo: logo,
                          storepick: ish,
                          user_available_points: user_available_points,
                        });
                      } else {
                        showToast('Add Address', 'error');
                      }
                    }
                  }}
                  textstyle={{fontSize: 14}}
                  style={{
                    paddingHorizontal: 6,
                    width: '40%',
                    marginVertical: 10,
                  }}
                />
              </ScrollView>
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
              <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
                <CustomStatusBar hidden={false} />
                <ImageBackground
                  source={Images.back_auth}
                  style={[
                    Style.auth_img_back_style,
                    {alignSelf: 'center', justifyContent: 'center'},
                  ]}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Loader loading={loding} />

                    <View
                      style={{
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
                          setaddphotovisible(!addphotovisible);
                        }}
                      />

                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                          <View style={{flexGrow: 1, marginHorizontal: 10}}>
                            <Image
                              source={Images.logo}
                              style={[
                                Style.auth_img_style,
                                {height: HEIGHT / 8, marginTop: 5},
                              ]}
                              resizeMode="contain"
                            />

                            <LText style={[Style.text14_bold]}>
                              Enter Address here
                            </LText>
                            <Card containerStyle={[styles.card_input_style]}>
                              <TextInput
                                value={address}
                                keyboardType="email-address"
                                placeholder="add text here"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(text) => {
                                  setaddress(text);
                                }}
                                numberOfLines={3}
                                multiline={true}
                                underlineColor={'transparent'}
                                style={[Style.textInput, {marginHorizontal: 4}]}
                                placeholderTextColor={Colors.divider}
                                selectionColor={Colors.TheamColor2}
                              />
                            </Card>

                            <Mybutton
                              text="Submit"
                              onPress={() => {
                                setaddphotovisible(!addphotovisible);
                              }}
                              style={{
                                marginTop: 25,
                                marginBottom: 10,
                                width: '50%',
                              }}
                            />
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </KeyboardAvoidingView>
                </ImageBackground>
              </SafeAreaView>
            </Modal>
          </KeyboardAvoidingView>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row_style: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs_style: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_input_style: {
    borderRadius: 8,
    borderWidth: 0.8,
    padding: 0,
    margin: 1,
    marginHorizontal: '5%',
    marginTop: 6,
  },
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

export default App;
