import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
import {Urls} from '../Common/Urls';

const CountryListView = (props) => {
  const {item, index, navigation, onPress} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomColor: Colors.lg_gray,
        borderBottomWidth: 0.6,
      }}
      onPress={onPress}>
      <Image
        style={{width: 24, height: 24, resizeMode: 'contain'}}
        source={{uri: Urls.imageUrl + item.country_icon}}
      />

      <Text style={[Style.text14, {marginLeft: 5, padding: '2%', flex: 1}]}>
        {item.country_name}
      </Text>
    </TouchableOpacity>
  );
};

export default CountryListView;
