import React, { useEffect, useState } from 'react';
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
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mybutton from '../Compoment/mybutton';
import { Icon } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import {
  validateEmail,
  validationBlank,
  validatePassword,
} from '../Common/Validations';
import { showToast } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
const popAction = StackActions.pop(2);

var first_name, last_name, your_email;
const UserInfo = ({ navigation }) => {
  const [loading, setLoding] = useState(false);
  const [checked, setchecked] = useState(false);
  const [name_of_business, setname_of_business] = useState('');
  const [owner_email, setowner_email] = useState('');
  // const [your_email, setyour_email] = useState('');

  useEffect(() => {
    setLoding(true);
    GetData();
  }, []);

  const GetData = async () => {
    first_name = await AsyncStorage.getItem('first_name');
    last_name = await AsyncStorage.getItem('last_name');
    your_email = await AsyncStorage.getItem('email');
    setLoding(false);
  };

  const apiCall = async () => {
    if (validationBlank(name_of_business, 'Enter Name of a Business') &&
      validationBlank(owner_email, 'Business Info (Tel, Email, S.Media)') &&
      validationBlank(your_email, 'Enter Your Email') &&
      validateEmail(your_email.trim(), 'Enter Your Email')
    ) {
      if (your_email.trim() == owner_email) {
        showToast("Your and Owner Email can't be same", 'error');
      } else {
        if (checked) {
          setLoding(true);
          var formdata = new FormData();
          formdata.append('name_of_business', name_of_business);
          formdata.append('owner_email', owner_email + '');
          formdata.append('your_name', first_name + '');
          formdata.append('your_email', your_email + '');
          formdata.append('term_check', checked ? '1' : '0');

          console.log(formdata);

          var response = await Helper.POST(Urls.add_refer_details, formdata);
          console.log(response);
          setLoding(false);
          if (response.success == true) {
            showToast(response.message, 'success');
            navigation.dispatch(popAction);
          } else {
            showToast(response.message, 'error');
            navigation.dispatch(popAction);
          }
        } else {
          showToast('Kindly agree Terms & Conditions', 'error');
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
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

            <LText
              style={[
                styles.text14_bold,
                {
                  fontSize: 18,
                  marginTop: 0,
                  color: Colors.blue,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              Refer a business for join
            </LText>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { width: '90%', alignSelf: 'center', justifyContent: 'center' },
            ]}>
            <View style={{ marginTop: '15%' }}>
              <LText style={[styles.text14_bold]}>
                Name of a Business to refer
              </LText>
              <Card containerStyle={[styles.card_input_style]}>
                <TextInput
                  value={name_of_business}
                  onChangeText={(text) => setname_of_business(text)}
                  underlineColor={'transparent'}
                  style={[Style.textInput, { marginHorizontal: 4 }]}
                  placeholderTextColor={Colors.black}
                  selectionColor={Colors.TheamColor2}
                />
              </Card>

              <LText style={[styles.text14_bold]}>
                Business Info (Tel, Email, S.Media)
              </LText>
              <Card containerStyle={[styles.card_input_style]}>
                <TextInput
                  underlineColor={'transparent'}
                  value={owner_email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) => setowner_email(text)}
                  style={[Style.textInput, { marginHorizontal: 4 }]}
                  placeholderTextColor={Colors.black}
                  selectionColor={Colors.TheamColor2}
                />
              </Card>

              <LText style={[styles.text14_bold]}>Full Name</LText>
              <LText style={[styles.text12_bold]}>
                This business will see you referred them
              </LText>
              <Card containerStyle={[styles.card_input_style]}>
                <TextInput
                  underlineColor={'transparent'}
                  value={last_name + " " + first_name}
                  editable={false}
                  style={[Style.textInput, { marginHorizontal: 4 }]}
                  placeholderTextColor={Colors.black}
                  selectionColor={Colors.TheamColor2}
                />
              </Card>

              <LText style={[styles.text14_bold]}>Your Email</LText>
              <LText style={[styles.text12_bold]}>
                We need to send this referral email from you and to send you a
                reward if the business signs up.
              </LText>
              <Card containerStyle={[styles.card_input_style]}>
                <TextInput
                  value={your_email}
                  editable={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  // onChangeText={(text) => setyour_email(text)}
                  underlineColor={'transparent'}
                  style={[Style.textInput, { marginHorizontal: 4 }]}
                  placeholderTextColor={Colors.black}
                  selectionColor={Colors.TheamColor2}
                />
              </Card>

              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <CheckBox
                  iconType="font-awesome"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={checked}
                  onPress={() => setchecked(!checked)}
                  containerStyle={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginRight: 0,
                    textAlignVertical: 'center',
                    fontFamily: CustomeFonts.Poppins_Regular,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 10,
                    flexWrap: 'wrap',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Text style={[Style.text12]}>
                    I, have read and agree to the{' '}
                  </Text>
                  <Text
                    style={[
                      Style.text12,
                      { textDecorationLine: 'underline', color: Colors.blue },
                    ]}>
                    Terms & Conditions{' '}
                  </Text>
                  <Text style={[Style.text12]}>business referral scheme.</Text>
                </View>
              </View>

              <Mybutton
                text="Send Referral Email"
                onPress={() => {
                  apiCall();
                }}
                style={{ width: '100%', marginTop: '10%' }}
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card_input_style: {
    borderRadius: 818,
    borderWidth: 0.8,
    padding: 0,
    margin: 1,
    marginTop: 10,
  },

  text14_bold: {
    fontSize: 14,
    color: Colors.blue,
    marginTop: 10,
    marginLeft: 2,
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text12_bold: {
    fontSize: 12,
    color: Colors.lightblack,
    marginLeft: 2,
    fontFamily: CustomeFonts.ComfortaaBold,
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
