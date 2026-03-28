import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import { saveToken } from '@/api/keychain';
import { login } from '@/api/userApi';
import { MaterialButton } from '@/components/MaterialButton';
import { MaterialCard } from '@/components/MaterialCard';
import { MaterialInput } from '@/components/MaterialInput';
import { usePublicRoute } from '@/hooks/useAuthRoute';

// Dummy credentials for demo
const DUMMY_EMAIL = 'mohitkumar111';
const DUMMY_PASSWORD = '123456';

export default function LoginScreen() {
  usePublicRoute();
  const [email, setEmail] = useState(DUMMY_EMAIL);
  const [password, setPassword] = useState(DUMMY_PASSWORD);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password');
      setShowError(true);
      return;
    }

    // Simulate login process
    setIsLoading(true);
    
    try {
      const response = await login({ username: email, password });
      if (response.status === 200) {
        // setIsLoading(false);
        setErrorMessage('');
        setShowError(false);
        await saveToken('userToken', response.data.access_token);
        
        // Navigate to home screen
       router.replace('/business');
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid email or password. Try admin@example.com / password123');
        setShowError(true);
      }
    } catch (error) {
      //setMessage("Network error: " + error.message);
      console.error('Login error:', error);
      setIsLoading(false);
    }
   
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to your account
        </Text>
      </View>

      <MaterialCard title="Login" subtitle="Enter your credentials">
        <MaterialInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="admin@example.com"
          mode="outlined"
          editable={!isLoading}
        />
        <View style={styles.inputSpacing} />
        <MaterialInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          mode="outlined"
          secureTextEntry
          editable={!isLoading}
        />
        <View style={styles.inputSpacing} />
        <MaterialButton
          label={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleLogin}
          mode="contained"
          disabled={isLoading}
          loading={isLoading}
        />
      </MaterialCard>

      <View style={styles.demoCredentials}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Demo Credentials:
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Email: admin@example.com
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Password: password123
        </Text>
      </View>

      <Portal>
        <Dialog visible={showError} onDismiss={() => setShowError(false)}>
          <Dialog.Title>Login Error</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{errorMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowError(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  inputSpacing: {
    height: 12,
  },
  demoCredentials: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(103, 80, 164, 0.1)',
  },
});
