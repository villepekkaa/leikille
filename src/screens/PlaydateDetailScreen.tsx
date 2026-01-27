import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList, Playdate } from '../types';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

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

    const alreadyJoined = playdate.participants.some(p => p.userId === user.uid);
    if (alreadyJoined) {
      Alert.alert('Huomio', 'Olet jo liittynyt tähän leikkiin');
      return;
    }

    setJoining(true);
    try {
      await firestoreService.playdates.joinPlaydate(playdateId, user.uid, 1);
      Alert.alert('Mahtavaa!', 'Olet nyt mukana leikissä');
      loadPlaydate();
    } catch (error) {
      Alert.alert('Virhe', 'Leikkiin liittyminen epäonnistui');
    } finally {
      setJoining(false);
    }
  };

  if (loading || !playdate) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const childrenCount = playdate.participants.reduce(
    (acc, p) => acc + p.childrenCount,
    0
  );

  const isOrganizer = user?.uid === playdate.organizerId;
  const hasJoined = playdate.participants.some(p => p.userId === user?.uid);

  const dateString = new Date(playdate.date).toLocaleDateString('fi-FI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{playdate.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <View style={styles.dot} />
              <Text style={styles.timeText}>
                {playdate.startTime} – {playdate.endTime}
              </Text>
            </View>
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>•</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{playdate.location.name}</Text>
              <Text style={styles.locationAddress}>{playdate.location.address}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playdate.participants.length}</Text>
              <Text style={styles.statLabel}>perhettä</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{childrenCount}</Text>
              <Text style={styles.statLabel}>lasta</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {playdate.ageRange.min}–{playdate.ageRange.max}
              </Text>
              <Text style={styles.statLabel}>vuotta</Text>
            </View>
          </View>

          {/* Description */}
          {playdate.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kuvaus</Text>
              <Text style={styles.descriptionText}>{playdate.description}</Text>
            </View>
          )}

          {/* Participants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Osallistujat ({playdate.participants.length})
            </Text>
            {playdate.participants.length === 0 ? (
              <Text style={styles.emptyParticipants}>
                Ei vielä osallistujia. Ole ensimmäinen!
              </Text>
            ) : (
              playdate.participants.map((participant, index) => (
                <View key={index} style={styles.participantCard}>
                  <View style={styles.participantAvatar}>
                    <Text style={styles.participantInitial}>
                      {participant.user.name?.[0]?.toUpperCase() || '?'}
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
                      <Text style={styles.organizerBadgeText}>Järjestäjä</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Action Area */}
          <View style={styles.actionArea}>
            {!isOrganizer && !hasJoined && (
              <Button
                title="Liity mukaan"
                onPress={handleJoin}
                loading={joining}
                size="lg"
              />
            )}

            {hasJoined && !isOrganizer && (
              <View style={styles.statusCard}>
                <View style={styles.statusIcon}>
                  <Text style={styles.statusIconText}>✓</Text>
                </View>
                <Text style={styles.statusText}>Olet mukana tässä leikissä</Text>
              </View>
            )}

            {isOrganizer && (
              <View style={[styles.statusCard, styles.organizerStatusCard]}>
                <View style={[styles.statusIcon, styles.organizerStatusIcon]}>
                  <Text style={styles.statusIconText}>★</Text>
                </View>
                <Text style={[styles.statusText, styles.organizerStatusText]}>
                  Olet tämän leikin järjestäjä
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: 220,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationIconText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: typography.weights.bold,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontWeight: typography.weights.semibold,
    color: colors.text,
    fontSize: typography.sizes.md,
    marginBottom: 2,
  },
  locationAddress: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
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
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
  },
  emptyParticipants: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    backgroundColor: colors.secondaryLight,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  participantInitial: {
    color: colors.secondary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontWeight: typography.weights.medium,
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  participantChildren: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  organizerBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  organizerBadgeText: {
    color: colors.accent,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  actionArea: {
    marginTop: spacing.md,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  organizerStatusCard: {
    backgroundColor: colors.accentLight,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  organizerStatusIcon: {
    backgroundColor: colors.accent,
  },
  statusIconText: {
    color: '#fff',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
  statusText: {
    color: colors.secondaryDark,
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.md,
    flex: 1,
  },
  organizerStatusText: {
    color: colors.accent,
  },
});

export default PlaydateDetailScreen;
