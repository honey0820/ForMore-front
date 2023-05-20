import React from 'react';
import { View } from 'react-native';

const Row = (props) => {

    const { style } = props;
    const defaultStyle = {
        flexDirection: 'row',
        flex: 1 , 
    };

    return (
        <View style={[defaultStyle, style]}>{props.children}</View>
    );
}
export default Row;