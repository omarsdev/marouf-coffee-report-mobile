import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import PersonIcon from '@/assets/svg/PersonIcon';
import {normalize} from '@/utils';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dropdown, IDropdownRef} from 'react-native-element-dropdown';
import {CommonActions, useNavigation} from '@react-navigation/native';
import useAuthStore from '@/store/useAuth';
import {checkAPI} from '@/api/check';
import Permission from 'react-native-permissions';
import useDateStore from '@/store/useDateStore';
import {getCurrentLocation} from '@/utils/location';

const data = [
  {
    label: 'Tasks',
    icon: <Feather name="info" color="black" size={20} />,
    value: '1',
    screenName: 'TasksScreen',
  },
  {
    label: 'Schedule',
    icon: <Ionicons name="calendar" color="black" size={20} />,
    value: '2',
    screenName: 'CalenderScreen',
  },
  {
    label: 'Branch',
    icon: <FontAwesome6 name="store" color="black" size={20} />,
    value: '3',
    screenName: 'ChooseBranchScreen',
  },
  {
    label: 'Checklist',
    icon: <FontAwesome5 name="tasks" color="black" size={20} />,
    value: '4',
    screenName: 'HomeScreen',
  },
  {
    label: 'Previous Reports',
    icon: <FontAwesome6 name="clock-rotate-left" color="black" size={20} />,
    value: '5',
    screenName: 'PreviousReportsScreen',
  },
  {
    label: 'Tickets',
    icon: <Entypo name="news" color="black" size={20} />,
    value: '6',
    screenName: 'TicketsScreen',
  },
];

const HeaderComponents = () => {
  const navigation = useNavigation();
  const {user, resetAuthStore, refetchUser, isAreaManager} = useAuthStore();
  const {selectedBranch, resetDateStore} = useDateStore();

  const ref = useRef<IDropdownRef>(null);

  const [value, setValue] = useState<string | null>(null);

  const onLogoutHandler = async () => {
    try {
      if (user?.current_branch && user?.active) {
        Permission.request(
          Platform.OS === 'ios'
            ? 'ios.permission.LOCATION_WHEN_IN_USE'
            : 'android.permission.ACCESS_FINE_LOCATION',
        ).then(async () => {
          const {latitude, longitude} = await getCurrentLocation();
          const res = await checkAPI.out({
            branch: selectedBranch?._id,
            lat: latitude,
            lng: longitude,
          });
          await refetchUser();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            }),
          );
          resetDateStore();
          resetAuthStore();
        });
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          }),
        );
        resetDateStore();
        resetAuthStore();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logoutHeader = {
    label: 'Log out',
    icon: <MaterialIcons name="logout" color="black" size={20} />,
    value: '7',
    screenName: '',
    onPressFunc: onLogoutHandler,
  };

  const headersData = useMemo(() => {
    if (isAreaManager) return data;
    return data.filter(e => !['ChooseBranchScreen'].includes(e.screenName));
  }, [isAreaManager, data]);

  return (
    <View className="relative">
      <View className="flex-row px-6 py-3 items-center justify-between bg-[#F3F3F3] rounded-2xl">
        <View className="flex-row items-center gap-x-5">
          <View className="items-center justify-center bg-black rounded-full px-4 py-3">
            <PersonIcon />
          </View>
          <Text className="font-poppins" style={{fontSize: normalize(20)}}>
            {user?.name?.en}
          </Text>
        </View>
        <TouchableOpacity onPress={ref.current?.open}>
          <Feather name="menu" size={normalize(30)} />
        </TouchableOpacity>
      </View>
      <View className="absolute z-10 w-full top-10">
        <Dropdown
          ref={ref}
          data={[...headersData, logoutHeader]}
          labelField=""
          valueField=""
          placeholder=""
          value={value}
          onChange={item => setValue(item.value)}
          renderLeftIcon={() => null}
          renderRightIcon={() => null}
          renderItem={item => (
            <TouchableOpacity
              className="my-4 items-center ml-9 flex-row gap-6"
              onPress={() => {
                if (item.screenName) {
                  navigation.navigate(item.screenName);
                  ref.current?.close();
                } else if (item.onPressFunc) {
                  item.onPressFunc();
                }
              }}>
              {item.icon}
              <Text className="font-poppins" style={{fontSize: normalize(20)}}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          style={{
            width: '100%',
          }}
        />
      </View>
    </View>
  );
};

export default HeaderComponents;
