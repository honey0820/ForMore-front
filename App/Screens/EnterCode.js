import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Dimensions,
  Image,
  Text,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {validationBlank, validationempty} from '../Common/Validations';
import {showToast, NoData} from '../Common/CommonMethods';
import Button from '../Compoment/mybutton';
import TextInput from '../Compoment/TextInput';
import {SafeAreaView} from 'react-native-safe-area-context';

const App = ({navigation, route}) => {
  const [info, setinfo] = useState('');
  const [loding, setLoding] = useState(false);

  useEffect(() => {}, []);

  const ApicallSubmit = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');

    if (validationBlank(info, 'Enter Code')) {
      setLoding(true);
      var id = await AsyncStorage.getItem('id');
      var formdata = new FormData();
      formdata.append('user_id', id + '');
      formdata.append('code', info + '');
      formdata.append('language_id', lang_id + '');

      console.log(formdata);
      var response = await Helper.POST(Urls.add_code, formdata);
      console.log(response);
      setLoding(false);
      if (response.status == 200) {
        navigation.goBack();
        showToast(response.Message, 'success');
      } else {
        showToast(response.Message, 'error');
      }
    }
  };

  return (
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
                navigation.goBack();
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

                  <LText style={[Style.text14_bold]}>Enter code</LText>

                  <TextInput
                    style={[Style.textInput, {marginTop: 0}]}
                    onChangeText={(text) => setinfo(text)}
                    placeholderTextColor={Colors.gray_d1}
                    value={info}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    selectionColor={Colors.TheamColor2}
                  />

                  <Button
                    text="Submit"
                    onPress={() => {
                      ApicallSubmit();
                    }}
                    style={{marginTop: 25, marginBottom: 10, width: '50%'}}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
