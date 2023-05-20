import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  Linking,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Card} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const AppIntro = ({navigation, route}) => {
  const {gallery, index, flag} = route.params;
  const [loding, setLoding] = useState(false);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
          }}>
          <Swiper index={index} showsButtons={true}>
            {gallery.map((movies) => {
              return (
                <View key={movies.id} style={styles.c}>
                  <Image
                    style={{height: '100%', width: '100%'}}
                    resizeMode={'contain'}
                    source={{
                      uri:
                        Urls.imageUrl +
                        (flag === '2'
                          ? movies.offer_image
                          : movies.gallery_img),
                    }}
                  />
                </View>
              );
            })}
          </Swiper>
        </View>
        <View
          style={{
            zIndex: 1,
            bottom: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: '15%',
            position: 'absolute',
          }}>
          <TouchableOpacity
            onPressIn={() => {
              navigation.goBack();
            }}>
            <Image
              source={Images.ic_close}
              style={{tintColor: Colors.blue, height: 30, width: 30}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: HEIGHT / 7,
    left: 70,
    right: 70,
    height: 50,
  },
  backgroundVideo: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
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

export default AppIntro;
