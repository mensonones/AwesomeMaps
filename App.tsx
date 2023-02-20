import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  PermissionsAndroid,
  Text,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  enableLatestRenderer,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height - 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const AwesomeMaps = () => {
  enableLatestRenderer();
  const [location, setLocation] = React.useState({});

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        setLocation(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 1, interval: 1000},
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the location');
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          camera={{
            center: {
              latitude: location?.coords?.latitude || -3.7524,
              longitude: location?.coords?.longitude || -38.5265,
            },
            pitch: 0,
            heading: 0,
            altitude: 5,
            zoom: 17,
          }}
          region={{
            latitude: location?.coords?.latitude || -3.7524,
            longitude: location?.coords?.longitude || -38.5265,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          <Marker
            coordinate={{
              latitude: location?.coords?.latitude || -3.7524,
              longitude: location?.coords?.longitude || -38.5265,
            }}
            flat
            anchor={{x: 0.5, y: 0.5}}
            image={require('./assets/img/helmet90.png')}
          />
        </MapView>
      </View>
      <View style={styles.bottomView}>
        <Text>Latitude: {location?.coords?.latitude}</Text>
        <Text>Longitude: {location?.coords?.longitude}</Text>
      </View>
    </>
  );
};

export default AwesomeMaps;
