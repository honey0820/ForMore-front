import React, {useEffect, useState} from 'react';
import {
  Linking,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Compoment/mybutton';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import LText from '../Compoment/LText';
import {Card} from 'react-native-elements';
import {Rating, RatingProps, AirbnbRating} from 'react-native-elements';
import Header from '../Compoment/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import {validationempty} from '../Common/Validations';
import {showToast} from '../Common/CommonMethods';
import {SafeAreaView} from 'react-native-safe-area-context';

const BusinessRate = ({navigation, route}) => {
  const {bus_id} = route.params;
  const [username, setUserName] = useState('');
  const [rate, setrate] = useState('');
  const [loding, setLoding] = useState(false);

  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
    setrate(rating);
  };

  useEffect(() => {
    console.log('bus_id is: ' + bus_id);
  }, []);

  const apiCall_AddRating = async () => {
    if (validationempty(rate)) {
      // if (validationempty(username)) {
      setLoding(true);
      var id = await AsyncStorage.getItem('id');

      var formdata = new FormData();
      formdata.append('user_id', id + '');
      formdata.append('buss_id', bus_id);
      formdata.append('rating_no', rate + '');
      formdata.append('comment', username + '');
      console.log(Urls.ratings_add);
      var response = await Helper.POST(Urls.ratings_add, formdata);
      setLoding(false);
      if (response.success == true) {
        showToast(response.message, 'success');
        navigation.popToTop();
        navigation.replace('Home');
      } else {
        showToast(response.message, 'error');
      }
      // } else {
      //   showToast('Type Comment', 'error');
      // }
    } else {
      showToast('Kingly Add Rating', 'error');
    }
  };

  const ratingProps = {};

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        // source={Images.back_auth}
        style={[
          Style.auth_img_back_style,
          {backgroundColor: Colors.TheamColor2},
        ]}>
        <Loader loading={loding} />

        <Header navigation={navigation} />

        <Image
          source={Images.logo_white}
          style={[Style.auth_img_style, {height: HEIGHT / 8, marginTop: 20}]}
          resizeMode="contain"
        />

        <Card
          containerStyle={{
            borderWidth: 0.8,
            borderRadius: 25,
            marginHorizontal: '12%',
            paddingHorizontal: 20,
          }}>
          <LText
            style={[
              Style.text16,
              {color: Colors.black, fontFamily: CustomeFonts.ComfortaaBold},
            ]}>
            How was your ForMore Experience ?
          </LText>

          {/* <Rating
            //   showRating
            type="star"
            fractions={1}
            imageSize={22}
            onFinishRating={ratingCompleted}
            style={{
              marginTop: 10,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          /> */}

          <View
            style={{
              paddingTop: 5,
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
            }}>
            <AirbnbRating
              type="custom"
              showRating={false}
              defaultRating={0}
              size={20}
              fractions={1}
              selectedColor="#3498db"
              count={5}
              imageSize={22}
              onFinishRating={ratingCompleted}
              containerStyle={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            />
          </View>

          <Card
            containerStyle={{
              marginVertical: 5,
              borderRadius: 8,
              borderWidth: 0.8,
              marginHorizontal: 0,
              paddingVertical: 0,
            }}>
            <TextInput
              onChangeText={(text) => setUserName(text)}
              placeholderTextColor={Colors.gray_d1}
              value={username}
              placeholder={'Comment'}
              multiline={true}
              numberOfLines={4}
              selectionColor={Colors.TheamColor2}
            />
          </Card>

          <Button
            text="SEND"
            onPress={() => {
              apiCall_AddRating();
            }}
            style={{marginTop: 10, width: '100%'}}
          />
        </Card>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignSelf: 'center',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPressIn={() => {
              navigation.popToTop();
              navigation.replace('Home');
            }}>
            <Image
              source={Images.ic_close}
              style={{tintColor: 'white', height: 30, width: 30}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BusinessRate;
