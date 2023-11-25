import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SignUp2 = ({ route, navigation }) => {
    const { firstName, midName, lastName } = route.params;
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [domainError, setDomainError] = useState(false);

    useEffect(() => {
        const preFillId = email.split('@')[0];
        setUserId(preFillId);
    }, [email]);

    const checkEmailExists = async (inputEmail) => {
        try {
            setIsCheckingEmail(true);
            const querySnapshot = await firestore()
                .collection('users')
                .where('email', '==', inputEmail)
                .get();

            const isEmailExists = !querySnapshot.empty;
            setEmailError(isEmailExists);
            setEmailChecked(true); // Set this to true here
        } catch (error) {
            console.error('Error checking email:', error);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        setEmailError(false); // Reset email registered error
        setDomainError(false); // Reset domain error
    
        // Check for valid email domains and set role accordingly
        if (text.endsWith('@unklab.ac.id')) {
            setRole('Lecturer');
        } else if (text.endsWith('@student.unklab.ac.id')) {
            setRole('Student');
        } else {
            setRole('');
            setEmailChecked(false); // Reset emailChecked when domain is not valid
            if (text.length > 0) {
                setDomainError(true); // Set domain error if email domain is not valid
            }
        }
    
        if (emailCheckTimeout) {
            clearTimeout(emailCheckTimeout);
        }
    
        setEmailCheckTimeout(setTimeout(() => {
            if (text.length > 0) {
                checkEmailExists(text);
            } else {
                setEmailChecked(false); // Reset emailChecked when text is empty
            }
        }, 1000)); // Delay email check
    };
    


    const handleNext = () => {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@(student\.unklab\.ac\.id|unklab\.ac\.id)$/;
        const isValidEmail = emailRegex.test(email);
    
        // Password validation regex
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const isValidPassword = passwordRegex.test(password);
        
        if (!isValidEmail || isCheckingEmail) {
            return; // Stop further processing if email is invalid or still checking
        }
    
        // Check if password length is at least 8 characters
        if (!isValidPassword) {
            setPasswordError('Password must be at least 8 characters long and include both letters and numbers');
            return; // Stop further processing if password is not valid
        }
    
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return; // Stop further processing if passwords don't match
        }
    
        navigation.navigate('SignUp3', {
            firstName: firstName,
            midName: midName,
            lastName: lastName,
            email: email,
            userId: userId,
            password: password,
            role: role,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello, {firstName} {lastName} </Text>
            {emailError && <Text style={styles.smallErrorText}>Email already registered</Text>}
            {domainError && <Text style={styles.smallErrorText}>Please use a valid lecturer/student email</Text>}

            <TextInput
                style={[
                    styles.input,
                    (emailError || domainError) ? styles.errorInput : emailChecked ? styles.successInput : null
                ]}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={handleEmailChange}
            />
            <TextInput
                style={[styles.input, passwordError ? styles.errorInput : null]}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(false); // Reset error on input change
                }}
            />
            <TextInput
                style={[styles.input, passwordError ? styles.errorInput : null]}
                placeholder="Re-type Password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />
            {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={handleNext}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    errorText:{
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 20,
        alignItems: 'center',
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
    errorInput: {
        borderColor: 'red', // Color for registered email
    },
    successInput: {
        borderColor: 'green', // Color for unique email
    },
    smallErrorText: {
        fontSize: 12,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
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

export default SignUp2;
