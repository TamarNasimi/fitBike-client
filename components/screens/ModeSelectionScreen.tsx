
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { TextInput, Button, RadioButton, Text, Menu, Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/(tabs)/index';
import axios from 'axios';
import { useUser } from './UserContext';
import * as Location from 'expo-location';

type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

type Props = {
  navigation?: ModeSelectionScreenNavigationProp;
};

const ModeSelection: React.FC<Props> = ({ navigation = useNavigation<ModeSelectionScreenNavigationProp>() }) => {
  const [tripPurpose, setTripPurpose] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [stopPoints, setStopPoints] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!tripPurpose) {
      errors.tripPurpose = 'Please select the purpose of the trip';
    }
    if (!startingPoint) {
      errors.startingPoint = 'Starting point is required';
    }
    if (tripPurpose === 'traveling' && !destination) {
      errors.destination = 'Destination is required';
    }
    if (!fitnessLevel) {
      errors.fitnessLevel = 'Fitness level is required';
    }
    if (tripPurpose === 'sports' && !selectedTime) {
      errors.selectedTime = 'Please select sports time';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTripPurposeChange = (value: string) => {
    setTripPurpose(value);
    setErrors({ ...errors, tripPurpose: '' });
  };

  const handleFitnessLevelChange = (value: string) => {
    setFitnessLevel(value);
    setErrors((prevErrors) => ({ ...prevErrors, fitnessLevel: '' }));
    setMenuVisible(false);
  };

  const handleTimeSelection = (time: number) => {
    setSelectedTime(time);
    setErrors((prevErrors) => ({ ...prevErrors, selectedTime: '' }));
    setIsTimePickerVisible(false);
  };

  const handleAddStopPoint = () => {
    setStopPoints([...stopPoints, '']);
  };

  const getCurrentLocation = async (setLocation: (location: string) => void) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form is valid. Submitting data...');
      axios.post('http://localhost:3000/planRoute/', {
        tripPurpose: tripPurpose,
        startingPoint: startingPoint,
        destination: tripPurpose === 'sports' ? null : destination,
        stopPoints: stopPoints,
        fitnessLevel: fitnessLevel,
        id_user: user?.id,
        selectedTime: selectedTime,
      })
      // .then((response) => {
      //   navigation.navigate('RidingTrack', { routeData: response.data });
      // })
      .catch((err) => {
        console.error('Error submitting form:', err);
      });
    } else {
      console.log('Form is invalid. Errors:', errors);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Route Details</Text>
        <RadioButton.Group onValueChange={handleTripPurposeChange} value={tripPurpose}>
          <RadioButton.Item label="Sports Purposes" value="sports" />
          <RadioButton.Item label="Traveling with Stops" value="traveling" />
        </RadioButton.Group>
        {errors.tripPurpose && <Text style={styles.error}>{errors.tripPurpose}</Text>}
        {tripPurpose && (
          <>
            <TextInput
              label="Starting Point"
              value={startingPoint}
              onChangeText={setStartingPoint}
              style={styles.input}
              onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, startingPoint: '' }))}
            />
            {errors.startingPoint && <Text style={styles.error}>{errors.startingPoint}</Text>}
            {tripPurpose === 'traveling' &&
              <>
                <TextInput
                  label="Destination"
                  value={destination}
                  onChangeText={setDestination}
                  style={styles.input}
                  onFocus={() => setErrors((prevErrors) => ({ ...prevErrors, destination: '' }))}
                />
                {errors.destination && <Text style={styles.error}>{errors.destination}</Text>}
              </>
            }
            {tripPurpose === 'traveling' && (
              <FlatList
                data={stopPoints}
                renderItem={({ item, index }) => (
                  <TextInput
                    label={`Stop Point ${index + 1}`}
                    value={item}
                    onChangeText={(text) => {
                      const updatedStopPoints = [...stopPoints];
                      updatedStopPoints[index] = text;
                      setStopPoints(updatedStopPoints);
                      setErrors((prevErrors) => ({ ...prevErrors, stopPoints: '' }));
                    }}
                    style={styles.input}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {tripPurpose === 'traveling' && (
              <Button mode="contained" onPress={handleAddStopPoint} style={styles.addButton}>
                Add Stop Point
              </Button>
            )}
            <View style={styles.dropdownContainer}>
              <Button mode="contained" onPress={() => setMenuVisible(true)} style={styles.dropdownButton}>
                {fitnessLevel ? `Fitness Level: ${fitnessLevel}` : 'Select Fitness Level'}
              </Button>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={<Text style={styles.dropdownAnchor}> </Text>}>
                <Menu.Item onPress={() => handleFitnessLevelChange('Beginners')} title="Beginners" />
                <Menu.Item onPress={() => handleFitnessLevelChange('Intermediate')} title="Intermediate" />
                <Menu.Item onPress={() => handleFitnessLevelChange('Advanced')} title="Advanced" />
              </Menu>
            </View>
            {tripPurpose === 'sports' && (
              <View style={styles.dropdownContainer}>
                <Button mode="contained" onPress={() => setIsTimePickerVisible(true)} style={styles.dropdownButton}>
                  {selectedTime ? `Selected Time: ${selectedTime} minutes` : 'Select Sports Time'}
                </Button>
                {isTimePickerVisible && (
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text variant="headlineMedium" style={styles.modalTitle}>Choose Sports Time</Text>
                      <View style={styles.timeOptionsContainer}>
                        {[...Array(3)].map((_, index) => {
                          const time = (index + 1) * 5;
                          return (
                            <TouchableOpacity
                              key={index}
                              style={styles.timeOption}
                              onPress={() => handleTimeSelection(time)}>
                              <Text>{`${time} minutes`}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
            {errors.selectedTime && <Text style={styles.error}>{errors.selectedTime}</Text>}
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Submit
            </Button>
          </>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    marginTop: 16,
  },
  dropdownAnchor: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeOption: {
    padding: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default ModeSelection;
