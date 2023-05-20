import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
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
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

const slides = [
  {
    key: 'one',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t1.gif'),
  },
  {
    key: 'two',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t2.gif'),
  },
  {
    key: 'three',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t3.gif'),
  },
  {
    key: '4',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t4.gif'),
  },
  {
    key: '5',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t5.gif'),
  },
  {
    key: '6',
    title: 'Welcome',
    text: 'Press Next to understand the main functionalities ',
    image: require('../../App/assets/images/t6.gif'),
  },
];

const AppIntro = ({navigation, route}) => {
  const {flag} = route.params;
  const [loding, setLoding] = useState(false);

  const _renderItem = ({item}) => {
    return (
      <View style={[Style.cointainer, {padding: '8%'}]}>
        <Card
          containerStyle={{
            marginBottom: '8%',
            height: '50%',
            borderWidth: 0.8,
            borderRadius: 12,
          }}>
          <FastImage
            source={item.image}
            style={{
              height: '100%',
              width: '100%',

              resizeMode: 'contain',
            }}
          />
        </Card>
        <Text
          style={{
            fontSize: 16,
            color: Colors.blue,
            fontFamily: CustomeFonts.ComfortaaBold,
          }}>
          {item.title}
        </Text>
        <Text style={Style.text12}>{item.text}</Text>
      </View>
    );
  };

  const _renderNextButton = () => {
    return <Text style={[Style.text14, {marginTop: 10}]}>{'Next'}</Text>;
  };
  const _renderDoneButton = () => {
    return <Text style={[Style.text14_bold, {marginTop: 10}]}>{'Done'}</Text>;
  };

  const _renderSkipButton = () => {
    return <Text style={[Style.text14, {marginTop: 10}]}>{'Skip'}</Text>;
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
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        {flag == '1' ? (
          <View
            style={{
              width: '100%',
              marginHorizontal: 10,
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <Icon
              name={'ios-arrow-back-outline'}
              type={'ionicon'}
              size={25}
              onPress={() => {
                navigation.goBack();
              }}
            />

            <Text
              style={[
                styles.text14_bold,
                {
                  fontSize: 18,
                  color: Colors.blue,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Tutorial
            </Text>
          </View>
        ) : null}
        <AppIntroSlider
          showSkipButton={true}
          dotStyle={{backgroundColor: Colors.black}}
          activeDotStyle={{backgroundColor: Colors.blue}}
          renderItem={_renderItem}
          data={slides}
          onDone={_onDone}
          renderDoneButton={_renderDoneButton}
          renderNextButton={_renderNextButton}
          renderSkipButton={_renderSkipButton}
        />
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

export default AppIntro;
