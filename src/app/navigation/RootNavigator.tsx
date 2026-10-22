import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { colors } from '../../shared/theme/colors';

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Prevent any flash of content or incorrect navigation while checking auth status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
