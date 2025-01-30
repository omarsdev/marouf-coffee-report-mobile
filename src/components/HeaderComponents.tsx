import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import PersonIcon from '@/assets/svg/PersonIcon';
import {normalize} from '@/utils';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dropdown, IDropdownRef} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';

const data = [
  {
    label: 'Profile',
    icon: <PersonIcon fill="#000" />,
    value: '1',
    screenName: '',
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
    screenName: 'BranchTasksScreen',
  },
  {
    label: 'Previous Visits',
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
  {
    label: 'Log out',
    icon: <MaterialIcons name="logout" color="black" size={20} />,
    value: '7',
    screenName: '',
  },
];

const HeaderComponents = () => {
  const navigation = useNavigation();

  const ref = useRef<IDropdownRef>(null);

  const [value, setValue] = useState<string | null>(null);

  return (
    <View className="relative">
      <View className="flex-row px-6 py-3 items-center justify-between bg-[#F3F3F3] rounded-2xl">
        <View className="flex-row items-center gap-x-5">
          <View className="items-center justify-center bg-black rounded-full px-4 py-3">
            <PersonIcon />
          </View>
          <Text className="font-poppins" style={{fontSize: normalize(20)}}>
            Mohamad Ahmad
          </Text>
        </View>
        <TouchableOpacity onPress={ref.current?.open}>
          <Feather name="menu" size={normalize(30)} />
        </TouchableOpacity>
      </View>
      <View className="absolute z-10 w-full top-10">
        <Dropdown
          ref={ref}
          data={data}
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
