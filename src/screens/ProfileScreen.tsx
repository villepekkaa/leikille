import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, User, Child } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { firestoreService } from '../services/firestore.service';

type Props = NativeStackScreenProps<TabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Uuden lapsen lisäyslomake
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
        // Jos käyttäjätietoja ei ole, asetetaan oletusarvot
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

      Alert.alert('Onnistui!', 'Profiili päivitetty');
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
      'Haluatko varmasti poistaa lapsen?',
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
        <Text style={styles.loadingText}>Ladataan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profiili</Text>
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Perustiedot
          </Text>

          <Input
            label="Nimi *"
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
            title="Tallenna tiedot"
            onPress={handleSaveProfile}
            loading={saving}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Lapset ({children.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddChild(!showAddChild)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>
                {showAddChild ? 'Peruuta' : '+ Lisää lapsi'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddChild && (
            <View style={styles.addChildForm}>
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
                title="Lisää"
                onPress={handleAddChild}
                variant="secondary"
              />
            </View>
          )}

          {children.length === 0 ? (
            <View style={styles.emptyChildren}>
              <Text style={styles.emptyIcon}>👶</Text>
              <Text style={styles.emptyText}>Ei lisättyjä lapsia</Text>
            </View>
          ) : (
            children.map((child, index) => (
              <View
                key={index}
                style={styles.childCard}
              >
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>
                    {child.name}
                  </Text>
                  <Text style={styles.childAge}>
                    {child.age} {child.age === 1 ? 'vuosi' : 'vuotta'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveChild(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Poista</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Asetukset
          </Text>
          
          <Button
            title="Kirjaudu ulos"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    color: '#6b7280',
  },
  headerContainer: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 80,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerEmail: {
    color: '#fecaca',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: -48,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addChildForm: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyChildren: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 18,
  },
  childAge: {
    color: '#6b7280',
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#dc2626',
    fontWeight: '600',
  },
});

export default ProfileScreen;
