
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/(tabs)/index';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  navigation = useNavigation();
  const { setUser } = useUser();
  //בדיקה שכתובת המייל תקינה
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    //בדיקת תקינות לסיסמא
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    if (!email || !password) {
      if (!email) setEmailError('Email is required.');
      if (!password) setPasswordError('Password is required.');
      valid = false;
    }



    if (valid) {

      axios.post('http://localhost:3000/checkLogin/', { email: email, password: password })
      .then((response) => {
        const { user } = response.data;
        const loggedInUser = {id: user.id, username: user.username, email: user.email ,  password: user.password}; 
        console.log( loggedInUser);
        setUser(loggedInUser);
        navigation.navigate('Profile');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setEmailError('Invalid email or password.');
          setPasswordError('Invalid email or password.');
        } else {
          console.error('Error during login:', error);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Login</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        error={!!emailError}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        error={!!passwordError}
      />
      
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button mode="text"  onPress={() => navigation.navigate('Register') } >
      Don't have an account? Register
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;
