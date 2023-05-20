import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MainSelection from '../Screens/MainSelection';
import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import OptionData1 from '../Screens/OptionData1';
import OptionData2 from '../Screens/OptionData2';
import Otp from '../Screens/Otp';
import Home from '../Screens/Home';
import AppIntro from '../Screens/AppIntro';
import Userinfo from '../Screens/Userinfo';
import BusinessRating from '../Screens/BusinessRating';
import Questions from '../Screens/Questions';
import DealsList from '../Screens/DealsList';
import BusinessInfo from '../Screens/BusinessInfo';
import SuperCode from '../Screens/SuperCode';
import MyWallet from '../Screens/MyWallet';
import MyReward from '../Screens/MyReward';
import MyRewardMain from '../Screens/MyRewardMain';
import GiftCard from '../Screens/GiftCard';
import SendGiftCard from '../Screens/SendGiftCard';
import SearchMarketplace from '../Screens/SearchMarketplace';
import OrderPage from '../Screens/OrderPage';
import Marketplace from '../Screens/Marketplace';
import AccountSettings from '../Screens/AccountSettings';
import MapMarkers from '../Screens/MapMarkers';
import WebLoad from '../Screens/WebLoad';
import ImageLoad from '../Screens/ImageLoad';
import Uploadreceipt from '../Screens/Uploadreceipt';
import AccountDetail1 from '../Screens/AccountDetail1';
import AccountDetail2 from '../Screens/AccountDetail2';
import AccountDetail3 from '../Screens/AccountDetail3';
import Notification from '../Screens/Notification';
import Referal from '../Screens/Referal';
import ReferBusiness1 from '../Screens/ReferBusiness1';
import ReferBusiness2 from '../Screens/ReferBusiness2';
import ChooseBrand from '../Screens/ChooseBrand';
import ChooseCampaign from '../Screens/ChooseCampaign';
import LotteryInfo from '../Screens/LotteryInfo';
import CampaignPopup from '../Screens/CampaignPopup';
import UpdateMobilenumber from '../Screens/UpdateMobilenumber';
import MapListing from '../Screens/MapListing';
import WebLoadApi from '../Screens/WebLoadApi';
import OtpMobileNumber from '../Screens/OtpMobileNumber';
import EnterCode from '../Screens/EnterCode';
import OrderCheckout from '../Screens/OrderCheckout';
import OrderBooking from '../Screens/OrderBooking';
import SetMapLocation from '../Screens/SetMapLocation';
import CustomSize from '../Screens/CustomSize';
import TransactionHistory from '../Screens/TransactionHistory';
import Tutorial from '../Screens/Tutorial';
import LoyaltyPoints from '../Screens/LoyaltyPoints';
import MenuListing from '../Screens/MenuListing';
import RewardVoucher from '../Screens/RewardVoucher';
import RewardCampaignPopup from '../Screens/RewardCampaignPopup';
import BookingCheckout from '../Screens/BookingCheckout';
import CartRemoveList from '../Screens/CartRemoveList';
import CustomSizeBooking from '../Screens/CustomSizeBooking';
import MyOrders from '../Screens/MyOrders';
import OrderDetails from '../Screens/OrderDetails';
import BusinessOrder from '../Screens/BusinessOrder';
import Appointments from '../Screens/Appointments';
import AppointmentDetails from '../Screens/AppointmentDetails';
import Forgotpassword from '../Screens/Forgotpassword';
import ImageSliderLoad from '../Screens/ImageSliderLoad';
import OtherprogramBrand from '../Screens/OtherprogramBrand';
import OtherProgramAdd from '../Screens/OtherProgramAdd';
import Getintouch from '../Screens/Getintouch';

