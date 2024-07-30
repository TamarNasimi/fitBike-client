
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleUserIconPress = () => {
    if (user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/fitbike.png")}
        style={styles.backgroundImage}
        resizeMode="contain"  // This will maintain the aspect ratio of the image
      >
        <IconButton
          icon="account"
          size={30}
          onPress={handleUserIconPress}
          style={styles.userIcon}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
});

export default HomeScreen;
