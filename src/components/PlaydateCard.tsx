import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Playdate } from '../types';

interface PlaydateCardProps {
  playdate: Playdate;
  onPress: () => void;
}

export const PlaydateCard: React.FC<PlaydateCardProps> = ({ playdate, onPress }) => {
  const childrenCount = playdate.participants.reduce(
    (acc, p) => acc + p.childrenCount,
    0
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{playdate.title}</Text>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>
            {playdate.startTime} - {playdate.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <Text style={styles.locationText}>📍 {playdate.location.name}</Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          👤 {playdate.participants.length} perhettä
        </Text>
        <Text style={styles.statText}>
          👶 {childrenCount} lasta
        </Text>
        <Text style={styles.statText}>
          🎂 {playdate.ageRange.min}-{playdate.ageRange.max}v
        </Text>
      </View>

      {playdate.description && (
        <Text style={styles.description} numberOfLines={2}>
          {playdate.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  timeBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  timeText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: '#4b5563',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    color: '#4b5563',
    fontSize: 14,
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
});
