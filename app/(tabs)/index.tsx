import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/components/screens/LoginScreen';
import RegisterScreen from '@/components/screens/RegisterScreen';
import HomeScreen from '@/components/screens/HomeScreen';
import ModeSelection from '@/components/screens/ModeSelectionScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import { UserProvider } from '@/components/screens/UserContext';
import DrawerNavigator from '@/components/screens/DrawerNavigator';
import RidingTrack from '@/components/screens/RidingTrackScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ModeSelection: undefined;
  Profile: undefined;
  Drawer: undefined;
  RidingTrack: { routeData: RouteData };
};

export type RouteData = {
  path: string[];
  distance: number;
  time: number;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // עוטף את כל האפליקציה, מספק מידע אודות החיבור של המשתמש
    <UserProvider>
        <Stack.Navigator initialRouteName="ModeSelection" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ModeSelection" component={ModeSelection} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="RidingTrack" component={RidingTrack} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
    </UserProvider>
  );
}

