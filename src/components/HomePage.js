import React, { useEffect, useState } from 'react'; // Import useEffect
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../services/LocationService'; 

const HomePage = ({ route, navigation }) => {
    const { userEmail } = route.params;
    const auth = getAuth();
    const user = auth.currentUser;
    const [currentPosition, setCurrentPosition] = useState();
    
    useEffect(() => {
        getLocation()
        requestLocationPermission();
    }, []);

    const getLocation = () => {
        try {
            const subscriber = firestore()
                .collection('location')
                .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                console.log(data[0].longitude, data[0].latitude); // Process data as required
                setCurrentPosition({
                    longitude: data[0].longitude,
                    latitude: data[0].latitude
                })
                });

            // Unsubscribe from events when no longer in use
            return () => subscriber();

            console.log('data', data)
        } catch (error) {
            console.log(error)  
        }
    }

    const postLocation = (latitude, longitude) => {
        try {
            firestore()
            .collection('users')
            .doc(user.uid)
            .update({
                lastLocation: {
                    latitude: latitude,
                    longitude: longitude
                }
            })    

            firestore()
            .collection('location')
            .doc(user.uid)
            .update({
                lastLocation: {
                    latitude: latitude,
                    longitude: longitude
                }
            })
        } catch (error) {
            console.log('error post location',error)
        }
    }

    const getCurrentPosition = () => {
        Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                try {
                    postLocation(latitude, longitude)
                    getLocation()
                    console.log('berhasil')
                } catch (error) {
                    console.log(error)
                }
            },
            error => {
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        );
    };

    const handleSignOut = () => {
        if (user) {
            firestore()
                .collection('users')
                .doc(user.uid)
                .update({ 
                    isActive: false,
                    lastActive: firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    // Firestore update successful, now sign out from Firebase Authentication
                    return signOut(auth);
                })
                .then(() => {
                    // Sign out successful, navigate back to the login screen
                    navigation.navigate('LogIn');
                })
                .catch((error) => {
                    console.error('Error during sign out: ', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <MapView 
            style={styles.map} 
            region={currentPosition} // Set region to currentPosition
            showsUserLocation={true}>
                {currentPosition ? (
                    <Marker
                    coordinate={{ latitude: currentPosition.latitude, longitude: currentPosition.longitude }}
                    title={"Marker Title"}
                    description={"Marker Description"}
                    />
                ) :
                (
                    <></>
                )
            }
                
            </MapView>

            {/* <View style={styles.overlay}>
                <Text style={styles.welcomeText}>Welcome {userEmail}</Text>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View> */}
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
    },
});

export default HomePage;
