import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '@/screens/login/Login.Screen';
import CalenderScreen from '@/screens/calender/CalenderScreen';
import SeeScheduleScreen from '@/screens/see-schedule/SeeScheduleScreen';
import ChooseBranchScreen from '@/screens/choose-branch/ChooseBranchScreen';
import BranchTasksScreen from '@/screens/branch-tasks/BranchTasksScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import PreviousReportsScreen from '@/screens/previous-reports/PreviousReportsScreen';
import TicketsScreen from '@/screens/tickets/TicketsScreen';
import AddTicketsScreen from '@/screens/add-tickets/AddTicketsScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="CalenderScreen" component={CalenderScreen} />
      <Stack.Screen name="SeeScheduleScreen" component={SeeScheduleScreen} />
      <Stack.Screen name="ChooseBranchScreen" component={ChooseBranchScreen} />
      <Stack.Screen name="BranchTasksScreen" component={BranchTasksScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="PreviousReportsScreen"
        component={PreviousReportsScreen}
      />
      <Stack.Screen name="TicketsScreen" component={TicketsScreen} />
      <Stack.Screen name="AddTicketsScreen" component={AddTicketsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
