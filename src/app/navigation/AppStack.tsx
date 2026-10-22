import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import { BookListScreen } from '../../features/books/screens/BookListScreen';
import { BookDetailScreen } from '../../features/books/screens/BookDetailScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="List"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="List" component={BookListScreen} />
      <Stack.Screen name="Detail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
};
