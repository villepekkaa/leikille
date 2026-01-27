import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { colors, spacing, typography } from '../theme';

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>leikille</Text>
          </View>
          <Text style={styles.title}>Tervetuloa takaisin</Text>
          <Text style={styles.subtitle}>
            Kirjaudu sisään löytääksesi leikkitreffejä läheltäsi
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Sähköposti"
            value={email}
            onChangeText={setEmail}
            placeholder="anna@esimerkki.fi"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Salasana"
            value={password}
            onChangeText={setPassword}
            placeholder="Salasanasi"
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Kirjaudu sisään"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Eikö sinulla ole tiliä? </Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Register')}
          >
            Luo tili
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWarm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl * 1.5,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
  },
  form: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
  },
});

export default LoginScreen;
