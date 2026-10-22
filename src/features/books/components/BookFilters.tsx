import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../shared/theme/colors';
import { FILTER_GENRES, FILTER_STATUSES } from '../../../shared/constants/appConstants';
import { BookFilterState } from '../types/book.types';

interface BookFiltersProps {
  filters: BookFilterState;
  onFilterChange: (newFilters: Partial<BookFilterState>) => void;
  onClearFilters: () => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitle}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
          <Text style={styles.title}>Filter & Search</Text>
        </View>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={onClearFilters}
          accessibilityRole="button"
        >
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Search box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or author..."
          placeholderTextColor={colors.textSecondary}
          value={filters.searchQuery}
          onChangeText={(text) => onFilterChange({ searchQuery: text })}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Dropdowns Row: Genre & Status */}
      <View style={styles.dropdownsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dropdownLabel}>Genre:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filters.genre}
              onValueChange={(val) => onFilterChange({ genre: val })}
              style={styles.picker}
            >
              {FILTER_GENRES.map((g) => (
                <Picker.Item key={g} label={g} value={g} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.dropdownLabel}>Status:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filters.status}
              onValueChange={(val) => onFilterChange({ status: val })}
              style={styles.picker}
            >
              {FILTER_STATUSES.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Favorites only switch */}
      <View style={styles.favSwitchRow}>
        <View style={styles.favLabelGroup}>
          <Ionicons name="star" size={18} color={colors.star} />
          <Text style={styles.favSwitchLabel}>Favorites only</Text>
        </View>
        <Switch
          value={filters.favoritesOnly}
          onValueChange={(val) => onFilterChange({ favoritesOnly: val })}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 100 : 40,
  },
  favSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  favLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favSwitchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
