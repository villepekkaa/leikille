import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList, Playdate } from '../types';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaydateDetail'>;

const PlaydateDetailScreen: React.FC<Props> = ({ route }) => {
  const { playdateId } = route.params;
  const [playdate, setPlaydate] = useState<Playdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPlaydate();
  }, [playdateId]);

  const loadPlaydate = async () => {
    try {
      const data = await firestoreService.playdates.get(playdateId);
      setPlaydate(data);
    } catch (error) {
      console.error('Error loading playdate:', error);
      Alert.alert('Virhe', 'Leikkitreffiä ei voitu ladata');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !playdate) return;

    // Tarkista onko käyttäjä jo mukana
    const alreadyJoined = playdate.participants.some(p => p.userId === user.uid);
    if (alreadyJoined) {
      Alert.alert('Huomio', 'Olet jo liittynyt tähän leikkiin');
      return;
    }

    setJoining(true);
    try {
      // Tässä voisi kysyä lapsien määrää
      await firestoreService.playdates.joinPlaydate(playdateId, user.uid, 1);
      Alert.alert('Onnistui!', 'Olet nyt mukana leikissä');
      loadPlaydate(); // Päivitä data
    } catch (error) {
      Alert.alert('Virhe', 'Leikkiin liittyminen epäonnistui');
    } finally {
      setJoining(false);
    }
  };

  if (loading || !playdate) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Ladataan...</Text>
      </View>
    );
  }

  const childrenCount = playdate.participants.reduce(
    (acc, p) => acc + p.childrenCount,
    0
  );

  const isOrganizer = user?.uid === playdate.organizerId;
  const hasJoined = playdate.participants.some(p => p.userId === user?.uid);

  return (
    <View className="flex-1 bg-white">
      <MapView
        className="w-full h-80"
        initialRegion={{
          latitude: playdate.location.coordinates.latitude,
          longitude: playdate.location.coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: playdate.location.coordinates.latitude,
            longitude: playdate.location.coordinates.longitude,
          }}
          title={playdate.location.name}
          description={playdate.location.address}
        />
      </MapView>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {playdate.title}
              </Text>
              <Text className="text-primary-600 font-medium">
                {new Date(playdate.date).toLocaleDateString('fi-FI', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
            <View className="bg-primary-100 px-4 py-2 rounded-full">
              <Text className="text-primary-700 font-semibold">
                {playdate.startTime} - {playdate.endTime}
              </Text>
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">📍</Text>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {playdate.location.name}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {playdate.location.address}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-around mb-6">
            <View className="items-center">
              <Text className="text-3xl mb-1">👨‍👩‍👧‍👦</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {playdate.participants.length}
              </Text>
              <Text className="text-gray-600 text-sm">perhettä</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl mb-1">👶</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {childrenCount}
              </Text>
              <Text className="text-gray-600 text-sm">lasta</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl mb-1">🎂</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {playdate.ageRange.min}-{playdate.ageRange.max}
              </Text>
              <Text className="text-gray-600 text-sm">vuotta</Text>
            </View>
          </View>

          {playdate.description && (
            <View className="mb-6">
              <Text className="font-semibold text-gray-900 mb-2">
                Kuvaus
              </Text>
              <Text className="text-gray-700 leading-6">
                {playdate.description}
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="font-semibold text-gray-900 mb-3">
              Osallistujat ({playdate.participants.length})
            </Text>
            {playdate.participants.map((participant, index) => (
              <View
                key={index}
                className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
              >
                <View className="w-10 h-10 bg-primary-200 rounded-full justify-center items-center mr-3">
                  <Text className="text-primary-700 font-semibold">
                    {participant.user.name?.[0] || '?'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">
                    {participant.user.name || 'Käyttäjä'}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {participant.childrenCount} {participant.childrenCount === 1 ? 'lapsi' : 'lasta'}
                  </Text>
                </View>
                {participant.userId === playdate.organizerId && (
                  <View className="bg-accent-100 px-3 py-1 rounded-full">
                    <Text className="text-accent-700 text-xs font-medium">
                      Järjestäjä
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {!isOrganizer && !hasJoined && (
            <Button
              title="Liity leikkiin"
              onPress={handleJoin}
              loading={joining}
            />
          )}

          {hasJoined && !isOrganizer && (
            <View className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <Text className="text-secondary-700 font-medium text-center">
                ✓ Olet liittynyt tähän leikkiin
              </Text>
            </View>
          )}

          {isOrganizer && (
            <View className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <Text className="text-accent-700 font-medium text-center">
                👑 Olet tämän leikkin järjestäjä
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlaydateDetailScreen;
