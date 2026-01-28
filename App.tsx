import React from 'react';
import { TailwindProvider } from 'tailwindcss-react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

const App: React.FC = () => {
  return (
    <TailwindProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </TailwindProvider>
  );
};

export default App;
