import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './src/screens/LogIn';
import HomePage from './src/screens/HomePage';
import UserName from './src/screens/SignUp/UserName';
import UserAuth from './src/screens/SignUp/UserAuth';
import UserAdress from './src/screens/SignUp/UserAdress';
import ChatScreen from './src/screens/ChatScreen';
import FriendListScreen from './src/screens/FriendListScreen';

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
      <Stack.Navigator screenOptions={{
        animationEnabled: false, // Disable animations for all screens in the stack
        }} initialRouteName="LogIn">
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="UserName" component={UserName} />
        <Stack.Screen name="UserAuth" component={UserAuth} />
        <Stack.Screen name="UserAdress" component={UserAdress} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="FriendListScreen" component={FriendListScreen} />
        {/* Other screens can also be added here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
