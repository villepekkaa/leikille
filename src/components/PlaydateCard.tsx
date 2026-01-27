import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Playdate } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

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
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{playdate.title}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationDot}>•</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {playdate.location.name}
            </Text>
          </View>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>
            {playdate.startTime}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
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
            {playdate.ageRange.min}-{playdate.ageRange.max}
          </Text>
          <Text style={styles.statLabel}>vuotta</Text>
        </View>
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  timeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  timeText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.md,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
});
