import React, {useEffect, useState} from 'react';
import {
  Linking,
  ImageBackground,
  View,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {CheckLogin, Checkguest} from '../Common/CommonMethods';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import {LocalData, Urls} from '../Common/Urls';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import messaging from '@react-native-firebase/messaging';
import PushController from '../../PushController';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import i18n from '../Compoment/i18n';
import {validationempty} from '../Common/Validations';

const Splash = ({params, navigation}) => {
  const [isLoding, setIsLoding] = useState(true);
  const [pImage, setPImage] = useState('');
  const [userId, setUserId] = useState('');
  const {t, i18n} = useTranslation();

  const userProfile = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var lang_name = await AsyncStorage.getItem('lang_name');
    if (validationempty(lang_id)) {
      i18n
        .changeLanguage(lang_name)
        .then(() => {
          console.log(i18n.language);
        })
        .catch((err) => console.log(err));
    }
    var isLogin1 = await CheckLogin();
    if (isLogin1) {
      LocalData.isfirsttime = true;
      navigation.replace('Home');
    } else {
      LocalData.isfirsttime = true;
      var isguest = await Checkguest();
      if(isguest)
      {
        navigation.replace('Home');
      }
      else{
        
        navigation.replace('MainSelection');
      }
      
    }
  };

  useEffect(() => {
    setTimeout(() => {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Your message was handled in background');
      });

      // Notification caused app to open from background state
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('onNotificationOpenedApp');
        if (remoteMessage) {
          if (remoteMessage.data.type == 'Rating') {
            navigation.replace('BusinessRating', {
              bus_id: remoteMessage.notification.body,
            });
          } else if (remoteMessage.data.type == 'Question') {
            navigation.replace('Questions', {
              code: remoteMessage.data.code,
            });
          } else if (remoteMessage.data.type == 'Notification') {
            navigation.replace('Notification', {
              data: remoteMessage.data,
              flag: '1',
            });
          } else if (remoteMessage.data.type == 'Order') {
            navigation.replace('MyOrders');
          } else if (remoteMessage.data.type == 'Appointment') {
            navigation.replace('Appointments');
          } else {
            userProfile();
          }
        } else {
          userProfile();
        }
      });

      // Notification caused app to open from quit state
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          console.log('getInitialNotification');
          if (remoteMessage) {
            if (remoteMessage.data.type == 'Rating') {
              navigation.replace('BusinessRating', {
                bus_id: remoteMessage.notification.body,
              });
            } else if (remoteMessage.data.type == 'Question') {
              navigation.replace('Questions', {
                code: remoteMessage.data.code,
              });
            } else if (remoteMessage.data.type == 'Notification') {
              navigation.replace('Notification', {
                data: remoteMessage.data,
                flag: '1',
              });
            } else if (remoteMessage.data.type == 'Order') {
              navigation.replace('MyOrders');
            } else if (remoteMessage.data.type == 'Appointment') {
              navigation.replace('Appointments');
            } else {
              userProfile();
            }
          } else {
            userProfile();
          }
        });
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={[Style.cointainer, {paddingHorizontal: 0}]}>
      <CustomStatusBar />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <View
          style={[
            {
              height: '50%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
          ]}>
          <Image
            source={Images.logo}
            style={Style.auth_img_style}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
      <PushController navigation={navigation} />
    </SafeAreaView>
  );
};

export default Splash;
