import moment from 'moment';
import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { validationempty } from '../Common/Validations';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
const OpdListView = props => {
    const { item, index, navigation } = props
    return (
        <TouchableOpacity style={[Style.card, { backgroundColor: index % 2 == 0 ? Colors.lightWhite : Colors.gray_d1 }]}
            onPress={() => navigation.navigate('OpdDetails', { item })}>
            <View style={Style.rowView}>
                <Text style={[Style.text18, { padding: '1%', flex: 1, color: Colors.TheamColor2}]}>Invoice Of</Text>
                <Text style={[Style.text18, { padding: '1%', flex: 1, color: Colors.TheamColor2,textAlign:'right'  }]}>{item.bookig_id}</Text>
            </View>
            <View style={Style.rowView}>
                <Text style={[Style.text16, { padding: '1%', flex: 1,}]}>{moment(item.created_at).format('LL')}</Text>
                <Text style={[Style.text16, { padding: '1%', flex: 1,textAlign:'right'}]}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default OpdListView;
