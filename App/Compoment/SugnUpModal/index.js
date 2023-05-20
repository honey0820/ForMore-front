import React, { useState } from 'react';
import {
  Image,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Row from '../Row';
import { Icon } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import Style, { HEIGHT } from '../../Theme/Style';
import Colors from '../../Theme/Colors';
import Images from '../../Theme/Images';
import CustomeFonts from '../../Theme/CustomeFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Urls } from '../../Common/Urls';
import { SafeAreaView } from 'react-native-safe-area-context';

const LanguageModal = (props) => {
  const {
    isVisible,
    setIsVisible,
    navigation

  } = props;


  return (
    <Modal
      // animated
      animationType="slide"
      swipeDirection={['down']}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
      transparent>
      <SafeAreaView style={styles.overlay}>
        <View
          style={[
            {
              margin: 20, borderRadius: 8,
              backgroundColor: 'white',
              elevation: 2,justifyContent:'space-evenly'
            },
          ]}>

          

          <Image
            source={Images.ic_op}
            style={{ width: '100%', height: '40%' }}
            resizeMode="contain"
          />

          <View style={{ alignItems: 'center'}}>
            <Text style={[Style.text16, { justifyContent: 'center', alignItems: 'center' }]}>
              Oops!! You need to {' '}
              <Text
                onPress={() => {
                  setIsVisible(!isVisible);
                  navigation.navigate('Register')
                }}
                style={[Style.text16,
                {
                  backgroundColor: Colors.TheamColor2,
                  borderRadius: 8, color: 'white'
                }]}>
                {' '} Sign Up {' '}
              </Text>
            </Text>
            <Text style={[Style.text16, { marginTop: 10 }]}>
              to have access to this page.
            </Text>


          </View>

          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPressIn={() => {
                setIsVisible(!isVisible);
              }}>
              <Image
                source={Images.ic_close}
                style={{
                  tintColor: Colors.blue,
                  height: 30,
                  width: 30,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </Modal >
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  main_V_style: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cont_style: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: 'rgba(22, 27, 70, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  imgStyle: {
    width: RFValue(24),
    height: RFValue(24),
    resizeMode: 'contain',
  },
  TextStyle: {
    fontFamily: CustomeFonts.ComfortaaBold,
    fontSize: RFValue(14),
    lineHeight: RFValue(24),
    color: '#2D99DB',
    flex: 1,
    alignSelf: 'center',
    left: 10,
  },
  TextStyle1: {
    fontFamily: CustomeFonts.Poppins_Regular,
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    color: '#0E1339',
    alignSelf: 'center',
    left: 10,
    flex: 1,
  },
});
