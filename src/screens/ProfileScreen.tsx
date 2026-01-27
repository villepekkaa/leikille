import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, User, Child } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { firestoreService } from '../services/firestore.service';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

type Props = NativeStackScreenProps<TabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userData = await firestoreService.users.get(user.uid);
      if (userData) {
        setName(userData.name);
        setPhoneNumber(userData.phoneNumber || '');
        setChildren(userData.children || []);
      } else {
        setName(user.displayName || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !name) {
      Alert.alert('Virhe', 'Nimi on pakollinen');
      return;
    }

    setSaving(true);
    try {
      await firestoreService.users.update(user.uid, {
        name,
        phoneNumber,
        children,
      } as Partial<User>);

      Alert.alert('Tallennettu', 'Profiilisi on päivitetty');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Virhe', 'Profiilin tallentaminen epäonnistui');
    } finally {
      setSaving(false);
    }
  };

  const handleAddChild = () => {
    if (!childName || !childAge) {
      Alert.alert('Virhe', 'Täytä lapsen nimi ja ikä');
      return;
    }

    const age = parseInt(childAge);
    if (isNaN(age) || age < 0 || age > 18) {
      Alert.alert('Virhe', 'Anna kelvollinen ikä (0-18)');
      return;
    }

    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - age);

    const newChild: Child = {
      name: childName,
      age,
      dateOfBirth: birthDate,
    };

    setChildren([...children, newChild]);
    setChildName('');
    setChildAge('');
    setShowAddChild(false);
  };

  const handleRemoveChild = (index: number) => {
    Alert.alert(
      'Poista lapsi',
      'Haluatko varmasti poistaa tämän?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: () => {
            const updatedChildren = children.filter((_, i) => i !== index);
            setChildren(updatedChildren);
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Kirjaudu ulos',
      'Haluatko varmasti kirjautua ulos?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Kirjaudu ulos',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {name ? name[0]?.toUpperCase() : user?.email?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.headerName}>{name || 'Käyttäjä'}</Text>
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perustiedot</Text>
          <View style={styles.card}>
            <Input
              label="Nimi"
              value={name}
              onChangeText={setName}
              placeholder="Anna Meikäläinen"
            />

            <Input
              label="Puhelinnumero"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+358 40 123 4567"
              keyboardType="phone-pad"
            />

            <Button
              title="Tallenna"
              onPress={handleSaveProfile}
              loading={saving}
            />
          </View>
        </View>

        {/* Children */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lapset</Text>
            <TouchableOpacity
              onPress={() => setShowAddChild(!showAddChild)}
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>
                {showAddChild ? 'Peruuta' : '+ Lisää'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddChild && (
            <View style={styles.addChildCard}>
              <Input
                label="Lapsen nimi"
                value={childName}
                onChangeText={setChildName}
                placeholder="Matti"
              />
              <Input
                label="Ikä"
                value={childAge}
                onChangeText={setChildAge}
                placeholder="3"
                keyboardType="numeric"
              />
              <Button
                title="Lisää lapsi"
                onPress={handleAddChild}
                variant="secondary"
              />
            </View>
          )}

          {children.length === 0 && !showAddChild ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Ei lisättyjä lapsia vielä
              </Text>
              <Text style={styles.emptyHint}>
                Lisää lapsesi tiedot, niin muut näkevät ketkä ovat tulossa leikkimään
              </Text>
            </View>
          ) : (
            children.map((child, index) => (
              <View key={index} style={styles.childCard}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>
                    {child.name[0]?.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childAge}>
                    {child.age} {child.age === 1 ? 'vuosi' : 'vuotta'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveChild(index)}
                  style={styles.removeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeButtonText}>Poista</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asetukset</Text>
          <View style={styles.card}>
            <Button
              title="Kirjaudu ulos"
              onPress={handleLogout}
              variant="ghost"
            />
          </View>
        </View>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  headerName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  headerEmail: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: spacing.xl,
    marginTop: -spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  addButtonText: {
    color: colors.secondary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
  addChildCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  childAvatarText: {
    color: colors.accent,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontWeight: typography.weights.semibold,
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  childAge: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  removeButton: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  removeButtonText: {
    color: colors.error,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
});

export default ProfileScreen;
