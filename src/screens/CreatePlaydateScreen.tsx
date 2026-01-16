import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import { TabParamList, Location } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from '../hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<TabParamList, 'CreatePlaydate'>;

const CreatePlaydateScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [minAge, setMinAge] = useState('2');
  const [maxAge, setMaxAge] = useState('5');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [loading, setLoading] = useState(false);

  // Kartan oletussijainti (Helsinki)
  const [region, setRegion] = useState<Region>({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
  });

  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
  };

  const handleCreatePlaydate = async () => {
    if (!title || !locationName || !locationAddress) {
      Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät');
      return;
    }

    if (!user) {
      Alert.alert('Virhe', 'Sinun täytyy olla kirjautuneena');
      return;
    }

    setLoading(true);
    try {
      const location: Location = {
        name: locationName,
        address: locationAddress,
        coordinates: markerCoordinate,
      };

      await firestoreService.playdates.create({
        title,
        description,
        organizerId: user.uid,
        organizer: {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Käyttäjä',
          children: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        location,
        date,
        startTime,
        endTime,
        participants: [],
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        ageRange: {
          min: parseInt(minAge) || 0,
          max: parseInt(maxAge) || 10,
        },
      });

      Alert.alert('Onnistui!', 'Leikkitreffi on luotu', [
        {
          text: 'OK',
          onPress: () => {
            // Tyhjennetään lomake
            setTitle('');
            setDescription('');
            setLocationName('');
            setLocationAddress('');
            setDate(new Date());
            setStartTime('14:00');
            setEndTime('16:00');
            setMinAge('2');
            setMaxAge('5');
            setMaxParticipants('');
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating playdate:', error);
      Alert.alert('Virhe', 'Leikkitreffiä ei voitu luoda');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Luo uusi leikkitreffi
        </Text>

        <Input
          label="Otsikko *"
          value={title}
          onChangeText={setTitle}
          placeholder="esim. Leikkipuistossa"
        />

        <Input
          label="Kuvaus"
          value={description}
          onChangeText={setDescription}
          placeholder="Kerro lisää leikistä..."
        />

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Päivämäärä *</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('fi-FI', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Alkaa *"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="14:00"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Päättyy *"
              value={endTime}
              onChangeText={setEndTime}
              placeholder="16:00"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Ikä min"
              value={minAge}
              onChangeText={setMinAge}
              placeholder="2"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Ikä max"
              value={maxAge}
              onChangeText={setMaxAge}
              placeholder="5"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Input
          label="Max osallistujat"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          placeholder="Ei rajoitusta"
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>
          Sijainti
        </Text>

        <Input
          label="Paikan nimi *"
          value={locationName}
          onChangeText={setLocationName}
          placeholder="esim. Keskuspuisto"
        />

        <Input
          label="Osoite *"
          value={locationAddress}
          onChangeText={setLocationAddress}
          placeholder="esim. Mannerheimintie 12, Helsinki"
        />

        <Text style={styles.mapLabel}>
          Valitse sijainti kartalta
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
          >
            <Marker coordinate={markerCoordinate} />
          </MapView>
        </View>

        <Button
          title="Luo leikkitreffi"
          onPress={handleCreatePlaydate}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonText: {
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    marginTop: 24,
  },
  mapLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  mapContainer: {
    height: 256,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 24,
  },
  map: {
    flex: 1,
  },
});

export default CreatePlaydateScreen;
