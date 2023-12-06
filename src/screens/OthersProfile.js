import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { defaultAvatar, mapIcon } from '../assets/MenuIcons';
import Interest from '../assets/components/InterestCard';

const OtherProfile = ({ navigation }) => {
    const [profilePicture, setProfilePicture] = useState(defaultAvatar)
    const [name, setName] = useState('Emma Phillips')
    const [faculty, setFaculty] = useState('Computer Science')
    const [selfDesc, setSelfDesc] = useState('saya adalah seorang mahasiswa fakultas ilmu komputer angkatan 2019 dengan program studi informatika')
    const [role, setRole] = useState('Mahasiswa')
    const [email, setEmail] = useState('s21912233@student.unklab.ac.id')
    const [birthdate, setBirthdate] = useState('09 Januari 2000')
    const [religion, setReligion] = useState('Kristen Adven')

    useEffect(()=> {
        setProfilePicture(defaultAvatar)//import disini
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.secContainer}>
                <Image source={profilePicture} style={styles.profilePicture} />
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.faculty}>{faculty}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.selfDesc}>{selfDesc}</Text>
            </View>
            <View style={styles.interest}>
                <Interest interest={'Musik'} icon={mapIcon} />
                <Interest interest={'Game'} icon={mapIcon} />
                <Interest interest={'Traveling'} icon={mapIcon} />
            </View>
            <View style={styles.containerData}>
                <View style={styles.data}>
                    <Image source={mapIcon} style={[{width: 30, height: 30, marginRight: 10}]} />
                    <Text style={[{fontSize: 16}]}>{email}</Text>
                </View>
                <View style={styles.data}>
                    <Image source={mapIcon} style={[{width: 30, height: 30, marginRight: 10}]} />
                    <Text style={[{fontSize: 16}]}>{birthdate}</Text>
                </View>
                <View style={styles.data}>
                    <Image source={mapIcon} style={[{width: 30, height: 30, marginRight: 10}]} />
                    <Text style={[{fontSize: 16}]}>{role}</Text>
                </View>
                <View style={styles.data}>
                    <Image source={mapIcon} style={[{width: 30, height: 30, marginRight: 10}]} />
                    <Text style={[{fontSize: 16}]}>{religion}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    profilePicture:{
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#000000',
        marginRight: 20
    },
    secContainer:{
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    name:{
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000000',
        marginBottom: 4
    },
    faculty: {
        fontWeight: '600'
    },
    selfDesc:{
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#cdcdcd',
        padding: 12,
        borderRadius: 12,
        minHeight: 90
    },
    interest: {
        flexDirection: 'row',
        marginTop: 12
    },
    data: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#cdcdcd',
        paddingVertical: 4,
        alignItems: 'center'
    },
    containerData:{
        marginTop: 12,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: '#cdcdcd'
    }
});

export default OtherProfile;
