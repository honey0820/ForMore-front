import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  Modal,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
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
import {Card} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import TextInput from '../Compoment/TextInput';
import {Picker} from '@react-native-picker/picker';
import {RadioButton} from 'react-native-paper';
import Row from '../Compoment/Row';
import CountryListView from '../Compoment/CountryListView';
import {SafeAreaView} from 'react-native-safe-area-context';

const UserInfo = ({navigation, route}) => {
  const {
    fname,
    lname,
    password,
    country1,
    mobile_code,
    city1,
    date1,
    sex1,
    email1,
    checked1,
    kids1,
    info1,
    mno,
    entartainment,
    travelings,
    sports,
    lang_id,
    electronic_games,
    technolocgy,
    food,
    music,
    nightlife,
  } = route.params;

  const [loding, setLoding] = useState(false);
  const [country, setcountry] = useState(country1);
  const [countryname, setcountryname] = useState('');
  const [countryicon, setcountryicon] = useState('');
  const [countryarray, setcountryarray] = useState([]);
  const [city, setcity] = useState(city1);
  const [date, setDate] = useState(date1);
  const [sex, setsex] = useState(sex1);
  const [kids, setkids] = useState(kids1);
  const [info, setinfo] = useState(info1);
  const [email, setemail] = useState(email1);
  const [placeholder, setPlaceHolder] = useState('YYYY-MM-DD');
  const [checked, setChecked] = useState(checked1);
  const [visibleModalCountry, setVisibleModalCountry] = useState(false);

  const isPlaceholder = (value) => {
    return value == '';
  };

  useEffect(() => {
    apiCallCountry('1');
  }, []);

  const apiCallCountry = async (flag) => {
    setLoding(true);
    var response = await Helper.GET(Urls.countries);
    console.log('countriesaa==>', response.countries);
    setLoding(false);
    // if (response.success == true) {
    var dataaraay = response.countries;
    if (validationempty(dataaraay)) {
      setcountryarray(dataaraay);

      if (validationempty(country)) {
        for (let index = 0; index < dataaraay.length; index++) {
          const element = dataaraay[index];
          if (element.id == country) {
            setcountry(element.id);
            setcountryname(element.country_name);
          }
        }
      } else {
        // setcountry(dataaraay[0].id);
        // setcountryname(dataaraay[0].country_name);
      }
    }
    // }
  };

  let items = countryarray.map((item, index) => {
    return (
      <Picker.Item key={item.id} label={item.country_name} value={item.id} />
    );
  });
  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        source={Images.back_auth}
        style={Style.auth_img_back_style}>
        <Loader loading={loding} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              marginTop: '6%',
              marginHorizontal: 10,
              backgroundColor: 'transparent',
            }}>
            <Card containerStyle={[styles.card_style, {height: '97%'}]}>
              <View style={styles.v_sty_close}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon
                    name={'ios-arrow-back-outline'}
                    type={'ionicon'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: '4%',
                  }}>
                  <Image
                    source={Images.logo}
                    style={[Style.auth_img_style, {height: HEIGHT / 7}]}
                    resizeMode="contain"
                  />

                  <Mybutton
                    text="User ID"
                    iconname={Images.ic_user_white}
                    onPress={() => {
                      navigation.navigate('Userinfo');
                    }}
                    style={{width: '70%', marginBottom: 20, marginTop: 10}}
                  />

                  <LText style={[Style.text14_bold]}>Birthday</LText>
                  <TextInput
                    style={[Style.textInput]}
                    editable={false}
                    value={date}
                    placeholderTextColor={Colors.gray_d1}
                    selectionColor={Colors.TheamColor2}
                  />

                  <LText style={[Style.text14_bold]}>Sex</LText>
                  <View
                    style={{
                      borderBottomColor: Colors.lg_gray,
                      borderBottomWidth: 1,
                    }}>
                    <Picker
                      selectedValue={sex}
                      itemStyle={{
                        height: 50,
                        borderBottomColor: Colors.lg_gray,
                        borderBottomWidth: 1,
                        fontSize: 14,
                        fontFamily: CustomeFonts.ComfortaaRegular,
                      }}
                      style={
                        isPlaceholder(sex) ? styles.placeholder : styles.picker
                      }
                      onValueChange={(itemValue, itemIndex) =>
                        setsex(itemValue)
                      }>
                      <Picker.Item label="Select Sex" value="" />
                      <Picker.Item label="Male" value="1" />
                      <Picker.Item label="Female" value="2" />
                      <Picker.Item label="Other" value="3" />
                    </Picker>
                  </View>

                  <LText style={[Style.text14_bold]}>Email</LText>
                  <TextInput
                    style={[Style.textInput, {}]}
                    editable={false}
                    onChangeText={(text) => setemail(text)}
                    placeholderTextColor={Colors.gray}
                    value={email}
                    selectionColor={Colors.TheamColor2}
                  />

                  <LText style={[Style.text14_bold]}>Residence Country</LText>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomColor: Colors.lg_gray,
                      borderBottomWidth: 1,
                    }}
                    onPress={() => {
                      setVisibleModalCountry(true);
                    }}>
                    <Image
                      style={{width: 24, height: 24, resizeMode: 'contain'}}
                      source={{uri: Urls.imageUrl + countryicon}}
                    />

                    <TextInput
                      style={[
                        Style.textInput,
                        {
                          marginTop: 0,
                          flex: 1,
                          paddingLeft: 10,
                        },
                      ]}
                      underlineColor="transparent"
                      editable={false}
                      placeholderTextColor={Colors.gray}
                      value={countryname}
                      selectionColor={Colors.TheamColor2}
                    />

                    <Icon
                      name="md-caret-down-outline"
                      type={'ionicon'}
                      size={13}
                      style={{marginRight: 20}}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>

                  <LText style={[Style.text14_bold]}>City</LText>
                  <TextInput
                    style={[
                      Style.textInput,
                      {
                        marginTop: 0,
                        paddingLeft: 20,
                        borderBottomColor: Colors.lg_gray,
                        borderBottomWidth: 1,
                      },
                    ]}
                    underlineColor="transparent"
                    onChangeText={(text) => setcity(text)}
                    placeholderTextColor={Colors.gray}
                    value={city}
                    placeholder={'Type City'}
                    selectionColor={Colors.TheamColor2}
                  />

                  <LText style={[Style.text14_bold]}>Marital Status</LText>

                  <RadioButton.Group
                    onValueChange={(newValue) => {
                      setChecked(newValue);
                    }}
                    value={checked}>
                    <View style={Style.rowView}>
                      <View style={[Style.rowView, {width: '50%'}]}>
                        <RadioButton
                          value="1"
                          color={Colors.TheamColor2}
                          uncheckedColor={Colors.gray}
                        />
                        <Text style={[Style.text14]}>Married</Text>
                      </View>
                      <View style={[Style.rowView, {width: '50%'}]}>
                        <RadioButton
                          value="2"
                          color={Colors.TheamColor2}
                          uncheckedColor={Colors.gray}
                        />
                        <Text style={[Style.text14]}>Not Married</Text>
                      </View>
                    </View>
                  </RadioButton.Group>

                  <LText style={[Style.text14_bold]}>Kids (Below 14)</LText>
                  <View
                    style={{
                      borderBottomColor: Colors.lg_gray,
                      borderBottomWidth: 1,
                    }}>
                    <Picker
                      selectedValue={kids}
                      itemStyle={{
                        height: 50,
                        fontSize: 14,
                        fontFamily: CustomeFonts.ComfortaaRegular,
                      }}
                      style={
                        isPlaceholder(kids) ? styles.placeholder : styles.picker
                      }
                      onValueChange={(itemValue, itemIndex) =>
                        setkids(itemValue)
                      }>
                      <Picker.Item label="0" value="0" />
                      <Picker.Item label="1" value="1" />
                      <Picker.Item label="2" value="2" />
                      <Picker.Item label="3" value="3" />
                      <Picker.Item label="4" value="4" />
                      <Picker.Item label="5" value="5" />
                      <Picker.Item label="6" value="6" />
                    </Picker>
                  </View>

                  <Modal
                    animationType="slide"
                    swipeDirection={['down']}
                    visible={visibleModalCountry}
                    onRequestClose={() => {
                      setVisibleModalCountry(false);
                    }}
                    onBackdropPress={() => {
                      setVisibleModalCountry(false);
                    }}
                    transparent>
                    <View
                      style={{
                        backgroundColor: 'rgba(22, 27, 70, 0.5)',
                        height: '100%',
                        padding: '5%',
                      }}>
                      <View
                        style={{
                          backgroundColor: Colors.white,
                          padding: '2%',
                          height: '100%',
                        }}>
                        <Row style={{padding: 10, flex: 0}}>
                          <Text
                            style={[
                              Style.text14_bold,
                              {marginTop: 0, textAlign: 'center', flex: 1},
                            ]}>
                            Select Country
                          </Text>

                          <Icon
                            name="close-outline"
                            type={'ionicon'}
                            size={25}
                            color={'#AEB2BF'}
                            onPress={() => {
                              setVisibleModalCountry(false);
                            }}
                          />
                        </Row>
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          data={countryarray}
                          style={{paddingBottom: '5%'}}
                          renderItem={({item, index}) => (
                            <CountryListView
                              item={item}
                              index={index}
                              navigation={navigation}
                              onPress={() => {
                                setcountry(item.id + '');
                                setcountryname(item.country_name + '');
                                setcountryicon(item.country_icon);
                                setVisibleModalCountry(false);
                              }}
                            />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    </View>
                  </Modal>

                  <View
                    style={{
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                    }}>
                    <Icon
                      name={'ios-arrow-forward'}
                      type={'ionicon'}
                      size={25}
                      onPress={() => {
                        navigation.navigate('AccountDetail3', {
                          fname: fname,
                          lname: lname,
                          password: password,
                          country: country,
                          city: city,
                          date: date,
                          sex: sex,
                          checked: checked,
                          kids: kids,
                          info: info,
                          email: email,
                          lang_id: lang_id,
                          mobile_code: mobile_code,
                          mno: mno,
                          entartainment: entartainment,
                          travelings: travelings,
                          sports: sports,
                          electronic_games: electronic_games,
                          technolocgy: technolocgy,
                          food: food,
                          music: music,
                          nightlife: nightlife,
                        });
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            </Card>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  v_sty_close: {
    zIndex: 1,
    position: 'absolute',
    position: 'absolute',
    left: -16,
    top: -5,
  },
  bar_code_rg: {
    position: 'absolute',
    top: 8,
    right: 0,
    height: 40,
    width: 40,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  img_barcode_style: {height: 80, width: '100%'},
  img_copy_style: {height: 25, width: 22, marginLeft: 10},
  img_style: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cont_sty: {
    padding: 6,
    margin: 0,
    borderRadius: 55,
    borderWidth: 0.8,
    // width: WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  img_back_style: {
    height: 30,
    width: 30,
  },
  card_style: {
    borderRadius: 18,
    width: '90%',
    borderWidth: 0.8,
    paddingHorizontal: '8%',
  },
});

export default UserInfo;
