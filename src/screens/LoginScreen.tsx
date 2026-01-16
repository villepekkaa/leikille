import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Virhe', error.message || 'Kirjautuminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Tervetuloa takaisin! 👋
        </Text>
        <Text className="text-gray-600 mb-8">
          Kirjaudu sisään löytääksesi leikkitreffejä
        </Text>

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

        <Button
          title="Kirjaudu sisään"
          onPress={handleLogin}
          loading={loading}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Eikö sinulla ole tiliä? </Text>
          <Text
            className="text-primary-600 font-semibold"
            onPress={() => navigation.navigate('Register')}
          >
            Rekisteröidy
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
