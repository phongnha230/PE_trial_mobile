import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../shared/theme/colors';
import { AuthStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="book" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>BookShelf</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="button"
          >
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Ionicons name="library" size={48} color={colors.primary} />
          </View>
          <Text testID="home-title" style={styles.title}>
            BookShelf
          </Text>
          <Text style={styles.subtitle}>
            Your personal digital sanctuary for organizing, tracking, and cherishing your reading journey.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Features</Text>

          <View style={styles.card}>
            <View style={[styles.cardIconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="bookmark" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Track your books</Text>
              <Text style={styles.cardDesc}>
                Maintain your private catalog with authors, genres, ratings, and personal notes.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="filter" size={24} color="#D97706" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Sort by status</Text>
              <Text style={styles.cardDesc}>
                Seamlessly organize into To Read, Reading, and Finished shelves with instant filtering.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIconWrapper, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="star" size={24} color="#DB2777" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Rate your favorites</Text>
              <Text style={styles.cardDesc}>
                Star your top picks and view dynamic real-time summaries of your reading library.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  loginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  loginBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  registerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  featuresSection: {
    marginTop: 16,
    gap: 14,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
