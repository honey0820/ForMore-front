import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  Switch,
  StyleSheet,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import Mybutton from '../Compoment/mybutton';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import LText from '../Compoment/LText';
import {validationempty} from '../Common/Validations';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {showToast} from '../Common/CommonMethods';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpData2 = ({navigation, route}) => {
  const {
    country,
    city,
    date,
    sex,
    checked,
    kids,
    info,
    entartainment,
    travelings,
    sports,
    electronic_games,
    technolocgy,
    food,
    music,
    nightlife,
  } = route.params;

  const [loding, setLoding] = useState(false);
  const [isa, setisa] = useState(entartainment == '1' ? true : false);
  const [isb, setisb] = useState(travelings == '1' ? true : false);
  const [isc, setisc] = useState(sports == '1' ? true : false);
  const [isd, setisd] = useState(electronic_games == '1' ? true : false);
  const [ise, setise] = useState(technolocgy == '1' ? true : false);
  const [isf, setisf] = useState(food == '1' ? true : false);
  const [isg, setisg] = useState(music == '1' ? true : false);
  const [ish, setish] = useState(nightlife == '1' ? true : false);

  const toggleSwitchA = () => setisa((previousState) => !previousState);
  const toggleSwitchB = () => setisb((previousState) => !previousState);
  const toggleSwitchC = () => setisc((previousState) => !previousState);
  const toggleSwitchD = () => setisd((previousState) => !previousState);
  const toggleSwitchE = () => setise((previousState) => !previousState);
  const toggleSwitchF = () => setisf((previousState) => !previousState);
  const toggleSwitchG = () => setisg((previousState) => !previousState);
  const toggleSwitchH = () => setish((previousState) => !previousState);

  const apiCall = async () => {
    setLoding(true);
    var formdata = new FormData();
    formdata.append('id', LocalData.Id + '');
    formdata.append('birth_date', date);
    formdata.append('sex', sex);
    formdata.append('city', city);
    formdata.append('residence_country_id', country);
    formdata.append('marital_status', checked);
    formdata.append('no_kids', kids);
    formdata.append('entartainment', isa ? '1' : '0');
    formdata.append('travelings', isb ? '1' : '0');
    formdata.append('sports', isc ? '1' : '0');
    formdata.append('electronic_games', isd ? '1' : '0');
    formdata.append('technolocgy', ise ? '1' : '0');
    formdata.append('food', isf ? '1' : '0');
    formdata.append('music', isg ? '1' : '0');
    formdata.append('nightlife', ish ? '1' : '0');
    formdata.append('info', info);

    console.log('user_detils_update formdata', formdata);
    var response = await Helper.POST(Urls.user_detils_update, formdata);
    console.log('user_detils_update response', response);
    setLoding(false);
    if (response.status == 200) {
      await AsyncStorage.setItem('residence_country_id', country + '');

      showToast(response.Message + '', 'success');
      navigation.popToTop();
      navigation.replace('AppIntro', {flag: '0'});
    } else {
      showToast(response.Message, 'error');
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: '70%',
            flexGrow: 1,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <Image
              source={Images.logo}
              style={[Style.auth_img_style, {height: HEIGHT / 6}]}
              resizeMode="contain"
            />

            <LText
              style={[
                Style.text14_bold,
                {
                  fontFamily: CustomeFonts.ComfortaaBold,
                  fontSize: 18,
                  textAlign: 'center',
                },
              ]}>
              Select your interests
            </LText>

            <LText
              style={[
                Style.text14,
                {
                  fontFamily: CustomeFonts.ComfortaaBold,
                  marginBottom: 30,
                  marginTop: 20,
                  textAlign: 'center',
                },
              ]}>
              Choose the areas of your Interest
            </LText>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Entertainment / Arts
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchA}
                value={isa}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Travelings
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchB}
                value={isb}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Sports
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchC}
                value={isc}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Electronic games
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchD}
                value={isd}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Technology
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchE}
                value={ise}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Food
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchF}
                value={isf}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Music
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchG}
                value={isg}
              />
            </View>

            <View style={styles.row_style}>
              <View style={styles.rs_style}>
                <Image
                  source={Images.ic_tooltip}
                  style={styles.lg_style}
                  resizeMode="contain"
                />
                <LText
                  style={[
                    Style.text14_bold,
                    {fontSize: 15, flex: 1, textAlign: 'left', marginTop: 0},
                  ]}>
                  Nightlife
                </LText>
              </View>
              <Switch
                trackColor={{true: '#d31cb0', false: '#2D99DB'}}
                thumbColor={'white'}
                onValueChange={toggleSwitchH}
                value={ish}
              />
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            width: '90%',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 15,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Button
              title="Skip"
              onPress={() => {
                navigation.popToTop();
                navigation.replace('AppIntro', {flag: '0'});
              }}
              style={{alignSelf: 'flex-start', backgroundColor: 'transparent'}}
              textstyle={{color: Colors.black}}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Done"
              onPress={() => {
                apiCall();
              }}
              style={{alignSelf: 'flex-end', backgroundColor: 'transparent'}}
              textstyle={{color: Colors.blue}}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  lg_style: {height: 15, width: 15, marginRight: 12},
  row_style: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs_style: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OpData2;
