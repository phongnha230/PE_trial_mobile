import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface SuccessBannerProps {
  message: string;
  testID?: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ message, testID }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      <Text testID={testID} style={styles.text}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  text: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
