import React, { useState } from 'react';
import {
  SafeAreaView,
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
import { HEIGHT } from '../../Theme/Style';
import CustomeFonts from '../../Theme/CustomeFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Urls } from '../../Common/Urls';

const LanguageModal = (props) => {
  const {
    isVisible,
    setIsVisible,
    selectedlang,
    setselectedlangimg,
    selectedlangid,
    setselectedlang,
    setselectedlangid,
    data,
  } = props;
  const [check, setcheck] = useState(selectedlangid);
  const { t, i18n } = useTranslation();
  const changeLanguage = async (value) => {
    i18n
      .changeLanguage(value)
      .then(() => {
        console.log(i18n.language);
      })
      .catch((err) => console.log(err));
    await AsyncStorage.setItem('lang_id', selectedlangid + '');
    await AsyncStorage.setItem('lang_name', value + '');
  };

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
              height:'100%',
              backgroundColor: 'white',
              elevation: 2,
            },
          ]}>
          <Row style={{ marginBottom: 10, padding: 10, flex: 0 }}>
            <Text style={[styles.TextStyle, { textAlign: 'center', flex: 1 }]}>
              Choose Language
            </Text>

            <Icon
              name="close-outline"
              type={'ionicon'}
              size={25}
              color={'#AEB2BF'}
              onPress={() => {
                setIsVisible(!isVisible);
              }}
            />
          </Row>

          {data.map((item, index) => {
            return (
              <TouchableOpacity key={index}>
                <View style={styles.main_V_style}>
                  <Image
                    style={styles.imgStyle}
                    source={{ uri: Urls.imageUrl + item.icon_img }}
                  />
                  <Text style={styles.TextStyle1}>{item.language_name}</Text>
                  <CheckBox
                    checked={selectedlangid == item.id ? true : false}
                    onPress={() => {
                      changeLanguage(item.language_name);
                      setcheck(item.id);
                      setselectedlang(item.language_name);
                      setselectedlangid(item.id);
                      setselectedlangimg(item.icon_img);
                    }}
                    iconType="font-awesome"
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginRight: 0,
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </Modal>
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
    fontSize: 14,
    lineHeight: RFValue(24),
    color: '#2D99DB',
    flex: 1,
    alignSelf: 'center',
    left: 10,
  },
  TextStyle1: {
    fontFamily: CustomeFonts.Poppins_Regular,
    fontSize: 14,
    lineHeight: RFValue(20),
    color: '#0E1339',
    alignSelf: 'center',
    left: 10,
    flex: 1,
  },
});
