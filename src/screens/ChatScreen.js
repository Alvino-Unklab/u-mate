import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { clickChatIcon, clickFriendIcon, clickMapIcon, friendIcon, mapIcon, chatIcon, MyLocationImage } from '../components/MenuIcons';

const ChatScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>


            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.iconButtonMap}>
                <Image source={mapIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonChat}>
                <Image source={clickChatIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                <Image source={friendIcon} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    focusIcon: {
        width: 34,
        height: 34,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#554CCD',
        marginHorizontal: 85,
        marginBottom: -1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuIcon:{
        width: 40,
        height: 40,
    },
    iconButtonChat: {
        marginRight: 50,
        backgroundColor: '#cccccc',
        borderRadius: 10,
    },
    iconButtonMap: {
        marginRight: 50,
    },
    iconButtonFriend: {
    },
    notificationBubble: {
        // Style for the notification bubble
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: 'red',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        // Style for the notification number
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
