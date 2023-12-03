import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { chatIcon, clickFriendIcon, mapIcon, defaultAvatar } from '../assets/MenuIcons';
import { getAuth } from '@react-native-firebase/auth';

const FriendListScreen = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const currentUser = getAuth().currentUser;

    useEffect(() => {
        if (currentUser) {
            const fetchFriends = async () => {
                try {
                    const friendsCollection = await firestore()
                        .collection('friends')
                        .doc(currentUser.uid)
                        .get();
    
                    if (friendsCollection.exists) {
                        const friendsList = friendsCollection.data().friendsList || [];
                        const friendsSet = new Set(friendsList);
                        const friendsData = [];
    
                        for (const friendId of friendsSet) {
                            const friendDoc = await firestore().collection('users').doc(friendId).get();
                            if (friendDoc.exists) {
                                friendsData.push({
                                    id: friendId,
                                    ...friendDoc.data(), // Spread the friend's data here
                                });
                            }
                        }
    
                        // Create a new Set with the unique IDs
                        const uniqueFriends = Array.from(new Set(friendsData.map(friend => friend.id)))
                            .map(id => {
                                return friendsData.find(friend => friend.id === id);
                            });
    
                        console.log('Unique Friends Data:', uniqueFriends);
                        setFriends(uniqueFriends); // Set the friends state with unique friends
                    }
                } catch (error) {
                    console.error('Error fetching friend list:', error);
                }
            };
    
            fetchFriends();
        }
    }, [currentUser]);
    

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleFriendPress(item)}>
                <View style={styles.friendItemContainer}>
                    <View style={styles.friendAvatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={item.avatar ? { uri: item.avatar } : defaultAvatar}
                        />
                    </View>
                    <View style={styles.friendInfoContainer}>
                        <Text style={styles.nameText}>{`${item.firstName} ${item.lastName}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    

    const handleFriendPress = (friend) => {
        // Lakukan sesuatu ketika teman ditekan, misalnya, navigasi ke halaman profil teman
        // friend adalah objek teman yang ditekan
    };

    const handleAddFriend = () => {
        // Logic to navigate to Add Friend screen
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.searchBar} 
                placeholder="Search Friends"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderItem} // Menggunakan renderFriendsList di sini
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
                <Text style={styles.addButtonText}>Add Friend</Text>
            </TouchableOpacity>

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.iconButtonMap}>
                <Image source={mapIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={styles.iconButtonChat}>
                <Image source={chatIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity  style={styles.iconButtonFriend}>
                <Image source={clickFriendIcon} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 10
    },
    addButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#554ccd',
        padding: 10,
        borderRadius: 5
    },
    addButtonText: { color: 'white' },
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
        borderRadius: 10,
    },
    iconButtonMap: {
        marginRight: 50,
    },
    iconButtonFriend: {
        backgroundColor: '#cccccc',
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
    friendItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1, // Tambahkan border
        borderColor: '#ccc', // Warna border
        borderRadius: 5, // Sudut border
        margin: 10, // Jarak antar daftar teman
        padding: 10, // Padding dalam daftar teman
    },
    friendAvatarContainer: {
        // Gaya untuk kontainer avatar teman
    },
    avatar: {
        // Gaya untuk avatar teman
        width: 50, // Lebar avatar
        height: 50, // Tinggi avatar
        borderRadius: 25, // Agar avatar menjadi lingkaran
        borderWidth: 1, // Tambahkan border pada avatar jika diperlukan
        borderColor: '#000', // Warna border pada avatar jika diperlukan
    },
    friendInfoContainer: {
        marginLeft: 10, // Jarak antara avatar dan info teman
    },
    nameText: {
        // Gaya teks nama teman
    },
});

export default FriendListScreen;
