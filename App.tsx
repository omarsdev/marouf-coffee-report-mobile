import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import MainStack from './src/stack/main.stack';
import './global.css';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
