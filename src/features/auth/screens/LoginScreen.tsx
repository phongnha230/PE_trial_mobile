import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../shared/theme/colors';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../../../shared/utils/validators';
import { CustomTextInput } from '../../../shared/components/inputs/CustomTextInput';
import { Button } from '../../../shared/components/buttons/Button';
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner';
import { AuthStackParamList } from '../../../app/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (currentEmail: string, currentPassword: string) => {
    const errs: { email?: string; password?: string } = {};
    const emailErr = validateEmail(currentEmail);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(currentPassword, false);
    if (passErr) errs.password = passErr;

    return errs;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (hasSubmitted) {
      const fieldErrors = validate(text, password);
      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email,
      }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (hasSubmitted) {
      const fieldErrors = validate(email, text);
      setErrors((prev) => ({
        ...prev,
        password: fieldErrors.password,
      }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setFirebaseError('');

    const validationErrors = validate(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      let message = err.message || 'Authentication error';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'The email address is badly formatted.';
      }
      setFirebaseError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your BookShelf</Text>
          </View>

          {/* Firebase Error */}
          <ErrorBanner testID="error-auth" message={firebaseError} />

          <View style={styles.form}>
            <CustomTextInput
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChangeText={handleEmailChange}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <CustomTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Login"
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  form: {
    gap: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
