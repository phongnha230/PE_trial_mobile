import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { BookSummaryData } from '../types/book.types';

interface BookSummaryProps {
  summary: BookSummaryData;
}

export const BookSummary: React.FC<BookSummaryProps> = ({ summary }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Summary</Text>
      <View style={styles.countsRow}>
        <View style={styles.countBox}>
          <Text style={styles.countLabel}>Total Books</Text>
          <Text testID="book-count" style={styles.countNumber}>
            {summary.totalCount}
          </Text>
        </View>
        <View style={styles.countBox}>
          <Text style={styles.countLabel}>Favorites</Text>
          <Text testID="favorite-count" style={styles.countNumber}>
            {summary.favoriteCount}
          </Text>
        </View>
      </View>

      {/* Status Breakdown */}
      {summary.breakdown.length > 0 && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
          {summary.breakdown.map((item) => (
            <View key={item.status} style={styles.breakdownRow}>
              <Text style={styles.statusName}>{item.status}</Text>
              <Text style={styles.statusCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  countsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  breakdownContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 4,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  statusName: {
    fontSize: 13,
    color: colors.text,
  },
  statusCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
