import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, ActivityIndicator} from 'react-native';

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
import useDateStore from '@/store/useDateStore';

import {userAPI} from '@/api/user';
import {branchesAPI} from '@/api/branches';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [loading, setLoading] = useState(true);
  const {token, _hasHydrated, setUser, user} = useAuthStore();
  const {setSelectedBranchBranch} = useDateStore();

  // Function to Fetch User Data
  const fetchUser = useCallback(async () => {
    try {
      const res = await userAPI.me();
      if (res?.current_branch && res?.active) {
        const branch = await branchesAPI.getById(res?.current_branch);
        setSelectedBranchBranch(branch?.branch);
      }
      setUser(res);
    } finally {
      setLoading(false);
    }
  }, [setUser, setSelectedBranchBranch]);

  // Fetch User Data on Hydration or Token Change
  useEffect(() => {
    if (_hasHydrated && token && !user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [_hasHydrated, token, fetchUser]);

  // Determine Initial Route Efficiently
  const initialRoute = useMemo(() => {
    if (!token) return 'LoginScreen';
    return user?.current_branch && user?.active
      ? 'HomeScreen'
      : 'CalenderScreen';
  }, [token, user]);

  return (
    <CustomLoadingProvider loading={!_hasHydrated || loading}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRoute}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CalenderScreen" component={CalenderScreen} />
        <Stack.Screen name="SeeScheduleScreen" component={SeeScheduleScreen} />
        <Stack.Screen
          name="ChooseBranchScreen"
          component={ChooseBranchScreen}
        />
        <Stack.Screen name="BranchTasksScreen" component={BranchTasksScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="PreviousReportsScreen"
          component={PreviousReportsScreen}
        />
        <Stack.Screen name="TicketsScreen" component={TicketsScreen} />
        <Stack.Screen name="AddTicketsScreen" component={AddTicketsScreen} />
      </Stack.Navigator>
    </CustomLoadingProvider>
  );
};

export default MainStack;
