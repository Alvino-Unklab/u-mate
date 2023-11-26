import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../services/LocationService';
import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { clickChatIcon, clickFriendIcon, clickMapIcon, friendIcon, mapIcon, chatIcon, MyLocationImage } from '../components/MenuIcons';

const HomePage = ({ route, navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [currentPosition, setCurrentPosition] = useState(null);
    const [friendsLocations, setFriendsLocations] = useState([]);
    const mapRef = useRef(null);
    const [startPosition, setStartPosition] = useState({
        latitude: 1.4181474363920654, 
        longitude: 124.98392047615263,
        latitudeDelta: 0.01,  // Adjust these deltas as needed for zoom level
        longitudeDelta: 0.01,
    });   

    useEffect(() => {
        requestLocationPermission();
        getCurrentPosition();
        const intervalId = setInterval(() => {
            getCurrentPosition();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            // Update location to Firestore
            updateMyLocation(latitude, longitude);
          },
          error => {
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };
      

    const updateMyLocation = async (latitude, longitude) => {
        if (user && user.uid) {
          try {
            await firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                location: new firestore.GeoPoint(latitude, longitude),
                lastLocationUpdate: firestore.FieldValue.serverTimestamp(),
              });
          } catch (error) {
            console.error('Error updating my location:', error);
          }
        }
      };

      const listenToFriendsLocations = () => {
        if (user && user.uid) {
          firestore()
            .collection('friends')
            .doc(user.uid)
            .onSnapshot(snapshot => {
              const friendsList = snapshot.data()?.friendsList || [];
              friendsList.forEach(friendId => {
                firestore()
                  .collection('users')
                  .doc(friendId)
                  .onSnapshot(doc => {
                    const friendData = doc.data();
                    if (friendData && friendData.location) {
                      setFriendsLocations(prev => [
                        ...prev.filter(item => item.id !== friendId),
                        {
                          id: friendId,
                          location: friendData.location,
                          firstName: friendData.firstName,
                          lastName: friendData.lastName
                        },
                      ]);
                    }
                  });
              });
            });
        }
      };
      
      useEffect(() => {
        listenToFriendsLocations();
      }, [user]);
      

    const handleAutoFocus = () => {
        if (currentPosition && mapRef.current) {
            mapRef.current.animateToRegion(currentPosition);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={false}
                ref={mapRef}
                initialRegion={startPosition}
            >
                {currentPosition && (
                    <Marker
                        coordinate={{
                            latitude: currentPosition.latitude,
                            longitude: currentPosition.longitude,
                        }}
                        title="Your Location"
                        description="You are here"
                    />
                )}
                {friendsLocations.map(friend => (
                    <Marker
                    key={friend.id}
                    coordinate={{
                        latitude: friend.location.latitude,
                        longitude: friend.location.longitude,
                    }}
                    title={`${friend.firstName} ${friend.lastName}`}
                    pinColor="green"
                    />
                ))}
            </MapView>

            {/* Tombol gambar di ujung kiri atas */}
            <TouchableOpacity onPress={handleAutoFocus} style={styles.customIconContainer}>
                <Image source={MyLocationImage} style={styles.focusIcon} />
            </TouchableOpacity>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.iconButtonMap}>
                <Image source={clickMapIcon} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={styles.iconButtonChat}>
                <Image source={chatIcon} style={styles.menuIcon} />
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
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    customIconContainer: {
        position: 'absolute',
        top: 60, // Adjust as needed
        left: 13, // Adjust as needed
        backgroundColor: 'rgba(245, 245, 245, 0.5)', // RGBA for semi-transparent background
        borderRadius: 25, // Half of width and height to make it circular
        width: 34, // Set width for the container
        height: 34, // Set height for the container
        justifyContent: 'center', // Center the icon vertically
        alignItems: 'center', // Center the icon horizontally
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
        shadowColor: '#554ccd',
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
    },
    iconButtonMap: {
        marginRight: 50,
        backgroundColor: '#cccccc',
        borderRadius: 10,
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

export default HomePage;
