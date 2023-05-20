import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ({navigation, route}) => {
  // const {navigation} = route.params;

  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessageforground', remoteMessage);

      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              if (remoteMessage.data.type == 'Rating') {
                navigation.navigate('BusinessRating', {
                  bus_id: remoteMessage.notification.body,
                });
              } else if (remoteMessage.data.type == 'Question') {
                navigation.replace('Questions', {
                  code: remoteMessage.data.code,
                });
              } else if (remoteMessage.data.type == 'Notification') {
                navigation.navigate('Notification', {
                  data: remoteMessage.data,
                  flag: '1',
                });
              } else if (remoteMessage.data.type == 'Order') {
                navigation.replace('MyOrders');
              } else if (remoteMessage.data.type == 'Appointment') {
                navigation.replace('Appointments');
              } else {
                navigation.replace('Home');
              }
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    });

    if (Platform.OS == 'ios') {
      PushNotification.configure({
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });

      messaging().onMessage((notification) => {
        PushNotification.localNotification({
          alertAction: 'view',
          title: notification['notification']['title'],
          message: notification['notification']['body'],
          userInfo: {id: 69},
        });
      });
    } else {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          AsyncStorage.setItem('token', token['token'].toString());
        },
        senderID: '421066113443',
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: false,
        requestPermissions: true,
      });
    }
  }, []);

  return null;
};

export default App;
