import {View, Text} from 'react-native';
import React from 'react';
import PersonIcon from '@/assets/svg/PersonIcon';
import {normalize} from '@/utils';
import Feather from 'react-native-vector-icons/Feather';

const HeaderComponents = () => {
  return (
    <View className="flex-row px-6 py-3 items-center justify-between bg-[#F3F3F3] rounded-2xl">
      <View className="flex-row items-center gap-x-5">
        <View className="items-center justify-center bg-black rounded-full px-4 py-3">
          <PersonIcon />
        </View>
        <Text className="font-poppins" style={{fontSize: normalize(20)}}>
          Mohamad Ahmad
        </Text>
      </View>
      <View>
        <Feather name="menu" size={normalize(30)} />
      </View>
    </View>
  );
};

export default HeaderComponents;
