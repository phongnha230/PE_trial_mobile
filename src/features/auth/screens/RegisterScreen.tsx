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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../../shared/utils/validators';
import { CustomTextInput } from '../../../shared/components/inputs/CustomTextInput';
import { Button } from '../../../shared/components/buttons/Button';
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner';
import { SuccessBanner } from '../../../shared/components/feedback/SuccessBanner';
import { AuthStackParamList } from '../../../core/navigation/types';
import { EXACT_MESSAGES } from '../../../shared/constants/appConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (e: string, p: string, cp: string) => {
    const errs: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const emailErr = validateEmail(e);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(p, true);
    if (passErr) errs.password = passErr;

    const confirmErr = validateConfirmPassword(cp, p);
    if (confirmErr) errs.confirmPassword = confirmErr;

    return errs;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (hasSubmitted) {
      const fieldErrors = validate(text, password, confirmPassword);
      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email,
      }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (hasSubmitted) {
      const fieldErrors = validate(email, text, confirmPassword);
      setErrors((prev) => ({
        ...prev,
        password: fieldErrors.password,
        confirmPassword: fieldErrors.confirmPassword,
      }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (hasSubmitted) {
      const fieldErrors = validate(email, password, text);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: fieldErrors.confirmPassword,
      }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setFirebaseError('');
    setSuccessMessage('');

    const validationErrors = validate(email, password, confirmPassword);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      setSuccessMessage(EXACT_MESSAGES.REGISTRATION_SUCCESSFUL);
    } catch (err: any) {
      let message = err.message || 'Authentication error';
      if (err.code === 'auth/email-already-in-use') {
        message = 'The email address is already in use by another account.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'The email address is badly formatted.';
      } else if (err.code === 'auth/weak-password') {
        message = 'The password is too weak.';
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start organizing your books</Text>
          </View>

          {/* Form Success Message */}
          <SuccessBanner testID="form-success" message={successMessage} />

          {/* Firebase Error Message */}
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
              placeholder="At least 6 characters"
              value={password}
              onChangeText={handlePasswordChange}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <CustomTextInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={errors.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Register"
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Sign In</Text>
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
    marginTop: 16,
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
