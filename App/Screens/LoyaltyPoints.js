import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  ImageBackground,
  View,
  Image,
  Alert,
  Text,
  BackHandler,
} from 'react-native';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import { LocalData, Urls } from '../Common/Urls';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomeFonts from '../Theme/CustomeFonts';
import { validationempty, validationempty1 } from '../Common/Validations';
import TopBar from '../Compoment/myTopBar';

const App = ({ navigation, route }) => {
  const { itemdata, totalpoint } = route.params;
  const [isLoding, setIsLoding] = useState(true);

  return (
    <SafeAreaView style={[Style.cointainer, { paddingHorizontal: 0 }]}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <View style={[Style.cointainer, { justifyContent: 'center' }]}>
          <Image
            source={{ uri: Urls.imageUrl + itemdata.image_of_loyalty_card }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="stretch"
          />

          {validationempty(totalpoint) ? (
            <View
              style={{
                position: 'absolute',
                left: 0,
                paddingBottom: 20,
                marginLeft: WIDTH / 8.5,
                alignItems: 'center',
              }}>
              <Text
                style={[
                  Style.text18,
                  {
                    fontSize: validationempty(itemdata.font_size)
                      ? parseInt(itemdata.font_size)
                      : 20,
                    marginTop: 20,
                    fontFamily: CustomeFonts.ComfortaaBold,
                    textAlign: 'center',
                    color: validationempty(itemdata.color)
                      ? itemdata.color
                      : Colors.black,
                  },
                ]}>
                {itemdata.point}/{totalpoint}
              </Text>
            </View>
          ) : (
            <View
              style={{
                position: 'absolute',
                left: 0,
                paddingBottom: 20,
                marginLeft: WIDTH / 8.5,
                alignItems: 'center',
              }}>
              {validationempty(itemdata.setup_level) ? (
                <Text
                  style={[
                    Style.text18,
                    {
                      fontSize: validationempty(itemdata.font_size)
                        ? parseInt(itemdata.font_size)
                        : 20,
                      marginBottom: validationempty1(itemdata.point_per_stamp)
                        ? 20
                        : 0,
                      marginTop: validationempty1(itemdata.point_per_stamp)
                        ? 0
                        : 20,
                      fontFamily: CustomeFonts.ComfortaaBold,
                      textAlign: 'center',
                      color: validationempty(itemdata.color)
                        ? itemdata.color
                        : Colors.black,
                    },
                  ]}>
                  {itemdata.ustamp}/{itemdata.setup_level}
                </Text>
              ) : null}
              {validationempty1(itemdata.point) ? (
                <Text
                  style={[
                    Style.text18,
                    {
                      color: validationempty(itemdata.color)
                        ? itemdata.color
                        : Colors.black,
                      textAlign: 'center',
                      fontSize: validationempty(itemdata.font_size)
                        ? parseInt(itemdata.font_size)
                        : 18,
                    },
                  ]}>
                  {itemdata.point}
                  {/* {itemdata.point_per_stamp} */}

                </Text>
              ) : null}
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              marginTop: 15,
            }}>
            <TopBar
              left={Images.ic_close}
              iconstyle={{ height: 30, width: 30 }}
              onPressLeft={() => {
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
