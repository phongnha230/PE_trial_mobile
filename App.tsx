import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/core/providers/AppProvider';
import { RootNavigator } from './src/core/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
