import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QuoteProvider } from './src/features/quote/context/QuoteContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/shared/theme/colors';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'ALUX — Carpintería de Aluminio & Vidrio Arquitectónico';
    }
  }, []);

  return (
    <SafeAreaProvider>
      <QuoteProvider>
        <View style={styles.root}>
          <StatusBar style="dark" />
          <AppNavigator />
        </View>
      </QuoteProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
