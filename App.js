/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import Route from './App/Navigation/Route';
import CustomeFonts from './App/Theme/CustomeFonts';
import Colors from './App/Theme/Colors';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreAllLogs(); //Ignore all log notifications
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const toastConfig = {
  success: (props) => (
    <SafeAreaView>
    <BaseToast
      {...props}
      style={[styles.tst_style, {borderLeftColor: 'green'}]}
      contentContainerStyle={styles.con_style}
      text1NumberOfLines={2}
      text1Style={styles.txt_style}
      renderTrailingIcon={() => (
        <Ionicons
          name={'close'}
          color={'#3d3d3d'}
          style={styles.ic_style}
          size={20}
          onPress={() => {
            Toast.hide();
          }}
        />
      )}
    />
    </SafeAreaView>
  ),

  error: (props) => (
    <SafeAreaView>
    <ErrorToast
      {...props}
      style={[styles.tst_style, {borderLeftColor: Colors.TheamColor2}]}
      contentContainerStyle={styles.con_style}
      text1NumberOfLines={2}
      text1Style={styles.txt_style}
      renderTrailingIcon={() => (
        <Ionicons
          name={'close'}
          color={'#3d3d3d'}
          style={styles.ic_style}
          size={20}
          onPress={() => {
            Toast.hide();
          }}
        />
      )}
    />
    </SafeAreaView>
  ),

  info: (props) => (
    <SafeAreaView>
    <InfoToast
      {...props}
      style={[styles.tst_style, {borderLeftColor: Colors.blue}]}
      contentContainerStyle={styles.con_style}
      text1NumberOfLines={2}
      text1Style={styles.txt_style}
      renderTrailingIcon={() => (
        <Ionicons
          name={'close'}
          color={'#3d3d3d'}
          style={styles.ic_style}
          size={20}
          onPress={() => {
            Toast.hide();
          }}
        />
      )}
    />
    </SafeAreaView>
  ),
};

const styles = StyleSheet.create({
  ic_style: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 6,
  },
  con_style: {
    paddingLeft: 10,
    paddingRight: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  txt_style: {
    fontSize: 13,
    lineHeight: 15,
  },
  tst_style: {
    borderRightColor: Colors.lg_gray,
    borderRightWidth: 0.5,
    borderTopColor: Colors.lg_gray,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lg_gray,
  },
});

const App = (navigation) => {
  return (
    <SafeAreaProvider>
      <Route />
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaProvider>
  );
};

export default App;
