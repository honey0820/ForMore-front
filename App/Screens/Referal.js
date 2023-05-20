import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import LText from '../Compoment/LText';
import OtpInputs from 'react-native-otp-inputs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {showToast} from '../Common/CommonMethods';
import TopBar from '../Compoment/myTopBar';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import LanguageModal from '../Compoment/LanguageModal';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation}) => {
  const [loading, setLoding] = useState(false);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style1}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            margin: '5%',
            borderRadius: 18,
            borderWidth: 0.8,
            borderColor: Colors.lg_gray,
            padding: 10,
          }}>
          <Loader loading={loading} />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <Icon
              name={'ios-arrow-back-outline'}
              type={'ionicon'}
              size={25}
              onPress={() => {
                navigation.goBack();
              }}
            />

            <Text
              style={[
                styles.text14_bold,
                {
                  fontSize: 18,
                  color: Colors.blue,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Referal
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: '6%'}}>
            <Text
              style={[
                styles.text16_bold,
                {
                  color: Colors.gray,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Active
            </Text>
            <Text
              style={[
                styles.text16_bold,
                {
                  color: Colors.gray,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Archive
            </Text>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={['CrossFit']}
            renderItem={({item, index}) => (
              <Card
                containerStyle={[
                  styles.card_style,
                  {
                    flex: 1,
                    borderRadius: 15,
                    borderWidth: 0.8,
                    marginTop: '5%',
                    marginBottom: 1,
                    marginHorizontal: 10,
                  },
                ]}>
                <Text style={styles.text16_bold}>Lorem ipsum dolor</Text>
                <Text style={styles.text14_bold}>Lorem ipsum dolor</Text>
                <Text style={[styles.text12_bold, {marginTop: 6}]}>
                  Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum
                  dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum
                </Text>
                <Text style={[styles.text14_bold, {marginTop: 4}]}>
                  17 MAR 2022
                </Text>
                <Text style={styles.text12_bold}>check details</Text>

                <View style={{position: 'absolute', right: 0, bottom: 0}}>
                  <Mybutton
                    text="Invite"
                    onPress={() => {}}
                    style={{width: '100%', backgroundColor: Colors.blue}}
                    textstyle={{fontSize: 12}}
                  />
                </View>
              </Card>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text16_bold: {
    fontSize: 16,
    color: Colors.TheamColor2,
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text14_bold: {
    fontSize: 14,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text12_bold: {
    fontSize: 12,
    color: '#707070',
    fontFamily: CustomeFonts.ComfortaaRegular,
  },

  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    borderWidth: 0.8,
  },
});

export default UserInfo;
