import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
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
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
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

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Päivämäärä *</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="border border-gray-300 rounded-lg px-4 py-3"
          >
            <Text className="text-gray-900">
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

        <View className="flex-row mb-4 space-x-4">
          <View className="flex-1">
            <Input
              label="Alkaa *"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="14:00"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Päättyy *"
              value={endTime}
              onChangeText={setEndTime}
              placeholder="16:00"
            />
          </View>
        </View>

        <View className="flex-row mb-4 space-x-4">
          <View className="flex-1">
            <Input
              label="Ikä min"
              value={minAge}
              onChangeText={setMinAge}
              placeholder="2"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
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

        <Text className="text-xl font-semibold text-gray-900 mb-4 mt-6">
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

        <Text className="text-gray-700 font-medium mb-2">
          Valitse sijainti kartalta
        </Text>
        <View className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-6">
          <MapView
            style={{ flex: 1 }}
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

export default CreatePlaydateScreen;
