import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Ladataan...</Text>
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
    <View style={styles.container}>
      <MapView
        style={styles.map}
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>
                {playdate.title}
              </Text>
              <Text style={styles.dateText}>
                {new Date(playdate.date).toLocaleDateString('fi-FI', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>
                {playdate.startTime} - {playdate.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>
                  {playdate.location.name}
                </Text>
                <Text style={styles.locationAddress}>
                  {playdate.location.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.statValue}>
                {playdate.participants.length}
              </Text>
              <Text style={styles.statLabel}>perhettä</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👶</Text>
              <Text style={styles.statValue}>
                {childrenCount}
              </Text>
              <Text style={styles.statLabel}>lasta</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🎂</Text>
              <Text style={styles.statValue}>
                {playdate.ageRange.min}-{playdate.ageRange.max}
              </Text>
              <Text style={styles.statLabel}>vuotta</Text>
            </View>
          </View>

          {playdate.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>
                Kuvaus
              </Text>
              <Text style={styles.descriptionText}>
                {playdate.description}
              </Text>
            </View>
          )}

          <View style={styles.participantsSection}>
            <Text style={styles.sectionTitle}>
              Osallistujat ({playdate.participants.length})
            </Text>
            {playdate.participants.map((participant, index) => (
              <View
                key={index}
                style={styles.participantCard}
              >
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantInitial}>
                    {participant.user.name?.[0] || '?'}
                  </Text>
                </View>
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>
                    {participant.user.name || 'Käyttäjä'}
                  </Text>
                  <Text style={styles.participantChildren}>
                    {participant.childrenCount} {participant.childrenCount === 1 ? 'lapsi' : 'lasta'}
                  </Text>
                </View>
                {participant.userId === playdate.organizerId && (
                  <View style={styles.organizerBadge}>
                    <Text style={styles.organizerText}>
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
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedText}>
                ✓ Olet liittynyt tähän leikkiin
              </Text>
            </View>
          )}

          {isOrganizer && (
            <View style={styles.organizerCard}>
              <Text style={styles.organizerCardText}>
                👑 Olet tämän leikkin järjestäjä
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
  },
  map: {
    width: '100%',
    height: 320,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  dateText: {
    color: '#dc2626',
    fontWeight: '500',
  },
  timeBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  timeText: {
    color: '#991b1b',
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontWeight: '600',
    color: '#111827',
  },
  locationAddress: {
    color: '#6b7280',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#374151',
    lineHeight: 24,
  },
  participantsSection: {
    marginBottom: 24,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#fecaca',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantInitial: {
    color: '#991b1b',
    fontWeight: '600',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontWeight: '500',
    color: '#111827',
  },
  participantChildren: {
    color: '#6b7280',
    fontSize: 14,
  },
  organizerBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  organizerText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '500',
  },
  joinedBadge: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 16,
  },
  joinedText: {
    color: '#15803d',
    fontWeight: '500',
    textAlign: 'center',
  },
  organizerCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 16,
  },
  organizerCardText: {
    color: '#1e40af',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default PlaydateDetailScreen;
