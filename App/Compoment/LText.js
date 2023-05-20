import React from 'react';
import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';

/*
    input props
    ->style
    ->text
*/

const LText = (props) => {
  const {onPress} = props;
  const {t, i18n} = useTranslation();
  // console.log('Ltext===>', i18n.language);

  if (onPress) {
    return (
      <Text onPress={onPress} style={props.style}>
        {t(props.children)}
      </Text>
    );
  }
  return <Text style={props.style}>{t(props.children)}</Text>;
};

export default LText;
