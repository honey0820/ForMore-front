import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';

const Bottom = ({
    params,
}) => (
    <View style={{backgroundColor:Colors.TheamColor2,borderTopRightRadius:10,borderTopLeftRadius:10}}>
        <Text style={[Style.textInput, { width: '100%', textAlign: 'center',padding:'2%',color:Colors.white }]}>Svasthay Setu @ 2021</Text>
    </View>
);

export default Bottom;
