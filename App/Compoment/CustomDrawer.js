import React, {useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LocalData, Params, Urls} from '../Common/Urls';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Share} from 'react-native';
import {Alert} from 'react-native';
import {validationempty} from '../Common/Validations';

const CustomDrawer = ({params, navigation}) => {
  const [pImage, setPImage] = useState(LocalData.ImageProfile);
  const [ssn, setSsn] = useState(LocalData.ssn);

  const logout = async () => {
    Alert.alert('Logout', 'Are You Sure You Want To Logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          console.log('logoutr call');
          await AsyncStorage.setItem('id', '');
          await AsyncStorage.setItem('name', '');
          await AsyncStorage.setItem('email', '');
          await AsyncStorage.setItem('phone', '');
          await AsyncStorage.setItem('access_token', '');
          await AsyncStorage.setItem('image', '');
          navigation.replace('Login');
        },
      },
    ]);
  };

  const shareApp = async () => {
    Share.share({
      title: 'Svasthye Setu',
      message:
        "Hey, I'm using Svasthye Setu application and get Medical Service At Home, \nDownload it heare :https://play.google.com/store/apps/details?id=com.svasthysetu",
      url:
        'https://play.google.com/store/apps/details?id=com.svasthysetu&referrer="' +
        LocalData.Id +
        '',
    });
  };
  return (
    <SafeAreaView
      style={[Style.cointainer, {backgroundColor: Colors.TheamColor}]}>
      <ScrollView>
        <View
          style={[
            Style.cointainer,
            {justifyContent: 'center', backgroundColor: Colors.TheamColor},
          ]}>
          <View
            style={[
              Style.rowView,
              {
                backgroundColor: Colors.TheamColor2,
                padding: '3%',
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              },
            ]}>
            {/* <Thumbnail containerStyle={{ width: 30, height: 30 }} source={validationempty(pImage) ? { uri: pImage } : { uri: 'https://www.dlf.pt/dfpng/middlepng/248-2480658_profile-icon-png-image-free-download-searchpng-profile.png' }} /> */}
            <View style={{flex: 1}}>
              <Text
                style={[
                  Style.text18,
                  {paddingHorizontal: '5%', flex: 1, color: Colors.white},
                ]}>
                {LocalData.Name}
              </Text>
              <Text
                style={[
                  Style.text18,
                  {paddingHorizontal: '5%', flex: 1, color: Colors.white},
                ]}>
                {LocalData.ssn}
              </Text>
            </View>
            <Icon
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate('MemberList');
              }}
              name="ios-chevron-forward-outline"
              type="ionicon"
              size={25}
              color={Colors.white}
              containerStyle={{flex: 0.3}}
            />
          </View>
          <View style={{padding: '1%', marginVertical: '3%'}}>
            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={() => navigation.navigate('Profile')}>
              <Icon
                name="user"
                type="feather"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Personal Info
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate('MemberList');
              }}>
              <Icon
                name="users"
                type="feather"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Members
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={() => {}}>
              <Icon
                name="md-wallet-outline"
                type="ionicon"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Wallet
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ marginVertical: '5%', flexDirection: 'row' }}>
                            <Icon name='language' type='entypo' size={25} color={Colors.TheamColor2} containerStyle={{ flex: 0.3 }} />
                            <Text style={[Style.text18, { flex: 0.5, color: Colors.TheamColor2 }]}>Langugae</Text>
                        </TouchableOpacity> */}
            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={() => navigation.navigate('ContactUs', {massage: ''})}>
              <Icon
                name="headphones"
                type="feather"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={() => shareApp()}>
              <Icon
                name="share-2"
                type="feather"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Share App
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginVertical: '5%', flexDirection: 'row'}}
              onPress={logout}>
              <Icon
                name="log-out"
                type="feather"
                size={25}
                color={Colors.TheamColor2}
                containerStyle={{flex: 0.3}}
              />
              <Text
                style={[Style.text18, {flex: 0.5, color: Colors.TheamColor2}]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;
