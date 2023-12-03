import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { clickChatIcon, friendIcon, mapIcon } from '../assets/MenuIcons';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

const ChatScreen = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchFriends = async () => {
            const friendListSnapshot = await firestore()
                .collection('friends')
                .doc(currentUser.uid)
                .get();

            const friendIds = friendListSnapshot.data()?.friendsList || [];
            
            // Add logic to fetch chat data based on friendIds
            // This might involve fetching the latest message from each friend or chat room details
        };

        fetchFriends();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={chatList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {/* Navigate to individual chat screen */}}>
                        <Text>{item.chatName}</Text>
                        {/* Display other chat info */}
                    </TouchableOpacity>
                )}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.iconButtonMap}>
                    <Image source={mapIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonChat}>
                    <Image source={clickChatIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FriendListScreen')} style={styles.iconButtonFriend}>
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