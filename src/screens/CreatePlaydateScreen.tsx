import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import { TabParamList, Location } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from '../hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

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

      Alert.alert('Valmista!', 'Leikkitreffi luotu onnistuneesti', [
        {
          text: 'OK',
          onPress: () => {
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perustiedot</Text>
            <View style={styles.card}>
              <Input
                label="Otsikko"
                value={title}
                onChangeText={setTitle}
                placeholder="esim. Leikkipuistossa hauskanpitoa"
              />

              <Input
                label="Kuvaus"
                value={description}
                onChangeText={setDescription}
                placeholder="Kerro lisää, mitä on luvassa..."
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aika</Text>
            <View style={styles.card}>
              <Text style={styles.inputLabel}>Päivämäärä</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                activeOpacity={0.7}
              >
                <Text style={styles.dateButtonText}>
                  {date.toLocaleDateString('fi-FI', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
                <Text style={styles.dateChevron}>›</Text>
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

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Alkaa"
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="14:00"
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Päättyy"
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="16:00"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Participants Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Osallistujat</Text>
            <View style={styles.card}>
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
                placeholder="Jätä tyhjäksi jos ei rajoitusta"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sijainti</Text>
            <View style={styles.card}>
              <Input
                label="Paikan nimi"
                value={locationName}
                onChangeText={setLocationName}
                placeholder="esim. Töölön leikkipuisto"
              />

              <Input
                label="Osoite"
                value={locationAddress}
                onChangeText={setLocationAddress}
                placeholder="esim. Töölönkatu 12, Helsinki"
              />

              <Text style={styles.mapLabel}>
                Napauta karttaa valitaksesi tarkka sijainti
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
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Button
              title="Luo leikkitreffi"
              onPress={handleCreatePlaydate}
              loading={loading}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  inputLabel: {
    color: colors.text,
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  dateButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dateButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  dateChevron: {
    color: colors.textMuted,
    fontSize: typography.sizes.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  mapLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  mapContainer: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  submitContainer: {
    marginTop: spacing.md,
  },
});

export default CreatePlaydateScreen;
