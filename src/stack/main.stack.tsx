import React, {useEffect, useState} from 'react';
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
import useAuthStore from '@/store/useAuth';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {userAPI} from '@/api/user';
import {branchesAPI} from '@/api/branches';
import useDateStore from '@/store/useDateStore';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [loading, setLoading] = useState(true);
  const {token, _hasHydrated, setUser, user} = useAuthStore();
  const {setSelectedBranchBranch} = useDateStore();

  useEffect(() => {
    if (user) return;
    const fetchUser = async () => {
      try {
        const res = (await userAPI.me()) as any;
        if (res?.current_branch && res?.active) {
          const branch = await branchesAPI.getById(res?.current_branch);
          setSelectedBranchBranch(branch?.branch);
        }
        setUser(res);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [_hasHydrated, user]);

  return !_hasHydrated || loading ? (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  ) : (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={
        token
          ? user?.current_branch && user?.active
            ? 'HomeScreen'
            : 'CalenderScreen'
          : 'LoginScreen'
      }>
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
