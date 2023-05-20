import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  Linking,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
// import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Card } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { validationempty } from '../Common/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';

let slides = [];
const AppIntro = ({ navigation, route }) => {
  const { flag } = route.params;
  const [loding, setLoding] = useState(false);
  const [opacity, setopacity] = useState(0);
  const [active, setactive] = useState(1);
  const slider = useRef();

  useEffect(() => {
    slides = [];
    apiCall();
  }, []);

  const onLoadStart = () => {
    setopacity(1);
  };

  const onLoad = () => {
    setopacity(0);
  };

  const onBuffer = ({ isBuffering }) => {
    setopacity(isBuffering ? 1 : 0);
  };

  const apiCall = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('language_id', lang_id + '');
    var response = await Helper.POST(
      Urls.tutorial_master_language_wise,
      formdata,
    );
    console.log('===>', response);
    if (response.success == 'true') {
      let array = response.tutorialMasters;
      if (array.length > 0) {
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          slides.push({
            key: element.id,
            title: element.title,
            text: element.details,
            image: element.tutorial_video,
            youtube_url: element.youtube_url,
          });
        }

        if (slides.length > 0) {
          setLoding(false);
          console.log('===>', slides);
        }
      } else {
        setLoding(false);
      }
    } else {
      setLoding(false);
    }
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={[{ flex: 1, paddingBottom: '18%' }]}>

        <View style={{ flex: 1, margin: 10 }}>
          <FastImage
            source={{ uri: Urls.imageUrl + item.image }}
            resizeMode='contain'
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </View>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.blue,
              fontFamily: CustomeFonts.ComfortaaBold,
            }}>
            {item.title}
          </Text>

          {validationempty(item.youtube_url) ? (
            <Text
              style={[Style.text12, { color: Colors.blue, marginTop: 6 }]}
              onPress={() => {
                Linking.openURL(item.youtube_url);
              }}>
              {item.youtube_url}
            </Text>
          ) : null}

          {validationempty(item.text) ? (
            <Text
              style={{
                fontSize: 13,
                fontFamily: CustomeFonts.ComfortaaBold,
              }}>
              {item.text}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  const _renderNextButton = () => {
    return <Text style={[Style.text14, { marginTop: 20 }]}>{'Next'}</Text>;
  };
  const _renderDoneButton = () => {
    return <Text style={[Style.text14_bold, { marginTop: 20 }]}>{'Done'}</Text>;
  };

  const _renderSkipButton = () => {
    return (
      <Text></Text>
      // <Text
      //   style={[Style.text14, {marginTop: 20}]}
      //   onPress={() => {
      //     console.log('skip');
      //     slider.current.goToSlide(active, true);
      //     setactive(active + 1);
      //   }}>
      //   {'Skip'}
      // </Text>
    );
  };

  const _onDone = () => {
    if (flag == '1') {
      navigation.goBack();
    } else {
      navigation.popToTop();
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        <AppIntroSlider
          showSkipButton={true}
          dotStyle={{ backgroundColor: Colors.black }}
          activeDotStyle={{ backgroundColor: Colors.blue }}
          renderItem={_renderItem}
          data={slides}
          onDone={_onDone}
          renderDoneButton={_renderDoneButton}
          renderNextButton={_renderNextButton}
          renderSkipButton={_renderSkipButton}
          ref={(ref) => (slider.current = ref)} // the ref
        />
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
