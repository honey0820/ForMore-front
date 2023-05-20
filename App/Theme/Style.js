import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';
import CustomeFonts from './CustomeFonts';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

const Style = StyleSheet.create({
  // customfontStyle: `* { font-family: 'Times New Roman'; }`,
  customfontStyle: {
    fontFamily: 'Times New Roman',
  },
  cointainer: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  container1: {
    width: '70%',
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container2: {
    width: WIDTH - 50,
    flexGrow: 1,
    alignSelf: 'center',
  },
  textInput: {
    fontFamily: CustomeFonts.ComfortaaRegular,
    fontSize: 14,
    color: Colors.black,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  auth_img_back_style: {
    // flex: 1,
    // width: null,
    // height: null,
    resizeMode: 'cover',
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingBottom: '6%',
  },
  
  auth_img_back_style1: {
    flex: 1,
    width: null,
    height: null,
  },
  auth_img_style: {
    alignSelf: 'center',
    height: HEIGHT / 5,
    marginVertical: 10,
    width: '100%',
  },
  chk_style1: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  textInputView: {
    width: '100%',
    height: 45,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: Colors.lg_gray,
  },
  buttonStyle: {
    backgroundColor: Colors.TheamColor2,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 55,
    marginTop: 15,
    paddingVertical: '2%',
    width: '60%',
    overflow: 'visible',
    alignSelf: 'center',
  },
  text20: {
    fontSize: 20,
    color: Colors.black,
    letterSpacing: 1.5,
    textAlign: 'center',
    fontFamily: CustomeFonts.PoppinsBold,
  },
  text18: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text14: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text14_bold: {
    fontSize: 14,
    color: Colors.blue,
    marginTop: 5,
    letterSpacing: 1,
    fontFamily: CustomeFonts.ComfortaaBold,
  },
  text12: {
    fontSize: 12,
    marginTop: Platform.OS == 'ios' ? 4 : 0,
    color: Colors.black,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text13: {
    fontSize: 13,
    marginTop: Platform.OS == 'ios' ? 4 : 0,
    color: Colors.black,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text11: {
    fontSize: 11,
    color: Colors.gray,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text10: {
    fontSize: 10,
    color: Colors.gray,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text8: {
    fontSize: 8,
    color: Colors.gray,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },
  text16: {
    fontSize: 16,
    textAlignVertical: 'center',
    color: Colors.black,
    fontFamily: CustomeFonts.ComfortaaRegular,
  },

  divider: {
    borderWidth: 0.4,
    marginTop: 4,
    borderColor: Colors.lg_gray,
  },
  card: {
    padding: '10%',
    marginVertical: '5%',
    borderRadius: 10,
    justifyContent: 'flex-start',
    borderWidth: 0.8,
  },
});
export default Style;
