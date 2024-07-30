
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  RidingTrack: {
    routeData: {
      tripPurpose: string;
      startingPoint: string;
      destination?: string;
      stopPoints: string[];
      fitnessLevel: string;
      selectedTime?: number;
      coordinates: { latitude: number; longitude: number }[];
    };
  };
};

type RidingTrackRouteProp = RouteProp<RootStackParamList, 'RidingTrack'>;

const RidingTrack: React.FC = () => {
  const route = useRoute<RidingTrackRouteProp>();
  const { routeData } = route.params;

  const coordinates = routeData.coordinates;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
          />
        ))}
        <Polyline
          coordinates={coordinates}
          strokeColor="#000"
          strokeWidth={6}
        />
      </MapView>
      <View style={styles.details}>
        <Text style={styles.title}>מסלול</Text>
        <Text>מטרת הנסיעה: {routeData.tripPurpose}</Text>
        <Text>נקודת התחלה: {routeData.startingPoint}</Text>
        {routeData.destination && <Text>יעד: {routeData.destination}</Text>}
        <Text>רמת כושר: {routeData.fitnessLevel}</Text>
        {routeData.selectedTime && <Text>זמן ספורט: {routeData.selectedTime} דקות</Text>}
        {routeData.stopPoints.length > 0 && (
          <>
            <Text>נקודות עצירה:</Text>
            {routeData.stopPoints.map((stop, index) => (
              <Text key={index}>{stop}</Text>
            ))}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 3,
  },
  details: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default RidingTrack;


