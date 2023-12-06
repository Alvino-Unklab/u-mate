import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { mapIcon } from '../MenuIcons';

const Interest = ({interest, icon}) => {
    return (
        <View style={styles.container}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.text}>{interest}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        paddingRight: 8,
        borderWidth: 1,
        borderColor: '#cdcdcd',
        borderRadius: 16,
        writingDirection: 'auto',
        marginRight: 4
    },
    icon: {
        width: 20,
        height: 20
    },
    text: {
        color: '#000000',
        marginLeft: 4
    }
})

export default Interest