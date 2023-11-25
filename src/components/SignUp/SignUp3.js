import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';

const SignUp3 = ({route, navigation}) => {
  const { firstName, midName, lastName, email, userId, password, role } = route.params;
  const [residence, setResidence] = useState('Residence');
  const [faculty, setFaculty] = useState('Faculty');
  const [birthdate, setBirthdate] = useState(new Date(2000, 3, 6)); // Months are 0-indexed in JS Dates
  const [gender, setGender] = useState('male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAgeValid, setIsAgeValid] = useState(true);

  const residences = ['Residence', 'Outsider', 'GuestHouse', 'Jasmine', 'Crystal', 'Edelweis', 'Annex', 'Boungeville', 'Genset',];
  const faculties = ['Falculties', 'ASMI', 'FILKOM',  'FKEP',  'FEB', 'Filsafat', 'Pertanian', 'M. Manajemen', 'M. Teologi', 'Profesi Ners'];

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios'); // If iOS, keep the picker open
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
  
    return `${month} ${day}, ${year}`; // Formats date as "Month day year"
  };

  const handleCreateAccount = () => {
    if (!isAgeValid) {
      return; 
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
        onValueChange={(itemValue, itemIndex) => setResidence(itemValue)}
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
          onValueChange={(itemValue, itemIndex) => setFaculty(itemValue)}
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
      <TouchableOpacity style={styles.Button} onPress={handleCreateAccount}>
        <Text style={styles.ButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // This matches the background color of SignUp1 and SignUp2
    
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
    alignItems: 'center',
    textAlign: 'center',
  },
  text2:{
    textAlign: 'left',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#554ccd', 
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    genderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,

    },
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // ... other styles you need
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 5,
    // ... other styles you need
  },
  genderText: {
    marginRight: 5,
    // ... other styles you need
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2, // Added border width
    borderColor: '#554ccd', // Added border color
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
    justifyContent: 'center',
    backgroundColor: '#fff', // Assuming your date picker background is white
  },
  dateText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  Button: {
    backgroundColor: '#554ccd', // Button color to match the other screens
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center', // Center the button horizontally
    width: '80%', // Adjust the width as needed
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

export default SignUp3;
