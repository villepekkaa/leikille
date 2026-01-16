import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
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
    } catch (error: any) {
      Alert.alert('Virhe', error.message || 'Rekisteröinti epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Luo tili 🎉</Text>
        <Text style={styles.subtitle}>
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Onko sinulla jo tili? </Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}
          >
            Kirjaudu sisään
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
  },
  linkText: {
    color: '#dc2626',
    fontWeight: '600',
  },
});

export default RegisterScreen;
