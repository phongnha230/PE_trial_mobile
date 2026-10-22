import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface ErrorBannerProps {
  message: string;
  testID?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, testID }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={20} color={colors.error} />
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
    backgroundColor: colors.errorBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  text: {
    color: colors.error,
    fontSize: 14,
    flex: 1,
  },
});
