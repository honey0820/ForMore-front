import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  PermissionsAndroid,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Style, {HEIGHT} from '../Theme/Style';
import {WebView} from 'react-native-webview';
import Images from '../Theme/Images';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import TopBar from '../Compoment/myTopBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { validationempty } from '../Common/Validations';

const APPP = ({navigation, route}) => {
  const {flag} = route.params;
  const [loding, setLoding] = useState(false);
  const [WebLoad, setWebLoad] = useState('');

  useEffect(() => {
    apiCall();
  }, []);

  navigation.setOptions({title: ''});

  const apiCall = async () => {
    setLoding(true);
    var lang_id = (await AsyncStorage.getItem('lang_id')) + '';
    console.log("lang_id===",lang_id)
    var response = await Helper.GET(Urls.link_masters);
    console.log(response)
    if (response.success == 'true') {
      let array = response.linkMasters;
      if (flag == '1') {
        
        if(validationempty(lang_id))
        {
          if (lang_id == '1') {
            setWebLoad(array[0].term_link + '');
          }
          if (lang_id == '2') {
            setWebLoad(array[0].albanian_term_link + '');
          }
          if (lang_id == '3') {
            setWebLoad(array[0].greek_term_link + '');
          }
          if (lang_id == '4') {
            setWebLoad(array[0].italian_term_link + '');
          }
        }
        else{
          setWebLoad(array[0].term_link + '');
        }
      }
      if (flag == '2') {
        if(validationempty(lang_id))
        {
          if (lang_id == '1') {
            setWebLoad(array[0].privacy_link + '');
          }
          if (lang_id == '2') {
            setWebLoad(array[0].albanian_privacy_link + '');
          }
          if (lang_id == '3') {
            setWebLoad(array[0].greek_privacy_link + '');
          }
          if (lang_id == '4') {
            setWebLoad(array[0].italian_privacy_link + '');
          }
        }
        else{
          setWebLoad(array[0].privacy_link + '');
        }

        
      }
      setLoding(false);
    } else {
      setLoding(false);
    }
  };

  return (
    <SafeAreaView style={Style.auth_img_back_style}>
      {/* <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}> */}
      <TouchableOpacity
        style={{marginTop: 10, marginLeft: 15}}
        onPressIn={() => {
          navigation.goBack();
        }}>
        <Image style={{height: 30, width: 30}} source={Images.ic_close} />
      </TouchableOpacity>

      <Loader loading={loding} />

      {loding ? (
        <Loader loading={loding} />
      ) : (
        <View style={[{flex: 1, margin: '4%'}]}>
          <WebView
            source={{
              uri: WebLoad,
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
          />
        </View>
      )}
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};
export default APPP;
