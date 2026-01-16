import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Playdate } from '../types';
import { PlaydateCard } from '../components/PlaydateCard';
import { firestoreService } from '../services/firestore.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlaydates = async () => {
    try {
      const data = await firestoreService.playdates.getTodaysPlaydates();
      setPlaydates(data);
    } catch (error) {
      console.error('Error loading playdates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlaydates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlaydates();
  };

  const handlePlaydatePress = (playdateId: string) => {
    navigation.navigate('PlaydateDetail', { playdateId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Ladataan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Tänään {new Date().toLocaleDateString('fi-FI', { 
            day: 'numeric', 
            month: 'long' 
          })}
        </Text>
        <Text style={styles.headerSubtitle}>
          {playdates.length} leikkiä järjestetty
        </Text>
      </View>

      <FlatList
        data={playdates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlaydateCard
            playdate={item}
            onPress={() => handlePlaydatePress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎈</Text>
            <Text style={styles.emptyTitle}>Ei leikkejä tänään</Text>
            <Text style={styles.emptySubtitle}>
              Vedä alas päivittääksesi tai luo uusi leikki
            </Text>
          </View>
        }
      />
    </View>
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
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;

