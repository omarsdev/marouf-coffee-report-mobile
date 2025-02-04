import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, RESULTS} from 'react-native-permissions';

export const getCurrentLocation = async () => {
  try {
    // Request location permission
    const permissionStatus = await request(
      Platform.OS === 'ios'
        ? 'ios.permission.LOCATION_WHEN_IN_USE'
        : 'android.permission.ACCESS_FINE_LOCATION',
    );

    if (permissionStatus !== RESULTS.GRANTED) {
      throw new Error('Location permission denied');
    }

    // Get current position
    const position = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        resolve,
        error => reject(new Error(`Location Error: ${error.message}`)),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });

    return position.coords;
  } catch (error) {
    console.error('getCurrentLocation Error:', error.message || error);
    throw error;
  }
};
