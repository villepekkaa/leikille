import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Virhe', 'Salasanat eivät täsmää');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Virhe', 'Salasanan tulee olla vähintään 6 merkkiä');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      // Tässä voidaan myös tallentaa käyttäjän lisätiedot Firestoreen
    } catch (error: any) {
      Alert.alert('Virhe', error.message || 'Rekisteröinti epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Luo tili 🎉
        </Text>
        <Text className="text-gray-600 mb-8">
          Aloita leikkitreffien järjestäminen
        </Text>

        <Input
          label="Nimi"
          value={name}
          onChangeText={setName}
          placeholder="Anna Meikäläinen"
        />

        <Input
          label="Sähköposti"
          value={email}
          onChangeText={setEmail}
          placeholder="anna@esimerkki.fi"
          keyboardType="email-address"
        />

        <Input
          label="Salasana"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Input
          label="Vahvista salasana"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Button
          title="Rekisteröidy"
          onPress={handleRegister}
          loading={loading}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Onko sinulla jo tili? </Text>
          <Text
            className="text-primary-600 font-semibold"
            onPress={() => navigation.navigate('Login')}
          >
            Kirjaudu sisään
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
