import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Playdate } from '../types';

interface PlaydateCardProps {
  playdate: Playdate;
  onPress: () => void;
}

export const PlaydateCard: React.FC<PlaydateCardProps> = ({ playdate, onPress }) => {
  const childrenCount = playdate.participants.reduce(
    (acc, p) => acc + p.childrenCount,
    0
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900 flex-1">
          {playdate.title}
        </Text>
        <View className="bg-primary-100 px-3 py-1 rounded-full">
          <Text className="text-primary-700 text-xs font-medium">
            {playdate.startTime} - {playdate.endTime}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Text className="text-gray-600 text-sm">📍 {playdate.location.name}</Text>
      </View>

      <View className="flex-row items-center space-x-4">
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            👤 {playdate.participants.length} perhettä
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            👶 {childrenCount} lasta
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm">
            🎂 {playdate.ageRange.min}-{playdate.ageRange.max}v
          </Text>
        </View>
      </View>

      {playdate.description && (
        <Text className="text-gray-500 text-sm mt-2" numberOfLines={2}>
          {playdate.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};
