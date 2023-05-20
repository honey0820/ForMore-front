import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Images from '../Theme/Images';
import Style, {HEIGHT, WIDTH} from '../Theme/Style';
import TopBar from '../Compoment/myTopBar';
import {logout} from '../Common/CommonMethods';
import {showToast} from '../Common/CommonMethods';
import {validationempty} from '../Common/Validations';

const Header = (props) => {
  const {onDrawerClick, navigation, isBack, title, isHome} = props;
  return (
    <View>
      <TopBar
        left={Images.ic_home}
        right={Images.ic_map}
        text={validationempty(title) ? title : ''}
        onPressLeft={() => {
          navigation.popToTop();
          navigation.replace('Home');
          // navigation.navigate('OptionData1');
          // logout(navigation);
        }}
        onPressRight={() => {
          navigation.navigate('MapMarkers');
        }}
      />
    </View>
  );
};

export default Header;
