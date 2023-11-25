import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUp = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [midName, setMidName] = useState('');
    const [lastName, setLastName] = useState('');

    const nameRegex = /^[A-Za-z\s]+$/;

    const validateInput = (text, setInput) => {
        if (text === '' || nameRegex.test(text)) {
            setInput(text);
        }
    };

    const allFieldsFilled = firstName !== '' && lastName !== '';

    const handleNext = () => {
        // Navigate to the next screen
        navigation.navigate('SignUp2', {
            firstName: firstName,
            midName: midName,
            lastName: lastName,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.text}>Please, enter your real name!</Text>
            <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={(text) => validateInput(text, setFirstName)}
            />

            <TextInput
                style={styles.input}
                placeholder="Middle name (optional)"
                placeholderTextColor="#666"
                value={midName}
                onChangeText={(text) => validateInput(text, setMidName)}
            />

            <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={(text) => validateInput(text, setLastName)}
            />

            <TouchableOpacity
                style={[styles.button, !allFieldsFilled && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={!allFieldsFilled}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#554ccd',
    },
    text: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#554ccd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#554ccd',
        width: '80%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', 
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    roleText: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 10,
    },
});

export default SignUp;
