import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './src/components/LogIn';
import HomePage from './src/components/HomePage';
import SignUp from './src/components/SignUp/SignUp';
import SignUp2 from './src/components/SignUp/SignUp2';
import SignUp3 from './src/components/SignUp/SignUp3';

const Stack = createStackNavigator();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser); // currentUser will be null if no user is signed in
      });

      // Cleanup subscription on unmount
      return unsubscribe; // This is equivalent to return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignUp2" component={SignUp2} />
        <Stack.Screen name="SignUp3" component={SignUp3} />
        {/* Other screens can also be added here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
