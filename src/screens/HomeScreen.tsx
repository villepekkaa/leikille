import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
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
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Ladataan...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Tänään {new Date().toLocaleDateString('fi-FI', { 
            day: 'numeric', 
            month: 'long' 
          })}
        </Text>
        <Text className="text-gray-600 mt-1">
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
        contentContainerClassName="px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">🎈</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Ei leikkejä tänään
            </Text>
            <Text className="text-gray-600 text-center">
              Vedä alas päivittääksesi tai luo uusi leikki
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;

