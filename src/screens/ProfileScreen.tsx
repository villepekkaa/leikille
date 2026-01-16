import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
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
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Ladataan...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-primary-600 px-6 pt-12 pb-20">
        <Text className="text-3xl font-bold text-white mb-2">Profiili</Text>
        <Text className="text-primary-100">{user?.email}</Text>
      </View>

      <View className="px-6 -mt-12">
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
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

        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              Lapset ({children.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddChild(!showAddChild)}
              className="bg-secondary-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">
                {showAddChild ? 'Peruuta' : '+ Lisää lapsi'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddChild && (
            <View className="bg-gray-50 p-4 rounded-lg mb-4">
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
            <View className="py-8 items-center">
              <Text className="text-5xl mb-2">👶</Text>
              <Text className="text-gray-600">Ei lisättyjä lapsia</Text>
            </View>
          ) : (
            children.map((child, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-gray-50 rounded-lg p-4 mb-2"
              >
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-lg">
                    {child.name}
                  </Text>
                  <Text className="text-gray-600">
                    {child.age} {child.age === 1 ? 'vuosi' : 'vuotta'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveChild(index)}
                  className="bg-red-100 px-3 py-2 rounded-lg"
                >
                  <Text className="text-red-600 font-semibold">Poista</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
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

export default ProfileScreen;
