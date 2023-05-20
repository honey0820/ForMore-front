import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {validationempty} from '../Common/Validations';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation, route}) => {
  const {gallery_img} = route.params;
  const [loding, setLoding] = useState(false);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        <View
          style={{
            marginTop: '6%',
            marginHorizontal: '6%',
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
          }}>
          <Image
            source={
              validationempty(gallery_img)
                ? {uri: Urls.imageUrl + gallery_img}
                : Images.logo
            }
            style={{
              height: WIDTH,
              width: '100%',
              alignItems: 'center',
              borderRadius: 8,
            }}
            resizeMode="contain"
          />
          {/* </Card> */}
        </View>

        <View
          style={{
            zIndex: 1,
            bottom: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: '8%',
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
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -30,
    top: -30,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '5%',
  },
});

export default UserInfo;
