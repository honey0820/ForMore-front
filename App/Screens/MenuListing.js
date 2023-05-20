import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableNativeFeedback,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import {Card} from 'react-native-elements';
import LText from '../Compoment/LText';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../Compoment/Loader';
import Mybutton from '../Compoment/mybutton';
import TopBar from '../Compoment/myTopBar';
import {showToast, NoData} from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import MultiSelect from 'react-native-multiple-select';
import {SafeAreaView} from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {validationempty} from '../Common/Validations';

const UserInfo = ({navigation, route}) => {
  const {latitude, longitude} = route.params;
  const {width} = useWindowDimensions();
  const [loding, setLoding] = useState(false);
  const [info, setinfo] = useState('');
  const multiSelect = React.useRef(null);
  const [selectedItems, setselecteditem] = useState([]);
  const [catlist, setcatlist] = useState([]);
  const [businesslist, setbusinesslist] = useState([]);

  useEffect(() => {
    setLoding(true);
    apiCallLanguage_Info();
    apiCallcategories();
  }, []);

  const apiCallLanguage_Info = async () => {
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('screen_name', 'Search By Category');
    formdata.append('language_id', lang_id + '');

    var response = await Helper.POST(Urls.app_screen_language_wise, formdata);
    console.log(response);
    if (response.status == 200) {
      setinfo(response.data.content);
      console.log('content', response.data.content);
    } else {
      // showToast(response.Message, 'error');
    }
  };

  const apiCallcategories = async () => {
    setLoding(true);
    var lang_id = await AsyncStorage.getItem('lang_id');
    var formdata = new FormData();
    formdata.append('lang_id', lang_id);
    var response = await Helper.POST(Urls.categories,formdata);
    console.log(response);
    if (response.status == 200) {
      setLoding(false);
      // var ss = response.categories.splice(1);
      var ss = response.categories;
      setcatlist(ss);
      setselecteditem([ss[0].id]);
    } else {
      setLoding(false);
      showToast(response.Message, 'error');
    }
  };

  const onSelectedItemsChange = (selectedItems) => {
    setselecteditem(selectedItems);
  };

  const apiCallBusinesslist = async (selectedItems) => {
    var residence_country_id = await AsyncStorage.getItem(
      'residence_country_id',
    );
    setLoding(true);
    setbusinesslist([]);

    var formdata = new FormData();
    for (var i = 0; i < selectedItems.length; i++) {
      formdata.append('cat_id[]', selectedItems[i]);
    }
    formdata.append('latitude', latitude);
    formdata.append('longitude', longitude);
    formdata.append('country_id', residence_country_id);

    console.log(formdata);
    var response = await Helper.POST(Urls.category_search_business, formdata);
    console.log(response);
    if (response.status == 200) {
      setLoding(false);
      setbusinesslist(response.brands);
      navigation.navigate('MapListing', {
        businesslist: response.brands,
        latitude: latitude,
        longitude: longitude,
        flag: '2',
      });
    } else {
      setLoding(false);
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
        <TopBar
          left={Images.ic_close}
          style={{left: -10, top: 12, height: 20}}
          iconstyle={{height: 30, width: 30}}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View
              style={{
                margin: '5%',
              }}>
              <Image
                source={Images.logo}
                style={[
                  Style.auth_img_style,
                  {height: HEIGHT / 8, marginTop: 10},
                ]}
                resizeMode="contain"
              />

              <LText
                style={[
                  Style.text14_bold,
                  {
                    marginTop: 0,
                    fontSize: 20,
                    textAlign: 'center',
                  },
                ]}>
                Search by Category
              </LText>

              {validationempty(info) ? (
                <AutoHeightWebView
                  style={{
                    width: '100%',
                    margin: 8,
                  }}
                  source={{
                    html: info,
                  }}
                  viewportContent={'width=device-width, user-scalable=no'}
                />
              ) : null}

              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                }}>
                <MultiSelect
                  hideTags
                  hideSubmitButton={true}
                  single={false}
                  items={catlist}
                  uniqueKey="id"
                  ref={(component) => {
                    multiSelect.current = component;
                  }}
                  fontFamily={CustomeFonts.ComfortaaRegular}
                  itemFontFamily={CustomeFonts.ComfortaaRegular}
                  onSelectedItemsChange={onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Select Categories"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  styleRowList={{
                    fontSize: 12,
                    lineHeight: 20,
                    marginVertical: 3,
                  }}
                  itemFontSize={12}
                  fontSize={12}
                  styleInputGroup={{borderRadius: 18}}
                  styleDropdownMenuSubsection={{
                    // borderBottomWidth: 0,
                    paddingLeft: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    // borderBottomColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderColor: Colors.blue,
                    borderWidth: 1,
                  }}
                  styleTextTag={{fontSize: 12, lineHeight: 18}}
                  tagContainerStyle={{
                    padding: 0,
                    borderRadius: 8,
                    height: 30,
                    borderWidth: 0.6,
                  }}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#000"
                  selectedItemTextColor={Colors.TheamColor2}
                  selectedItemIconColor={Colors.TheamColor2}
                  itemTextColor="#000"
                  displayKey="name"
                  submitButtonColor={Colors.black}
                  submitButtonText="Submit"
                />

                <View style={{marginHorizontal: 10, marginTop: 10}}>
                  {multiSelect.current?.getSelectedItemsExt?.(selectedItems)}
                </View>
              </View>

              <Mybutton
                text="Search"
                onPress={() => {
                  apiCallBusinesslist(selectedItems);
                }}
                style={{marginTop: 20, width: '50%', marginBottom: 40}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  con_brand: {
    paddingHorizontal: 10,
    width: HEIGHT / 11.5,
    height: HEIGHT / 9,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.lg_gray,
  },
  imageThumbnail: {
    width: HEIGHT / 11.5,
    height: HEIGHT / 9,
  },
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
  img_banner: {
    height: HEIGHT / 4.6,
    width: '100%',
    marginTop: '6%',
    borderRadius: 10,
  },
});

export default UserInfo;
