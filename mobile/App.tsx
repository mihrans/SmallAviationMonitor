import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Switch,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configuration
const API_URL = 'https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position';
const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds

interface DeviceConfig {
  aircraftType: string;
  name: string;
  phoneNo: string;
  deviceId: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number;
  timestamp: number;
}

function App(): React.JSX.Element {
  // State
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [config, setConfig] = useState<DeviceConfig>({
    aircraftType: '',
    name: '',
    phoneNo: '',
    deviceId: '',
  });
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('Never');
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const watchIdRef = useRef<number | null>(null);

  // Load saved configuration on mount
  useEffect(() => {
    loadConfig();
    requestLocationPermission();
  }, []);

  // Start/stop tracking based on isTracking state
  useEffect(() => {
    if (isTracking && hasPermission) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [isTracking, hasPermission]);

  // Load configuration from AsyncStorage
  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('deviceConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Generate a unique device ID
        const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setConfig(prev => ({ ...prev, deviceId }));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  // Save configuration to AsyncStorage
  const saveConfig = async () => {
    try {
      // Validation
      if (!config.aircraftType || !config.name || !config.phoneNo) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }

      // Generate device ID if not exists
      if (!config.deviceId) {
        config.deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      await AsyncStorage.setItem('deviceConfig', JSON.stringify(config));
      Alert.alert('Success', 'Configuration saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      Alert.alert('Error', 'Failed to save configuration');
      return false;
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      setHasPermission(auth === 'granted');
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'SmallAviationMonitor needs access to your precise location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  // Start tracking location
  const startTracking = () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant location permission to start tracking');
      requestLocationPermission();
      return;
    }

    if (!config.aircraftType || !config.name || !config.phoneNo) {
      Alert.alert('Configuration Required', 'Please fill in all configuration fields before starting tracking');
      setIsTracking(false);
      return;
    }

    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setCurrentLocation(locationData);
        sendLocationToServer(locationData);
      },
      (error) => {
        console.error('Location error:', error);
        addError(`Location error: ${error.message}`);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: LOCATION_UPDATE_INTERVAL,
        fastestInterval: 2000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Send location data to server
  const sendLocationToServer = async (location: LocationData) => {
    try {
      const payload = {
        deviceId: config.deviceId,
        deviceType: mapAircraftType(config.aircraftType),
        position: {
          lat: location.latitude,
          lng: location.longitude,
          altitude: location.altitude || 0,
          altitudeUnit: 'meters',
        },
        telemetry: {
          speed: location.speed ? location.speed * 3.6 : 0, // Convert m/s to km/h
          speedUnit: 'kmh',
          heading: location.heading || 0,
          accuracy: location.accuracy,
        },
        device: {
          name: config.name,
          pilot: config.name,
          contact: config.phoneNo,
        },
        timestamp: new Date(location.timestamp).toISOString(),
      };

      const response = await axios.post(API_URL, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setLastUpdateTime(new Date().toLocaleTimeString());
        setTotalUpdates(prev => prev + 1);
        // Clear errors on success
        if (errors.length > 0) {
          setErrors([]);
        }
      }
    } catch (error: any) {
      console.error('Error sending location:', error);
      addError(`Failed to send: ${error.message}`);
    }
  };

  // Map aircraft type to API format
  const mapAircraftType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'Aircraft': 'aircraft',
      'Drone': 'drone',
      'Paraglider': 'paraglider',
      'Hot Air Balloon': 'balloon',
    };
    return typeMap[type] || 'aircraft';
  };

  // Add error to error list (keep last 5)
  const addError = (error: string) => {
    setErrors(prev => [error, ...prev].slice(0, 5));
  };

  // Toggle tracking
  const toggleTracking = async () => {
    if (!isTracking) {
      // Save config before starting
      const saved = await saveConfig();
      if (!saved) return;
    }
    setIsTracking(!isTracking);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Aviation GPS Logger</Text>
          <Text style={styles.subtitle}>SmallAviationMonitor</Text>
        </View>

        {/* Configuration Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Configuration</Text>
          
          <Text style={styles.label}>Aircraft Type *</Text>
          <View style={styles.pickerContainer}>
            {['Aircraft', 'Drone', 'Paraglider', 'Hot Air Balloon'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  config.aircraftType === type && styles.typeButtonActive,
                ]}
                onPress={() => setConfig({...config, aircraftType: type})}
                disabled={isTracking}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    config.aircraftType === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Pilot Name *</Text>
          <TextInput
            style={styles.input}
            value={config.name}
            onChangeText={(text) => setConfig({...config, name: text})}
            placeholder="Enter your name"
            editable={!isTracking}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={config.phoneNo}
            onChangeText={(text) => setConfig({...config, phoneNo: text})}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            editable={!isTracking}
          />

          <Text style={styles.deviceIdText}>
            Device ID: {config.deviceId || 'Not generated'}
          </Text>
        </View>

        {/* Tracking Control */}
        <View style={styles.section}>
          <View style={styles.trackingHeader}>
            <Text style={styles.sectionTitle}>GPS Tracking</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.trackingStatus}>
                {isTracking ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={isTracking}
                onValueChange={toggleTracking}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={isTracking ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {!hasPermission && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Location permission required
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestLocationPermission}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}

          {isTracking && currentLocation && (
            <View style={styles.locationInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Latitude:</Text>
                <Text style={styles.infoValue}>
                  {currentLocation.latitude.toFixed(6)}°
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Longitude:</Text>
                <Text style={styles.infoValue}>
                  {currentLocation.longitude.toFixed(6)}°
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Altitude:</Text>
                <Text style={styles.infoValue}>
                  {currentLocation.altitude?.toFixed(1) || 'N/A'} m
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Speed:</Text>
                <Text style={styles.infoValue}>
                  {currentLocation.speed
                    ? (currentLocation.speed * 3.6).toFixed(1)
                    : 'N/A'}{' '}
                  km/h
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Accuracy:</Text>
                <Text style={styles.infoValue}>
                  {currentLocation.accuracy.toFixed(1)} m
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalUpdates}</Text>
              <Text style={styles.statLabel}>Updates Sent</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lastUpdateTime}</Text>
              <Text style={styles.statLabel}>Last Update</Text>
            </View>
          </View>
        </View>

        {/* Errors */}
        {errors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Errors</Text>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                • {error}
              </Text>
            ))}
          </View>
        )}

        {/* Save Button */}
        {!isTracking && (
          <TouchableOpacity style={styles.saveButton} onPress={saveConfig}>
            <Text style={styles.saveButtonText}>Save Configuration</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#555',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  deviceIdText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackingStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