import CustomeFonts from '../Theme/CustomeFonts';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forgotpassword"
          component={Forgotpassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ImageSliderLoad"
          component={ImageSliderLoad}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainSelection"
          component={MainSelection}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OptionData1"
          component={OptionData1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OptionData2"
          component={OptionData2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="AppIntro"
          component={AppIntro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Tutorial"
          component={Tutorial}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />

        {/* home page */}
        <Stack.Screen
          name="Userinfo"
          component={Userinfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BusinessRating"
          component={BusinessRating}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Questions"
          component={Questions}
          options={{headerShown: false}}
        />
        {/* deals */}
        <Stack.Screen
          name="DealsList"
          component={DealsList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BusinessInfo"
          component={BusinessInfo}
          options={{headerShown: false}}
        />
        {/* super code */}
        <Stack.Screen
          name="SuperCode"
          component={SuperCode}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Uploadreceipt"
          component={Uploadreceipt}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="EnterCode"
          component={EnterCode}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ChooseBrand"
          component={ChooseBrand}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChooseCampaign"
          component={ChooseCampaign}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CampaignPopup"
          component={CampaignPopup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Getintouch"
          component={Getintouch}
          options={{headerShown: false}}
        />

        {/* wallet */}
        <Stack.Screen
          name="MyWallet"
          component={MyWallet}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LotteryInfo"
          component={LotteryInfo}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GiftCard"
          component={GiftCard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SendGiftCard"
          component={SendGiftCard}
          options={{headerShown: false}}
        />

        {/* reward */}
        <Stack.Screen
          name="MyRewardMain"
          component={MyRewardMain}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyReward"
          component={MyReward}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoyaltyPoints"
          component={LoyaltyPoints}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RewardVoucher"
          component={RewardVoucher}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RewardCampaignPopup"
          component={RewardCampaignPopup}
          options={{headerShown: false}}
        />

        {/* webview */}
        <Stack.Screen
          name="WebLoadApi"
          component={WebLoadApi}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WebLoad"
          component={WebLoad}
          options={{
            headerShown: false,
            headerTitleStyle: styles.HeaderTextstyle,
          }}
        />
        <Stack.Screen
          name="ImageLoad"
          component={ImageLoad}
          options={{headerShown: false}}
        />

        {/* settings */}
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettings}
          options={{
            headerShown: false,
            title: 'Account Settings',
            headerTitleStyle: styles.HeaderTextstyle,
          }}
        />

        <Stack.Screen
          name="OtpMobileNumber"
          component={OtpMobileNumber}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="AccountDetail1"
          component={AccountDetail1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AccountDetail2"
          component={AccountDetail2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AccountDetail3"
          component={AccountDetail3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Referal"
          component={Referal}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReferBusiness1"
          component={ReferBusiness1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReferBusiness2"
          component={ReferBusiness2}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="UpdateMobilenumber"
          component={UpdateMobilenumber}
          options={{headerShown: false}}
        />

        {/* market place */}
        <Stack.Screen
          name="SearchMarketplace"
          component={SearchMarketplace}
          options={{
            headerShown: false,
            title: 'Market Place',
            headerTitleStyle: styles.HeaderTextstyle,
          }}
        />

        <Stack.Screen
          name="Marketplace"
          component={Marketplace}
          options={{headerShown: false}}
        />

        {/* map */}
        <Stack.Screen
          name="MapMarkers"
          component={MapMarkers}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MapListing"
          component={MapListing}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MenuListing"
          component={MenuListing}
          options={{headerShown: false}}
        />
        {/* order online */}
        <Stack.Screen
          name="OrderPage"
          component={OrderPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CartRemoveList"
          component={CartRemoveList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomSize"
          component={CustomSize}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SetMapLocation"
          component={SetMapLocation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="OrderCheckout"
          component={OrderCheckout}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MyOrders"
          component={MyOrders}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BusinessOrder"
          component={BusinessOrder}
          options={{headerShown: false}}
        />

        {/* booking */}
        <Stack.Screen
          name="OrderBooking"
          component={OrderBooking}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomSizeBooking"
          component={CustomSizeBooking}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingCheckout"
          component={BookingCheckout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Appointments"
          component={Appointments}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
          options={{headerShown: false}}
        />
        {/* link otgher program */}
        <Stack.Screen
          name="OtherprogramBrand"
          component={OtherprogramBrand}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtherProgramAdd"
          component={OtherProgramAdd}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  HeaderTextstyle: {
    fontFamily: CustomeFonts.ComfortaaBold,
    fontSize: 14,
  },
});

export default App;
