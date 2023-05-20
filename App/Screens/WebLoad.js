import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  PermissionsAndroid,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Style, {HEIGHT} from '../Theme/Style';
import {WebView} from 'react-native-webview';
import Images from '../Theme/Images';
import TopBar from '../Compoment/myTopBar';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = ({navigation, route}) => {
  const {WebLoad, flag} = route.params;
  const [loding, setLoding] = useState(false);
  const {width} = useWindowDimensions();

  useEffect(() => {}, [navigation]);

  navigation.setOptions({title: ''});

  return (
    <ImageBackground
      source={Images.back_auth}
      style={Style.auth_img_back_style}>
      {/* <Loader loading={loding} /> */}

      <TopBar
        left={Images.ic_close}
        style={{marginTop: 10}}
        iconstyle={{height: 30, width: 30}}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      {flag == 'title' ? (
        <ScrollView style={[{height: '100%', margin: '6%'}]}>
          <Text style={Style.text14}>{WebLoad}</Text>
        </ScrollView>
      ) : (
        <View style={[{flex: 1, marginHorizontal: '4%'}]}>
          <WebView
            source={{
              uri: WebLoad,
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
          />
        </View>
      )}
    </ImageBackground>
  );
};
export default Home;
