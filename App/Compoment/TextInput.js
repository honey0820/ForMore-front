import React from 'react';
import {Text, View} from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import {TextInput} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {validationempty} from '../Common/Validations';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

const CustomTextInput = (props) => {
  const {
    style,
    onChangeText,
    onFocus,
    returnKeyType,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    iconName,
    iconType,
    autoCapitalize,
    iconNamel,
    iconTypel,
    onSubmitEditing,
    editable,
    title,
    maxLength,
    numberOfLines,
    ref,
    caretHidden,
    iconPress,
    iconPressl,
    underlineColor,
    ...attrs
  } = props;

  return (
    <View style={[style, {marginVertical: 5}]}>
      <TextInput
        ref={ref}
        caretHidden={caretHidden}
        onSubmitEditing={onSubmitEditing}
        style={{
          width: '100%',
          fontSize: 14,
          paddingVertical: 0,
          paddingHorizontal: 0,
          fontFamily: CustomeFonts.BrownPro,
          backgroundColor: 'transparent',
          height: 30,
        }}
        underlineColor={
          validationempty(underlineColor) ? underlineColor : Colors.lg_gray
        }
        mode="flat"
        label={validationempty(title) ? title : ''}
        value={value}
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
        multiline={multiline}
        editable={editable}
        numberOfLines={numberOfLines}
        returnKeyType={validationempty(returnKeyType) ? returnKeyType : ''}
        placeholder={validationempty(placeholder) ? placeholder : ''}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        keyboardType={keyboardType}
        // theme={theme}
        theme={{
          fonts: {
            regular: {
              fontFamily: 'Comfortaa-Regular',
            },
          },
          colors: {
            text: Colors.lightblack,
            primary: Colors.blue,
          },
        }}
        right={
          validationempty(iconName) ? (
            <TextInput.Icon
              name={iconName}
              onPress={iconPress}
              color={Colors.blue}
            />
          ) : null
        }
        left={
          validationempty(iconNamel) ? (
            <TextInput.Icon
              name={iconNamel}
              style={{marginRight: 20}}
              onPress={iconPressl}
              color={Colors.blue}
            />
          ) : null
        }
        attrs></TextInput>
    </View>
  );
};

export default CustomTextInput;
