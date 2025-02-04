import React, {useEffect} from 'react';
import {
  AppState,
  AppStateStatus,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import MainStack from './src/stack/main.stack';
import './global.css';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={navTheme}>
        <MainStack />
        <FlashMessage
          position="top"
          titleStyle={styles.centerText}
          statusBarHeight={StatusBar.currentHeight}
        />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerText: {textAlign: 'center'},
});
