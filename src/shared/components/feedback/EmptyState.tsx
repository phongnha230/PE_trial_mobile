import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface EmptyStateProps {
  message?: string;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No books found',
  testID = 'books-empty',
}) => {
  return (
    <View testID={testID} style={styles.container}>
      <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
