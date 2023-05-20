import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableNativeFeedback,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import Button from '../Compoment/Button';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import { Card } from 'react-native-elements';
import LText from '../Compoment/LText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../Compoment/Loader';
import Mybutton from '../Compoment/mybutton';
import TopBar from '../Compoment/myTopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationempty } from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfo = ({ navigation, route }) => {
  const { businesslist, latitude, longitude } = route.params;
  const [loding, setLoding] = useState(false);
  const [businesslist1, setbusinesslist1] = useState([]);

  const listToAray = (fullString, separator) => {
    var fullArray = [];

    if (fullString !== undefined) {
      if (fullString.indexOf(separator) == -1) {
        fullArray.push(fullString);
      } else {
        fullArray = fullString.split(separator);
      }
    }

    return fullArray;
  };

  const list1 = (services) => {
    var myArray = listToAray(services, ',');
    // console.log('myArray', myArray[0]);
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={true}
        data={myArray}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: myArray[index] == 5 ? WIDTH / 5 : WIDTH / 5.6,
              marginTop: 6,
            }}>
            {myArray[index] == 1 ? (
              <Mybutton
                text="Loyalty"
                style={{
                  backgroundColor: '#0F6CA5',
                  borderRadius: 2,
                  marginHorizontal: 0,
                }}
                textstyle={{ fontSize: 12, letterSpacing: 0 }}
              />
            ) : null}

            {myArray[index] == 2 ? (
              <Mybutton
                text="Offers"
                style={{
                  backgroundColor: '#1D7802',
                  borderRadius: 2,
                  marginHorizontal: 0,
                }}
                textstyle={{
                  fontSize: 12,
                  letterSpacing: 0,
                  paddingHorizontal: 4,
                }}
              />
            ) : null}

            {myArray[index] == 3 ? (
              <Mybutton
                text="Deals"
                style={{
                  backgroundColor: '#87069F',
                  borderRadius: 2,
                  marginHorizontal: 0,
                }}
                textstyle={{
                  fontSize: 12,
                  paddingHorizontal: 4,
                  letterSpacing: 0,
                }}
              />
            ) : null}

            {myArray[index] == '4' ? (
              <Mybutton
                text="Eshop"
                style={{
                  backgroundColor: '#FF0707',
                  borderRadius: 2,
                  marginHorizontal: 0,
                }}
                textstyle={{
                  fontSize: 12,
                  paddingHorizontal: 4,
                  letterSpacing: 0,
                }}
              />
            ) : null}

            {myArray[index] == '5' ? (
              <Mybutton
                text="Booking"
                style={{
                  backgroundColor: '#B19B0D',
                  borderRadius: 2,
                  marginHorizontal: 0,
                }}
                textstyle={{
                  fontSize: 12,
                  paddingHorizontal: 4,
                  letterSpacing: 0,
                }}
              />
            ) : null}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  useEffect(() => {
    apiCallBusinesslist();
  }, []);

  const apiCallBusinesslist = async () => {
    setLoding(true);
    var selcountry = await AsyncStorage.getItem('residence_country_id');
    var formdata = new FormData();
    formdata.append('country_id', selcountry);
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);

    var response = await Helper.POST(
      Urls.country_wise_business_position,
      formdata,
    );

    if (response.status == 200) {
      if (validationempty(response.brands)) {
        const newArrayList = [];
        const arr3 = [...response.brands, ...businesslist];
        arr3.forEach((obj) => {
          if (!newArrayList.some((o) => o.id === obj.id)) {
            newArrayList.push({ ...obj });
          }
        });
        setbusinesslist1(newArrayList);
      } else {
        setbusinesslist1(businesslist);
      }
      setLoding(false);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <CustomStatusBar hidden={false} />
        <ImageBackground
          source={Images.back_auth}
          style={{ width: '100%', height: '100%' }}>

          <Loader loading={loding} />

          <View
            style={{
              flex: 1,
              backgroundColor: Colors.white,
              margin: '4%',
              borderRadius: 18,
              borderWidth: 0.8,
              borderColor: Colors.lg_gray,
              padding: 4,
            }}>
            <TopBar
              left={Images.ic_close}
              style={{ left: -35, top: -10, height: 20 }}
              iconstyle={{ height: 30, width: 30 }}
              onPressLeft={() => {
                navigation.goBack();
              }}
            />

            <FlatList
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={false}
              data={businesslist1}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BusinessInfo', {
                      user_id: item.user_id,
                      latitude: latitude,
                      longitude: longitude,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: 10,
                      marginBottom: 10,
                    }}>
                    <Card
                      containerStyle={[
                        {
                          marginRight: 10,
                          borderRadius: 8,
                          margin: 4,
                          padding:6
                        },
                      ]}>
                      <Image
                        source={
                          validationempty(item.brand_icon)
                            ? { uri: Urls.imageUrl + item.brand_icon }
                            : Images.ic_placeholder
                        }
                        style={{
                          width: WIDTH / 7,
                          height: WIDTH / 7,
                          borderRadius: 8,
                        }}
                      />
                      <View style={styles.bottom_line}></View>
                    </Card>

                    <View
                      style={{
                        flex: 1,
                        // justifyContent: 'center',
                        // alignContent: 'center',
                      }}>
                      <Text
                        style={[
                          Style.text14_bold,
                          {  color: Colors.blue, marginLeft: 4 },
                        ]}>
                        {item.name}
                      </Text>

                      <Text style={[Style.text12, { marginLeft: 4 }]}>
                        {validationempty(item.distance) ? 'Distance : ' + ((item.distance).toFixed(2)) + ' Km' : ''}
                      </Text>

                      {/* <View style={{flex: 1, backgroundColor: Colors.gray_d1}}> */}
                      {validationempty(item.services)
                        ? list1(item.services)
                        : null}
                      {/* </View> */}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img_back_style: {
    height: 30,
    width: 30,
    marginRight: 5,
    marginBottom: 5,
  },
  card_style: {
    borderRadius: 18,
    width: '91%',
    borderWidth: 0.8,
    paddingHorizontal: '2%',
  },
});

export default UserInfo;
