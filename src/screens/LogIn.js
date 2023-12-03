import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LogIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginEnabled, setIsLoginEnabled] = useState(false);
    const [inputBorderColor, setInputBorderColor] = useState('#554ccd');
    const [errorMessage, setErrorMessage] = useState('');

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            setErrorMessage('Invalid email format.');
            setInputBorderColor('red');
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Menghapus pengecekan dan pengaturan isActive
            navigation.navigate('HomePage', { userEmail: userCredential.user.email });
        } catch (error) {
            let message;
            switch (error.code) {
                case 'auth/too-many-requests':
                    message = 'Too many attempt. Try again later or contact administrator';
                    break;
                case 'auth/user-disabled':
                    message = 'This email has been disabled by an administrator, please contact administrator';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    message = 'Invalid email or password.';
                    break;
                default:
                    message = 'Login failed. Please try again.';
            }
            setErrorMessage(message);
            setInputBorderColor('red');
        }
    };

    const checkLoginEnabled = () => {
        setIsLoginEnabled(email.length > 0 && password.length > 0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>U-Mate</Text>
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor }]}
                placeholder="Email"
                onChangeText={(text) => {
                    setEmail(text);
                    setErrorMessage('');
                    setInputBorderColor('#554ccd');
                }}
                onEndEditing={checkLoginEnabled}
            />
            <TextInput
                style={[styles.input, { borderColor: inputBorderColor }]}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => {
                    setPassword(text);
                    setErrorMessage('');
                    setInputBorderColor('#554ccd');
                }}
                onEndEditing={checkLoginEnabled}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <TouchableOpacity
                style={[styles.button, !isLoginEnabled && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={!isLoginEnabled}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserName')}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text
                style={styles.forgotPassword}
                onPress={() => {/* Navigate to Forgot Password screen */}}
            >
                Forgot Password?
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        fontSize: 10,
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
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
        marginBottom: 20,
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
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#554ccd',
        marginBottom: 10,
    },
});

export default LogIn;
