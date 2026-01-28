import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList, AuthStackParamList, TabParamList } from '../types';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import PlaydateDetailScreen from '../screens/PlaydateDetailScreen';
import CreatePlaydateScreen from '../screens/CreatePlaydateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
  </View>
);

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgroundWarm },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Koti',
          headerTitle: 'Leikille',
          tabBarIcon: ({ focused }) => <TabIcon icon="◉" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CreatePlaydate"
        component={CreatePlaydateScreen}
        options={{
          title: 'Uusi',
          headerTitle: 'Luo leikki',
          tabBarIcon: ({ focused }) => <TabIcon icon="+" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profiili',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="●" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PlaydateDetail" 
        component={PlaydateDetailScreen}
        options={{ 
          title: 'Leikki',
          headerTransparent: true,
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xs,
  },
  tabBarItem: {
    paddingTop: spacing.xs,
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  tabIconActive: {
    color: colors.primary,
  },
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
});
