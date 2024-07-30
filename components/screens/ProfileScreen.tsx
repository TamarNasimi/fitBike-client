import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text , Button} from 'react-native-paper';
import { useUser } from './UserContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
  ModeSelection: undefined;
  ReservedPlaces: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const { user, logout } = useUser();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleRidingPlanning = () => {
    navigation.navigate('ModeSelection');
  };

  const handleLocation = () => {
    // Handle location logic here
  };

  return (
    <View style={styles.container}>
      
     
      <Text variant="headlineMedium">Profile</Text>
      {user && (
        <>
          <Text>Welcome  {user.username}</Text>
          <IconButton
            icon="logout"
            size={30}
            onPress={handleLogout}
            style={styles.logoutIcon}
          />
        </>
      )}
      <Button mode="contained" onPress={handleRidingPlanning} style={styles.button}>
      Riding planning
      </Button>
     
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  menuIcon: {
    position: 'absolute',
    top: 16,
    left: 1,
  },
  logoutIcon: {
   // marginVertical: 8,
    position: 'absolute',
    top: 16,
    left: 35,
  },
  locationIcon: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});

export default ProfileScreen;
