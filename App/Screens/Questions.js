import React, {useEffect, useState} from 'react';
import {
  Linking,
  FlatList,
  View,
  Image,
  TextInput,
  Text,
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
import {CheckBox, AirbnbRating, RatingProps} from 'react-native-elements';
import Header from '../Compoment/Header';
import {validationempty} from '../Common/Validations';
import {showToast} from '../Common/CommonMethods';
import {Helper} from '../Common/Helper';
import {LocalData, Urls} from '../Common/Urls';
import Loader from '../Compoment/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color} from 'react-native-reanimated';

var msg;
const Questionscreen = ({navigation, route}) => {
  const {code} = route.params;
  const [username, setUserName] = useState('');
  const [visible, setvisible] = useState(false);
  const [loding, setLoding] = useState(false);
  const [range, setrange] = React.useState([0]);
  const [qno, setqno] = useState(0);
  const [rating, setrating] = useState('');
  const [value, setValue] = useState('');
  const [questionall, setquestionall] = useState([]);
  const [addcomment, setaddcomment] = useState('');
  const [popupvisible, setpopupvisible] = useState(false);

  const [hints2, setHint2] = useState([
    {
      text: 'It was not effective, I didn’t see the results I wanted',
      key: '31',
      status: false,
    },
    {text: 'I have another account ', key: '32', status: false},
    {text: 'This was a test account ', key: '33', status: false},
    {text: 'It was dificult to use ', key: '34', status: false},
    {text: 'It’s too expensive ', key: '35', status: false},
  ]);

  useEffect(() => {
    setqno(0);
    setrating('');
    setValue('');
    setrange([0]);
    apiCall();
  }, []);

  const apiCall = async () => {
    var id = await AsyncStorage.getItem('id');
    var lang_id = (await AsyncStorage.getItem('lang_id')) + '';

    setLoding(true);
    var formdata = new FormData();
    formdata.append('user_id', id + '');
    formdata.append('code', code + '');
    console.log('formdata is: ', formdata);
    var response = await Helper.POST(Urls.questions_get, formdata);
    setLoding(false);
    console.log('questions_get is: ', response);
    if (response.status == 200) {
      setquestionall(response.question);
      if (lang_id == '1') {
        msg = response.question[0].msg_eng;
      }
      if (lang_id == '2') {
        msg = response.question[0].msg_albanian;
      }
      if (lang_id == '3') {
        msg = response.question[0].msg_greek;
      }
      if (lang_id == '4') {
        msg = response.question[0].msg_italian;
      }
    } else {
      showToast(response.Message, 'error');
    }
  };

  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
    setrating(rating);
  };

  const _next = async () => {
    setLoding(true);
    apiCallsubmit();
  };

  const apiCallsubmit = async () => {
    var id = await AsyncStorage.getItem('id');

    if (qno <= questionall.length) {
      var formdata = new FormData();
      formdata.append('comments', addcomment + '');
      formdata.append('user_id', id + '');
      formdata.append('rating_ans', rating + '');
      formdata.append('select_ans', value + '');
      formdata.append('range_ans', range + '');
      formdata.append('question_id', questionall[qno].id + '');
      var response = await Helper.POST(Urls.question_answers_add, formdata);
      setLoding(false);
      console.log('question_answers_add == >', response);
      if (response.success == true) {
        var qr = qno;
        if (qno + 1 < questionall.length) {
          setqno(qr + 1);
          setrating('');
          setValue('');
          setrange([0]);
        } else {
          setpopupvisible(true);
          // showToast(msg + '', 'success');
          // navigation.popToTop();
          // navigation.replace('Home');
        }
      } else {
        showToast(response.message, 'error');
      }
    } else {
      setLoding(false);
      showToast(response.message, 'success');
      navigation.popToTop();
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <CustomStatusBar hidden={false} />
      <ImageBackground
        // source={Images.back_auth}
        style={[
          Style.auth_img_back_style,
          {backgroundColor: Colors.TheamColor2},
        ]}>
        <Header navigation={navigation} />

        <Loader loading={loding} />

        <View style={{flex: 1}}>
          <Image
            source={Images.logo_white}
            style={[Style.auth_img_style, {height: HEIGHT / 8, marginTop: 20}]}
            resizeMode="contain"
          />

          {validationempty(questionall) ? (
            <ScrollView>
              <View>
                <Card
                  containerStyle={{
                    borderWidth: 0.8,
                    borderRadius: 25,
                    marginHorizontal: '10%',
                    paddingHorizontal: 20,
                    marginBottom: 20,
                  }}>
                  <LText
                    style={[
                      Style.text16,
                      {
                        color: Colors.black,
                        fontFamily: CustomeFonts.ComfortaaBold,
                      },
                    ]}>
                    {questionall[qno].name}
                  </LText>

                  {questionall[qno].ans_type == 'ratings' ? (
                    <View
                      style={{
                        paddingTop: 15,
                        justifyContent: 'flex-start',
                        alignSelf: 'flex-start',
                      }}>
                      <AirbnbRating
                        type="custom"
                        showRating={false}
                        size={20}
                        selectedColor="#3498db"
                        defaultRating={0}
                        count={5}
                        imageSize={22}
                        onFinishRating={ratingCompleted}
                        containerStyle={{
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                        }}
                      />
                    </View>
                  ) : (
                    <View>
                      {questionall[qno].ans_type == 'select' ? (
                        <View>
                          <RadioButton.Group
                            onValueChange={(newValue) => {
                              setValue(newValue);
                            }}
                            value={value}>
                            <View style={Style.rowView}>
                              <View style={[Style.rowView, {width: '33%'}]}>
                                <RadioButton
                                  value="Yes"
                                  color={Colors.TheamColor2}
                                  uncheckedColor={Colors.gray}
                                />
                                <Text
                                  style={[
                                    Style.text14,
                                    {
                                      flex: 1,
                                      paddingVertical: '3%',
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  Yes
                                </Text>
                              </View>

                              <View style={[Style.rowView, {width: '33%'}]}>
                                <RadioButton
                                  value="No"
                                  color={Colors.TheamColor2}
                                  uncheckedColor={Colors.gray}
                                />
                                <Text
                                  style={[
                                    Style.text14,
                                    {
                                      flex: 1,
                                      paddingVertical: '3%',
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  No
                                </Text>
                              </View>
                            </View>
                          </RadioButton.Group>
                        </View>
                      ) : (
                        <View style={{marginTop: 5}}>
                          <MultiSlider
                            selectedStyle={{
                              backgroundColor: Colors.blue,
                            }}
                            markerStyle={{
                              backgroundColor: Colors.TheamColor2,
                              height: 15,
                              width: 15,
                            }}
                            unselectedStyle={{
                              backgroundColor: Colors.lg_gray,
                            }}
                            containerStyle={{
                              height: 40,
                            }}
                            trackStyle={{
                              height: 8,
                              backgroundColor: 'red',
                            }}
                            touchDimensions={{
                              height: 40,
                              width: 40,
                              borderRadius: 20,
                              slipDisplacement: 40,
                            }}
                            min={0}
                            max={10}
                            values={range}
                            sliderLength={WIDTH / 1.5}
                            onValuesChange={(newValue) => {
                              console.log('newValue', newValue);
                              setrange(newValue);
                            }}
                          />

                          <Text
                            style={[
                              Style.text14_bold,
                              {marginTop: 0, textAlign: 'center'},
                            ]}>
                            Selected value : {range}
                          </Text>
                        </View>

                        // <FlatList
                        //   showsVerticalScrollIndicator={false}
                        //   data={questionall[qno].options}
                        //   style={{marginTop: 15}}
                        //   renderItem={({item, index}) => (
                        //     <View>
                        //       <View
                        //         style={{
                        //           marginTop: 10,
                        //           flex: 1,
                        //           flexDirection: 'row',
                        //         }}>
                        //         <CheckBox
                        //           checked={checked.includes(index)}
                        //           onPress={() => {
                        //             const newIds = [...checked];
                        //             const index = newIds.indexOf(item.key);
                        //             if (index > -1) {
                        //               newIds.splice(index, 1);
                        //             } else {
                        //               newIds.push(item.key);
                        //             }
                        //             setChecked(newIds);
                        //           }}
                        //           iconType="font-awesome"
                        //           checkedIcon="check-square"
                        //           uncheckedIcon="square-o"
                        //           containerStyle={Style.chk_style1}
                        //         />
                        //         <Text
                        //           style={[
                        //             {
                        //               flex: 1,
                        //               fontSize: 14,
                        //               color: '#34405E',
                        //               fontFamily: CustomeFonts.Poppins_Regular,
                        //               marginLeft: 4,
                        //               textAlignVertical: 'center',
                        //             },
                        //           ]}>
                        //           {questionall[qno].options[index]}
                        //         </Text>
                        //       </View>
                        //     </View>
                        //   )}
                        //   extraData={checked}
                        //   keyExtractor={(item, index) => index.toString()}
                        // />
                      )}
                    </View>
                  )}

                  {qno == questionall.length - 1 ? (
                    <View>
                      <TextInput
                        style={[Style.textInputView, {marginTop: 15}]}
                        onChangeText={(text) => setaddcomment(text)}
                        placeholderTextColor={Colors.gray_d1}
                        value={addcomment}
                        placeholder={'Add Your Comments'}
                        multiline={true}
                        numberOfLines={3}
                        selectionColor={Colors.TheamColor2}
                      />
                    </View>
                  ) : null}

                  <Button
                    text="SEND"
                    onPress={() => {
                      _next();
                    }}
                    style={{marginTop: 20, width: '100%'}}
                  />
                </Card>
              </View>
            </ScrollView>
          ) : null}

          <View
            style={{
              zIndex: 1,
              bottom: 0,
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: '8%',
              position: 'absolute',
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
        </View>

        {popupvisible ? (
          <ImageBackground
            source={Images.back_auth}
            style={[
              Style.auth_img_back_style,
              {backgroundColor: Colors.TheamColor2},
            ]}>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.TheamColor2,
                justifyContent: 'center',
              }}>
              <Image
                source={Images.logo_white}
                style={[
                  Style.auth_img_style,
                  {height: HEIGHT / 8, marginBottom: '10%'},
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  Style.text18,
                  {
                    color: Colors.white,
                    fontSize: 30,
                    lineHeight: 34,
                    marginBottom: '5%',
                    marginHorizontal: 20,
                  },
                ]}>
                {msg}
              </Text>

              {/* <View
                style={{
                  zIndex: 1,
                  top: -25,
                  right: -20,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginRight: '2%',
                  marginTop: '2%',
                  position: 'absolute',
                }}>
                <TouchableOpacity
                  onPressIn={() => {
                    // setpopupvisible(false);
                    navigation.popToTop();
                    navigation.replace('Home');
                  }}>
                  <Image
                    source={Images.ic_close}
                    style={{tintColor: Colors.blue, height: 30, width: 30}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View> */}
            </View>
          </ImageBackground>
        ) : null}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Questionscreen;

// -Max Questions 10
// -Are three types/format  of each question

// 1. Yes or No (select)
// 2. Scoring 1 up to 10 (can be any value up to 10) - (range)
// 3. Rating with stars 5 (ratings)
