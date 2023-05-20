import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet, Linking,
    PermissionsAndroid,
    TouchableOpacity,
    ScrollView,
    TouchableNativeFeedback,
    View,
    Dimensions,
    Image,
    Text,
    useWindowDimensions,
    ImageBackground,
} from 'react-native';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import CustomStatusBar from '../Compoment/CustomStatusBar';
import TopBar from '../Compoment/myTopBar';
import LText from '../Compoment/LText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Helper } from '../Common/Helper';
import { LocalData, Urls } from '../Common/Urls';
import Loader from '../Compoment/Loader';
import { validationempty } from '../Common/Validations';
import { showToast, NoData } from '../Common/CommonMethods';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightWebView from 'react-native-autoheight-webview';

const DealList = ({ navigation, route }) => {

    const [loding, setLoding] = useState(false);
    const [channels, setchannels] = useState([]);
    const [contact, setcontact] = useState([]);

    useEffect(() => {
        apiCall();
    }, []);

    const apiCall = async () => {
        var residence_country_id = await AsyncStorage.getItem('residence_country_id');
        setLoding(true);

        console.log(Urls.social_media_link + "/" + residence_country_id);
        var response = await Helper.GET(Urls.social_media_link + "/" + residence_country_id);
        console.log(response);
        if (response.status == 200) {
            setLoding(false);
            setchannels(response.channels);
            setcontact(response.contact);

        } else {
            setLoding(false);
            showToast(response.Message, 'error');
        }
    };


    return (
        <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
            <CustomStatusBar hidden={false} />
            <ImageBackground
                source={Images.back_auth}
                style={Style.auth_img_back_style1}>
                <Loader loading={loding} />
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.white,
                        margin: '5%',
                        borderRadius: 18,
                        borderWidth: 0.8,
                        borderColor: Colors.lg_gray,
                        paddingHorizontal: 10,
                        paddingBottom: 10,
                    }}>
                    <TopBar
                        left={Images.ic_close}
                        style={{ left: -40, top: -5, height: 20 }}
                        iconstyle={{ height: 30, width: 30 }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                    />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View>
                            <View
                                style={{
                                    flexGrow: 1,
                                }}>

                                <LText
                                    style={[
                                        Style.text14_bold,
                                        {
                                            color: Colors.TheamColor2,
                                            fontSize: 20,
                                            textAlign: 'center',
                                        },
                                    ]}>
                                    Get in touch
                                </LText>

                                <LText
                                    style={[
                                        Style.text14_bold,
                                        {
                                            fontSize: 16, marginVertical: 6, marginTop: 10,
                                            textAlign: 'center',
                                        },
                                    ]}>
                                    Contact us
                                </LText>

                                <FlatList
                                    data={contact}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1 / 3, marginBottom: 10 }}>
                                            <TouchableOpacity style={styles.con_brand}
                                                onPress={() => { Linking.openURL(item.url); }}>
                                                <Image
                                                    style={{ height: WIDTH / 4, width: '100%' }}
                                                    source={
                                                        validationempty(item.media_icon)
                                                            ? { uri: Urls.imageUrl + item.media_icon }
                                                            : Images.ic_placeholder
                                                    }
                                                    resizeMode={'center'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    numColumns={4}
                                    keyExtractor={(item, index) => index.toString()}
                                // ListEmptyComponent={<NoData />}
                                />

                                <LText
                                    style={[
                                        Style.text14_bold,
                                        {
                                            fontSize: 16, marginBottom: 6, marginTop: 10,
                                            textAlign: 'center',
                                        },
                                    ]}>
                                    Visit us
                                </LText>

                                <FlatList
                                    data={channels}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1 / 3, marginBottom: 10 }}>
                                            <TouchableOpacity style={styles.con_brand}
                                                onPress={() => { Linking.openURL(item.url); }}>
                                                <Image
                                                    style={{ height: WIDTH / 4, width: '100%' }}
                                                    source={
                                                        validationempty(item.media_icon)
                                                            ? { uri: Urls.imageUrl + item.media_icon }
                                                            : Images.ic_placeholder
                                                    }
                                                    resizeMode={'center'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    numColumns={4}
                                    keyExtractor={(item, index) => index.toString()}
                                // ListEmptyComponent={<NoData />}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    con_brand: {
        marginHorizontal: 4,
        flexDirection: 'column',
        borderWidth: 0.8,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderColor: Colors.lg_gray,
        flex: 1 / 3,
    },
});

export default DealList;
