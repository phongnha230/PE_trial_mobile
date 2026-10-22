import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/app/providers/AppProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
