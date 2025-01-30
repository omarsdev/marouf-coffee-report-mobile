import React from 'react';
import {View, Text} from 'react-native';

import ContainerComponents from '@/components/container/ContainerComponents';
import HeaderComponents from '@/components/HeaderComponents';
import CalenderComponents from '@/components/CalenderComponents';
import CustomButton from '@/components/custom/CustomButton';
import {useNavigation} from '@react-navigation/native';
import useDateStore from '@/store/useDateStore';
import {twMerge} from 'tailwind-merge';

const CalenderScreen = () => {
  const {date} = useDateStore();
  const navigation = useNavigation();

  return (
    <ContainerComponents>
      <HeaderComponents />
      <View className="flex-1 mt-10">
        <CalenderComponents />
      </View>
      <CustomButton
        disabled={!date}
        className={twMerge(!date && 'opacity-50')}
        onPress={() => navigation.navigate('SeeScheduleScreen')}
        title="Next"
      />
    </ContainerComponents>
  );
};

export default CalenderScreen;
