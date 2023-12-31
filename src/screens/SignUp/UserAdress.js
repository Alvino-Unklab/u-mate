import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserAdress = ({route, navigation}) => {
  const { firstName, midName, lastName, email, password, role } = route.params;
  const [residence, setResidence] = useState('Residence');
  const [faculty, setFaculty] = useState('Faculty');
  const [birthdate, setBirthdate] = useState(new Date()); 
  const [gender, setGender] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAgeValid, setIsAgeValid] = useState(true);
  const [isResidenceValid, setIsResidenceValid] = useState(false);
  const [isFacultyValid, setIsFacultyValid] = useState(false);

  const residences = ['Residence', 'Outsider', 'GuestHouse', 'Jasmine', 'Crystal', 'Edelweis', 'Annex', 'Boungeville', 'Genset',];
  const faculties = ['Faculties', 'ASMI', 'FILKOM', 'FKEP', 'FEB', 'Filsafat', 'Pertanian', 'M. Manajemen', 'M. Teologi', 'Profesi Ners'];
  const isButtonEnabled = isAgeValid && isResidenceValid && isFacultyValid && gender !== null;

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios'); 
    setBirthdate(currentDate);

    const age = calculateAge(currentDate);
    if (age < 16){
      setIsAgeValid(false);
    } else {
      setIsAgeValid(true);
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleCreateAccount = async () => {
    if (!isButtonEnabled) {
      // You can show an error message if needed
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userData = {
        firstName,
        midName,
        lastName,
        email,
        userId: userCredential.user.uid,
        password,
        role,
        age: calculateAge(birthdate),
        birthdate: birthdate.toISOString(),
        residence,
        faculty,
        gender
      };
      
      await firestore().collection('users').doc(userCredential.user.uid).set(userData);
      console.log('User account created and data stored in Firestore');
      userCredential.user.sendEmailVerification();
      navigation.navigate('LogIn'); // Replace 'NextScreen' with the actual next screen name
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{firstName} {lastName} </Text>
      <Text style={styles.text}>Please, choose correctly!</Text>

      {/* Birthdate Picker */} 
      <Text>Birthdate (You are {calculateAge(birthdate)} years old now)</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{formatDate(birthdate)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DatePicker
          value={birthdate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}      

      {/* Residence Picker */}
      <Text style={styles.text2}>Residence</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={residence}
          onValueChange={(itemValue, itemIndex) => {
            setResidence(itemValue);
            setIsResidenceValid(itemValue !== 'Residence');
          }}
          style={styles.picker}
        >
          {residences.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>

      {/* Faculty Picker */}
      <Text style={styles.text2}>Faculty of</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={faculty}
          onValueChange={(itemValue, itemIndex) => {
            setFaculty(itemValue);
            setIsFacultyValid(itemValue !== 'Faculty');
          }}
          style={styles.picker}
        >
          {faculties.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>

      {/* Gender Selection */}
      <Text style={styles.text2}>Gender</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity onPress={() => setGender('male')} style={styles.genderButton}>
          <Text style={styles.genderText}>Male</Text>
          <View style={[styles.radioButton, gender === 'male' ? styles.selectedRadioButton : null]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('female')} style={styles.genderButton}>
          <Text style={styles.genderText}>Female</Text>
          <View style={[styles.radioButton, gender === 'female' ? styles.selectedRadioButton : null]} />
        </TouchableOpacity>
      </View>

      {!isAgeValid && (
        <Text style={styles.errorText}>Umur kamu harus lebih dari 16 Tahun</Text>
      )}

      {/* Create Account */}
      <TouchableOpacity style={[styles.Button, !isButtonEnabled && styles.disabledButton]}
        onPress={handleCreateAccount}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.ButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#554ccd',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  text2: {
    textAlign: 'left',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#554ccd',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 5,
  },
  genderText: {
    marginRight: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#554ccd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    backgroundColor: '#554ccd',
  },
  datePicker: {
    width: '100%',
    borderColor: '#554ccd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  Button: {
    backgroundColor: '#554ccd',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
    width: '80%',
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default UserAdress;
